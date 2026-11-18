/*
 * Connects the app to Prompify's database.
 *
 * All screens use a standard ra-core data provider. Underneath, an in-browser FakeRest database
 * (filters, sorting, search, references) is filled from the Prompify tables in TABLES on start-up,
 * and every create / update / delete is written to Prompify first and then applied in the browser.
 * Outside Prompify (no /env-config.js) the demo data in ./demoData.ts is used instead.
 *
 * Inventory rules live in the lifecycle callbacks at the bottom:
 * - a stock movement changes its product's stock;
 * - marking a purchase order "received" books its items in;
 * - a "transfer" movement moves its item to another location (stock unchanged);
 * - products get `low_stock` (stock at or below reorder_level) for filters and badges.
 */
import { withLifecycleCallbacks, type DataProvider, type Identifier } from "ra-core";
import fakeRestDataProvider from "ra-data-fakerest";
import { isConnected, prompifyTable } from "./api";

/** Tables stored in Prompify. Add a table here when you add a resource. */
export const TABLES = [
  "categories",
  "suppliers",
  "locations",
  "products",
  "purchase_orders",
  "stock_movements",
] as const;

/** Field names that differ from their column name ({ table: { field: column } }). */
const RENAMED: Record<string, Record<string, string>> = {};

const NUMBER_FIELDS = [
  "price", "cost", "width", "height", "stock", "sales", "reorder_level", "quantity",
  "total", "total_ex_taxes", "delivery_fees", "tax_rate", "taxes", "unit_cost",
];

const toNumber = (value: unknown) => (value === null || value === undefined || value === "" ? value : Number(value));
const list = (value: unknown): any[] => (Array.isArray(value) ? value : []);
const round = (n: number) => Math.round(n * 100) / 100;

function fromRow(table: string, row: Record<string, any>) {
  const item: Record<string, any> = { ...row };
  for (const [field, column] of Object.entries(RENAMED[table] || {})) {
    item[field] = row[column];
    delete item[column];
  }
  for (const field of NUMBER_FIELDS) if (field in item) item[field] = toNumber(item[field]);
  return item;
}

function toColumns(table: string, data: Record<string, any>) {
  const row: Record<string, any> = { ...data };
  for (const [field, column] of Object.entries(RENAMED[table] || {})) {
    if (field in row) {
      row[column] = row[field];
      delete row[field];
    }
  }
  return row;
}

/**
 * Fill derived fields and resolve names used in sample rows: basket / purchase-order items may
 * name their product ({ "product": "Cat Nose", "quantity": 2 }) instead of using its id.
 * Resolved ids are saved back once.
 */
async function prepare(db: Record<string, any[]>) {
  const byReference = new Map(db.products.map((p) => [String(p.reference).toLowerCase(), p.id]));
  const resolveItems = (items: unknown) =>
    list(items).map((item) => {
      const product_id = item.product_id ?? byReference.get(String(item.product ?? "").toLowerCase());
      const { product: _name, ...rest } = item;
      return { ...rest, product_id, quantity: Number(rest.quantity ?? 1) };
    });
  const saves: Promise<unknown>[] = [];

  db.products = db.products.map((p) => ({
    ...p,
    stock: p.stock ?? 0,
    sales: p.sales ?? 0,
    reorder_level: p.reorder_level ?? 0,
    low_stock: Number(p.stock ?? 0) <= Number(p.reorder_level ?? 0),
  }));
  const productById = new Map(db.products.map((p) => [p.id, p]));


  db.purchase_orders = db.purchase_orders.map((po) => {
    const items = resolveItems(po.items).map((i) => ({ ...i, unit_cost: Number(i.unit_cost ?? productById.get(i.product_id)?.cost ?? 0) }));
    const changed = JSON.stringify(items) !== JSON.stringify(list(po.items));
    if (changed && isConnected()) saves.push(prompifyTable.update("purchase_orders", po.id, { items }).catch(() => null));
    return { ...po, items, status: po.status || "draft", total: po.total ?? round(items.reduce((t, i) => t + i.quantity * i.unit_cost, 0)) };
  });


  db.stock_movements = db.stock_movements.map((m) => ({ ...m, date: m.date ?? m.created_at }));
  await Promise.all(saves);
  return db;
}

async function loadFromPrompify() {
  const tables = await Promise.all(TABLES.map(async (t) => [t, (await prompifyTable.list(t)).map((r) => fromRow(t, r))] as const));
  return prepare(Object.fromEntries(tables) as Record<string, any[]>);
}

