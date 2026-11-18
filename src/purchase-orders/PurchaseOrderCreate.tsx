import { Create, SimpleForm } from "prompify-admin-kit/admin";
import { useSearchParams } from "react-router";
import { PurchaseOrderInputs } from "./PurchaseOrderForm";
import { idFromParam } from "@/types";

/** Opened from a product page with ?product_id=…&supplier_id=… to pre-fill a reorder. */
export const PurchaseOrderCreate = () => {
  const [params] = useSearchParams();
  const productId = idFromParam(params.get("product_id"));
  const supplierId = idFromParam(params.get("supplier_id"));
  return (
    <Create redirect="edit">
      <SimpleForm
        className="max-w-3xl"
        defaultValues={{
          status: "draft",
          date: new Date().toISOString().slice(0, 10),
          supplier_id: supplierId,
          items: productId !== undefined ? [{ product_id: productId, quantity: 10, unit_cost: Number(params.get("unit_cost") || 0) }] : [{}],
        }}
      >
        <PurchaseOrderInputs isCreate />
      </SimpleForm>
    </Create>
  );
};
