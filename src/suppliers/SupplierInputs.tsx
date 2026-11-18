import { TextInput } from "prompify-admin-kit/admin";
import { required, email } from "ra-core";

/** Fields of the supplier form, shared by create and edit. */
export const SupplierInputs = () => (
  <>
    <TextInput source="name" validate={required()} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput source="contact_name" />
      <TextInput source="email" validate={email()} />
      <TextInput source="phone" />
      <TextInput source="city" />
      <TextInput source="address" />
      <TextInput source="country" />
    </div>
    <TextInput source="notes" multiline />
  </>
);
