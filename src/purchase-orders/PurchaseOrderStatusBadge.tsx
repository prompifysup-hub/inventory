import { useTranslate } from "ra-core";
import { Badge } from "prompify-admin-kit/ui/badge";
import type { PurchaseOrderStatus } from "@/types";

export const PURCHASE_ORDER_STATUSES = [
  { id: "draft", name: "resources.purchase_orders.statuses.draft" },
  { id: "ordered", name: "resources.purchase_orders.statuses.ordered" },
  { id: "received", name: "resources.purchase_orders.statuses.received" },
  { id: "cancelled", name: "resources.purchase_orders.statuses.cancelled" },
];

const VARIANTS: Record<PurchaseOrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  ordered: "secondary",
  received: "default",
  cancelled: "destructive",
};

export const PurchaseOrderStatusBadge = ({ status }: { status: PurchaseOrderStatus }) => {
  const translate = useTranslate();
  return <Badge variant={VARIANTS[status] ?? "outline"}>{translate(`resources.purchase_orders.statuses.${status}`)}</Badge>;
};
