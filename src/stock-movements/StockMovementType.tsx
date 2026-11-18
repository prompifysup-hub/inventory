import { useTranslate } from "ra-core";
import { Badge } from "prompify-admin-kit/ui/badge";
import type { StockMovement } from "@/types";

export const MOVEMENT_TYPES = [
  { id: "in", name: "resources.stock_movements.types.in" },
  { id: "out", name: "resources.stock_movements.types.out" },
  { id: "adjustment", name: "resources.stock_movements.types.adjustment" },
  { id: "transfer", name: "resources.stock_movements.types.transfer" },
];

export const StockMovementTypeBadge = ({ type }: { type: StockMovement["type"] }) => {
  const translate = useTranslate();
  const variant = type === "in" ? "default" : type === "out" ? "secondary" : "outline";
  return <Badge variant={variant}>{translate(`resources.stock_movements.types.${type}`)}</Badge>;
};

/** "+20" in green, "-3" in red. */
export const QuantityChange = ({ quantity }: { quantity: number }) => (
  <span className={quantity > 0 ? "text-green-700 dark:text-green-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
    {quantity > 0 ? `+${quantity}` : quantity}
  </span>
);
