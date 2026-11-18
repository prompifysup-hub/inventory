import { ReferenceField, ReferenceManyField } from "prompify-admin-kit/admin";
import { buttonVariants } from "prompify-admin-kit/ui/button";
import { Translate, useRecordContext } from "ra-core";
import { Link } from "react-router";
import { ArrowLeftRight, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product, StockMovement } from "@/types";
import { QuantityChange } from "../stock-movements/StockMovementType";

/** Stock level, reorder level, supplier, quick actions and the product's stock history. */
export const InventoryAside = () => {
  const product = useRecordContext<Product>();
  if (!product) return null;

  const reorderParams = new URLSearchParams({ product_id: String(product.id), unit_cost: String(product.cost ?? 0) });
  if (product.supplier_id !== undefined && product.supplier_id !== null) reorderParams.set("supplier_id", String(product.supplier_id));

  return (
    <div className="hidden lg:flex flex-col gap-4 w-80 border rounded-sm p-4">
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-sm font-semibold">
          <Translate i18nKey="resources.products.fields.stock" />
        </h3>
        <div className={cn("text-4xl font-semibold", product.low_stock && "text-destructive")}>{product.stock}</div>
        <p className="text-sm text-muted-foreground">
          Reorder level {product.reorder_level ?? 0}
          {product.low_stock ? " · Low stock" : ""}
        </p>
        {product.supplier_id !== undefined && product.supplier_id !== null && (
          <p className="text-sm text-muted-foreground">
            Supplier: <ReferenceField source="supplier_id" reference="suppliers" link="edit" />
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Link
          to={`/stock_movements/create?product_id=${encodeURIComponent(String(product.id))}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
        >
          <ArrowLeftRight className="mr-1 h-4 w-4" />
          Adjust stock
        </Link>
        <Link to={`/purchase_orders/create?${reorderParams}`} className={cn(buttonVariants({ size: "sm" }), "flex-1")}>
          <ShoppingCart className="mr-1 h-4 w-4" />
          Reorder
        </Link>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">
          <Translate i18nKey="resources.products.tabs.stock_history" />
        </h3>
        <ReferenceManyField<Product, StockMovement>
          reference="stock_movements"
          target="product_id"
          sort={{ field: "date", order: "DESC" }}
          perPage={15}
          render={({ data }) => (
            <div className="flex flex-col gap-2">
              {!data?.length && <p className="text-sm text-muted-foreground">No stock movements yet.</p>}
              {data?.map((movement) => (
                <div key={movement.id} className="flex items-start justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <div className="truncate">{movement.reason || movement.type}</div>
                    <div className="text-xs text-muted-foreground">{new Date(movement.date).toLocaleDateString()}</div>
                  </div>
                  <QuantityChange quantity={movement.quantity} />
                </div>
              ))}
            </div>
          )}
        />
      </div>
    </div>
  );
};