/** Mirror every write of the in-browser database to Prompify. */
function withPrompifySync(base: DataProvider): DataProvider {
  const synced = (resource: string) => isConnected() && (TABLES as readonly string[]).includes(resource);
  return {
    ...base,
    async create(resource, params) {
      if (!synced(resource)) return base.create(resource, params);
      const row = await prompifyTable.create(resource, toColumns(resource, params.data));
      return base.create(resource, { ...params, data: { ...params.data, id: row.id, created_at: row.created_at } });
    },
    async update(resource, params) {
      if (synced(resource)) await prompifyTable.update(resource, params.id, toColumns(resource, params.data));
      return base.update(resource, params);
    },
    async updateMany(resource, params) {
      if (synced(resource)) await Promise.all(params.ids.map((id) => prompifyTable.update(resource, id, toColumns(resource, params.data))));
      return base.updateMany(resource, params);
    },
    async delete(resource, params) {
      if (synced(resource)) await prompifyTable.remove(resource, params.id);
      return base.delete(resource, params);
    },
    async deleteMany(resource, params) {
      if (synced(resource)) await Promise.all(params.ids.map((id) => prompifyTable.remove(resource, id)));
      return base.deleteMany(resource, params);
    },
  };
}

const numbers = (data: Record<string, any>) => {
  const out = { ...data };
  for (const field of NUMBER_FIELDS) if (field in out) out[field] = toNumber(out[field]);
  return out;
};

function build(db: Record<string, any[]>): DataProvider {
  const base = withPrompifySync(fakeRestDataProvider(db, false, 0));
  let previousStatus: Record<string, string | undefined> = {};

  // Callbacks receive the plain provider; writes made by the inventory rules use `provider`
  // (declared below, with the rules) so that they trigger the rules too.
  // eslint-disable-next-line prefer-const
  let provider: DataProvider;
  provider = withLifecycleCallbacks(base, [
    {
      resource: "products",
      beforeSave: async (data: any, dp: DataProvider) => {
        const values = numbers(data);
        let previous: any = {};
        if (data.id !== undefined && (values.stock === undefined || values.reorder_level === undefined)) {
          previous = (await dp.getOne("products", { id: data.id })).data;
        }
        const stock = Number(values.stock ?? previous.stock ?? 0);
        const reorder = Number(values.reorder_level ?? previous.reorder_level ?? 0);
        return { ...values, low_stock: stock <= reorder };
      },
    },
    {
      resource: "stock_movements",
      beforeCreate: async (params: any) => {
        const data = numbers(params.data);
        const amount = Math.abs(Number(data.quantity) || 0);
        const quantity =
          data.type === "out" ? -amount : data.type === "in" ? amount : data.type === "transfer" ? 0 : Number(data.quantity) || 0;
        return { ...params, data: { ...data, quantity, date: data.date || new Date().toISOString() } };
      },
      afterCreate: async (result: any) => {
        if (result.data.type === "transfer" && result.data.to_location_id != null) {
          const { data: product } = await provider.getOne("products", { id: result.data.product_id });
          await provider.update("products", { id: product.id, data: { location_id: result.data.to_location_id }, previousData: product });
        }
        await changeStock(provider, result.data.product_id, result.data.quantity);
        return result;
      },
    },
    {
      resource: "purchase_orders",
      // Partial updates (e.g. only { status }) must not touch the items.
      beforeSave: async (data: any) => {
        if (!("items" in data)) return data;
        const items = list(data.items).map((i) => ({ ...i, quantity: Number(i.quantity) || 0, unit_cost: Number(i.unit_cost) || 0 }));
        return { ...data, items, total: round(items.reduce((t, i) => t + i.quantity * i.unit_cost, 0)) };
      },
      beforeCreate: async (params: any) => ({
        ...params,
        data: {
          ...params.data,
          reference: params.data.reference || `PO-${Date.now().toString().slice(-6)}`,
          status: params.data.status || "draft",
          date: params.data.date || new Date().toISOString(),
        },
      }),
      beforeUpdate: async (params: any) => {
        previousStatus = { ...previousStatus, [`po-${params.id}`]: params.previousData?.status };
        return params;
      },
      afterUpdate: async (result: any) => {
        const before = previousStatus[`po-${result.data.id}`];
        if (result.data.status === "received" && before !== "received") {
          for (const item of list(result.data.items)) {
            if (item.product_id === undefined || item.product_id === null) continue;
            await provider.create("stock_movements", {
              data: { product_id: item.product_id, type: "in", quantity: item.quantity, reason: `Received ${result.data.reference}`, reference: result.data.reference },
            });
          }
        }
        return result;
      },
    },
  ]);
  return provider;
}

async function changeStock(dp: DataProvider, productId: Identifier, delta: number) {
  if (productId === undefined || productId === null || !delta) return;
  const { data: product } = await dp.getOne("products", { id: productId });
  await dp.update("products", { id: productId, data: { stock: Number(product.stock || 0) + delta }, previousData: product });
}

/** The provider must exist synchronously; every call waits for the initial load. */
// The demo data (and its generator) is only downloaded when the app runs outside Prompify.
const ready: Promise<DataProvider> = (
  isConnected() ? loadFromPrompify() : import("./demoData").then(({ createDemoData }) => prepare(createDemoData()))
).then(build);

export const dataProvider = new Proxy({} as DataProvider, {
  get(_target, method: string) {
    if (method === "then") return undefined;
    return (...args: unknown[]) => ready.then((provider) => (provider as any)[method](...args));
  },
});
