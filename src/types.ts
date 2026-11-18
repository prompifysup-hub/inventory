import type { Identifier } from "ra-core";

export type ThemeName = "light" | "dark";

export type Category = { id: Identifier; name: string };


export type Product = {
  id: Identifier;
  sku: string;
  material_id?: string | null;
  /** The item name. */
  reference: string;
  unit?: string | null;
  category_id?: Identifier | null;
  location_id?: Identifier | null;
  stock: number;
  description?: string | null;
  cost?: number;
  reorder_level?: number;
  supplier_id?: Identifier | null;
  /** Computed: stock is at or below reorder_level. */
  low_stock?: boolean;
};

export type Supplier = {
  id: Identifier;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
};

export type StockMovementType = "in" | "out" | "adjustment" | "transfer";

export type StockMovement = {
  id: Identifier;
  product_id: Identifier;
  type: StockMovementType;
  /** Positive adds stock, negative removes it. */
  quantity: number;
  reason?: string;
  reference?: string;
  date: string;
  /** For transfers: where the item was moved to. */
  to_location_id?: Identifier | null;
};

export type PurchaseOrderStatus = "draft" | "ordered" | "received" | "cancelled";

export type PurchaseOrderItem = { product_id: Identifier; quantity: number; unit_cost: number };

export type PurchaseOrder = {
  id: Identifier;
  reference: string;
  supplier_id: Identifier;
  date: string;
  expected_date?: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  total: number;
  notes?: string;
};

/** Ids in URLs are text; the local demo data uses numbers, Prompify uses uuids. */
export const idFromParam = (value: string | null): Identifier | undefined =>
  value === null || value === "" ? undefined : /^\d+$/.test(value) ? Number(value) : value;
