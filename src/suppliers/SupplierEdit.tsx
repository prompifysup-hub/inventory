import { Edit, ReferenceManyField, SimpleForm } from "prompify-admin-kit/admin";
import { Translate, useCreatePath, useRecordContext } from "ra-core";
import { Link } from "react-router";
import { Badge } from "prompify-admin-kit/ui/badge";
import type { Product, PurchaseOrder, Supplier } from "@/types";
import { SupplierInputs } from "./SupplierInputs";
import { PurchaseOrderStatusBadge } from "../purchase-orders/PurchaseOrderStatusBadge";

export const SupplierEdit = () => (
  <Edit>
    <div className="flex flex-col lg:flex-row items-start gap-8">
      <SimpleForm className="max-w-2xl flex-1">
        <SupplierInputs />
      </SimpleForm>
      <SupplierAside />
    </div>
  </Edit>
);

/** The supplier's products and purchase orders. */
const SupplierAside = () => {
  const record = useRecordContext<Supplier>();
  const createPath = useCreatePath();
  if (!record) return null;
  return (
    <div className="w-full lg:w-80 flex flex-col gap-6">
      <ReferenceManyField<Supplier, Product>
        reference="products"
        target="supplier_id"
        perPage={50}
        render={({ data }) => (
          <div>
            <h3 className="font-semibold text-sm mb-2">
              <Translate i18nKey="resources.products.name" options={{ smart_count: 2 }} />
            </h3>
            {!data?.length && <p className="text-sm text-muted-foreground">No products from this supplier yet.</p>}
            <div className="flex flex-col gap-1">
              {data?.map((product) => (
                <Link
                  key={product.id}
                  to={createPath({ resource: "products", id: product.id, type: "edit" })}
                  className="flex items-center justify-between text-sm hover:underline"
                >
                  <span className="truncate">{product.reference}</span>
                  <Badge variant={product.low_stock ? "destructive" : "outline"}>{product.stock}</Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      />
      <ReferenceManyField<Supplier, PurchaseOrder>
        reference="purchase_orders"
        target="supplier_id"
        sort={{ field: "date", order: "DESC" }}
        perPage={20}
        render={({ data }) => (
          <div>
            <h3 className="font-semibold text-sm mb-2">
              <Translate i18nKey="resources.purchase_orders.name" options={{ smart_count: 2 }} />
            </h3>
            {!data?.length && <p className="text-sm text-muted-foreground">No purchase orders yet.</p>}
            <div className="flex flex-col gap-1">
              {data?.map((po) => (
                <Link
                  key={po.id}
                  to={createPath({ resource: "purchase_orders", id: po.id, type: "edit" })}
                  className="flex items-center justify-between text-sm hover:underline"
                >
                  <span>{po.reference}</span>
                  <PurchaseOrderStatusBadge status={po.status} />
                </Link>
              ))}
            </div>
          </div>
        )}
      />
    </div>
  );
};
