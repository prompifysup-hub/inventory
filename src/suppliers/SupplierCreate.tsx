import { Create, SimpleForm } from "prompify-admin-kit/admin";
import { SupplierInputs } from "./SupplierInputs";

export const SupplierCreate = () => (
  <Create redirect="list">
    <SimpleForm className="max-w-2xl">
      <SupplierInputs />
    </SimpleForm>
  </Create>
);
