import { Edit, SimpleForm } from "prompify-admin-kit/admin";
import { InventoryAside } from "./InventoryAside";
import { ProductInputs } from "./ProductInputs";

export const ProductEdit = () => (
  <Edit>
    <div className="flex items-start justify-between gap-4">
      <SimpleForm className="flex-1">
        <ProductInputs />
      </SimpleForm>
      <InventoryAside />
    </div>
  </Edit>
);
