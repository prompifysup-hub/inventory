import { useMemo } from "react";
import { Link } from "react-router";
import { useGetList, useTranslate } from "ra-core";
import { AlertTriangle, ArrowLeftRight, Boxes, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "prompify-admin-kit/ui/card";
import { buttonVariants } from "prompify-admin-kit/ui/button";
import { cn } from "@/lib/utils";
import type { Product, StockMovement } from "@/types";
import CardWithIcon from "./CardWithIcon";
import { QuantityChange } from "../stock-movements/StockMovementType";

const money = (n: number) => n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** Total value of the stock (at cost, or at price when no cost is set) and number of items to reorder. */
export const StockValueCards = () => {
  const translate = useTranslate();
  const { data: products } = useGetList<Product>("products", { pagination: { page: 1, perPage: 1000 }, sort: { field: "id", order: "ASC" } });
  const { value, toReorder } = useMemo(() => {
    const list = products || [];
    return {
      value: list.reduce((t, p) => t + Number(p.stock || 0) * Number(p.cost ?? 0), 0),
      toReorder: list.filter((p) => p.low_stock).length,
    };
  }, [products]);
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <CardWithIcon to="/products" icon={Coins} title={translate("pos.dashboard.stock_value")} subtitle={products ? money(value) : ""} />
      <CardWithIcon
        to={{ pathname: "/products", search: `filter=${encodeURIComponent(JSON.stringify({ low_stock: true }))}` }}
        icon={AlertTriangle}
        title={translate("pos.dashboard.to_reorder")}
        subtitle={products ? toReorder : ""}
      />
    </div>
  );
};

/** Products at or below their reorder level, lowest first. */
export const LowStock = () => {
  const translate = useTranslate();
  const { data: products, total } = useGetList<Product>("products", {
    filter: { low_stock: true },
    sort: { field: "stock", order: "ASC" },
    pagination: { page: 1, perPage: 8 },
  });
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center gap-2">
        <Boxes className="h-5 w-5 text-muted-foreground" />
        <CardTitle>
          {translate("pos.dashboard.low_stock")} {total ? `(${total})` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {products?.length === 0 && <p className="text-sm text-muted-foreground">Everything is above its reorder level.</p>}
        {products?.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`} className="flex items-center gap-3 hover:bg-muted rounded-sm p-1">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{product.reference}</div>
              <div className="text-xs text-muted-foreground">{product.sku} · reorder level {product.reorder_level ?? 0}</div>
            </div>
            <span className="text-sm font-semibold text-destructive">{product.stock}</span>
          </Link>
        ))}
        <Link
          to={{ pathname: "/products", search: `filter=${encodeURIComponent(JSON.stringify({ low_stock: true }))}` }}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "self-start")}
        >
          {translate("pos.dashboard.all_low_stock")}
        </Link>
      </CardContent>
    </Card>
  );
};

/** Latest stock movements. */
export const RecentMovements = () => {
  const translate = useTranslate();
  const { data: movements } = useGetList<StockMovement>("stock_movements", {
    sort: { field: "date", order: "DESC" },
    pagination: { page: 1, perPage: 6 },
  });
  const { data: products } = useGetList<Product>("products", {
    filter: { id: (movements || []).map((m) => m.product_id) },
    pagination: { page: 1, perPage: 6 },
    sort: { field: "id", order: "ASC" },
  }, { enabled: !!movements?.length });
  const name = (id: unknown) => products?.find((p) => p.id === id)?.reference ?? "…";
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center gap-2">
        <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
        <CardTitle>{translate("pos.dashboard.recent_movements")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {movements?.length === 0 && <p className="text-sm text-muted-foreground">No stock movements yet.</p>}
        {movements?.map((movement) => (
          <div key={movement.id} className="flex items-center justify-between gap-2 text-sm">
            <div className="min-w-0">
              <div className="truncate font-medium">{name(movement.product_id)}</div>
              <div className="truncate text-xs text-muted-foreground">{movement.reason}</div>
            </div>
            <QuantityChange quantity={movement.quantity} />
          </div>
        ))}
        <Link to="/stock_movements" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "self-start")}>
          {translate("pos.dashboard.all_movements")}
        </Link>
      </CardContent>
    </Card>
  );
};
