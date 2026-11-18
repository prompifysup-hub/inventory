import type { ResourceProps } from "ra-core";
import { ClipboardList } from "lucide-react";
import { PurchaseOrderList } from "./PurchaseOrderList";
import { PurchaseOrderEdit } from "./PurchaseOrderEdit";
import { PurchaseOrderCreate } from "./PurchaseOrderCreate";

export const purchaseOrders: ResourceProps = {
  name: "purchase_orders",
  list: PurchaseOrderList,
  edit: PurchaseOrderEdit,
  create: PurchaseOrderCreate,
  recordRepresentation: "reference",
  icon: ClipboardList,
};
