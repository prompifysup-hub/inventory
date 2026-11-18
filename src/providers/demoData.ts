/* Demo data used ONLY when the app runs outside Prompify (local preview). */
const daysAgo = (n: number) => new Date(Date.now() - n * 864e5).toISOString();

export function createDemoData() {
  const categories = ["Fasteners", "Packaging", "Raw materials", "Spare parts"].map((name, id) => ({ id, name }));
  const suppliers = [
    { id: 0, name: "Metalworks Ltd", contact_name: "Hannah Price", email: "orders@metalworks.example", phone: "+44 20 7946 0101", city: "Leeds", country: "UK" },
    { id: 1, name: "PackRight", contact_name: "Lucas Moreau", email: "sales@packright.example", phone: "+33 1 84 88 20 20", city: "Lyon", country: "France" },
  ];
  const locations = [
    ["REC-01", "Main warehouse", "Receiving", "receiving"],
    ["A-01-01", "Main warehouse", "Zone A", "storage"],
    ["A-01-02", "Main warehouse", "Zone A", "storage"],
    ["B-02-01", "Main warehouse", "Zone B", "storage"],
    ["SHP-01", "Main warehouse", "Shipping", "shipping"],
  ].map(([code, warehouse, zone, location_type], id) => ({ id, code, warehouse, zone, location_type, notes: "" }));
  const items: [string, string, string, number, number, string, number, number][] = [
    ["FST-M8-40", "MAT-10021", "Hex bolt M8x40", 0, 1, "box", 6, 10],
    ["FST-M8-NUT", "MAT-10022", "Hex nut M8", 0, 1, "box", 42, 15],
    ["PKG-BOX-L", "MAT-20410", "Shipping box large", 1, 3, "pcs", 180, 100],
    ["PKG-TAPE", "MAT-20455", "Packing tape 50mm", 1, 3, "roll", 24, 30],
    ["RAW-STL-2", "MAT-30001", "Steel sheet 2mm", 2, 2, "pcs", 55, 20],
    ["SPR-BRG-62", "MAT-40062", "Ball bearing 6205", 3, 2, "pcs", 8, 12],
  ];
  const products = items.map(([sku, material_id, reference, category_id, location_id, unit, stock, reorder_level], id) => ({
    id, sku, material_id, reference, category_id, location_id, unit, stock, reorder_level,
    supplier_id: category_id === 1 ? 1 : 0, cost: [0.4, 0.1, 1.2, 2.5, 18, 6.8][id], description: "",
  }));
  const purchase_orders = [
    { id: 0, reference: "PO-1001", supplier_id: 0, date: daysAgo(20), expected_date: daysAgo(12), status: "received", items: [{ product_id: 4, quantity: 30, unit_cost: 18 }], total: 540, notes: "" },
    { id: 1, reference: "PO-1002", supplier_id: 0, date: daysAgo(3), expected_date: daysAgo(-4), status: "ordered", items: [{ product_id: 0, quantity: 20, unit_cost: 0.4 }, { product_id: 5, quantity: 24, unit_cost: 6.8 }], total: 171.2, notes: "" },
    { id: 2, reference: "PO-1003", supplier_id: 1, date: daysAgo(1), expected_date: daysAgo(-7), status: "draft", items: [{ product_id: 3, quantity: 60, unit_cost: 2.5 }], total: 150, notes: "" },
  ];
  const stock_movements = [
    { id: 0, product_id: 4, type: "in", quantity: 30, reason: "Received PO-1001", reference: "PO-1001", date: daysAgo(12) },
    { id: 1, product_id: 2, type: "out", quantity: -40, reason: "Issued to production", reference: "WO-88", date: daysAgo(4) },
    { id: 2, product_id: 0, type: "out", quantity: -4, reason: "Issued to line 2", reference: "", date: daysAgo(2) },
    { id: 3, product_id: 5, type: "adjustment", quantity: -2, reason: "Stock count correction", reference: "", date: daysAgo(1) },
    { id: 4, product_id: 1, type: "transfer", quantity: 0, reason: "Moved to A-01-02", reference: "", date: daysAgo(1), to_location_id: 2 },
  ];
  return { categories, suppliers, locations, products, purchase_orders, stock_movements };
}
