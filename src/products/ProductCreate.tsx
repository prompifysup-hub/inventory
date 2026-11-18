import { Create, SimpleForm } from "prompify-admin-kit/admin";
import { ProductInputs } from "./ProductInputs";

export const ProductCreate = () => (
  <Create redirect="edit">
    <SimpleForm defaultValues={{ stock: 0, reorder_level: 0, unit: "pcs" }}>
      <ProductInputs isCreate />
    </SimpleForm>
  </Create>
);
