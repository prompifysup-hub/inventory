import type { ResourceProps } from "ra-core";
import { ArrowLeftRight } from "lucide-react";
import { StockMovementList } from "./StockMovementList";
import { StockMovementCreate } from "./StockMovementCreate";

/** A ledger: movements are created (manually, by purchase orders or by delivered orders), never edited. */
export const stockMovements: ResourceProps = {
  name: "stock_movements",
  list: StockMovementList,
  create: StockMovementCreate,
  icon: ArrowLeftRight,
};
