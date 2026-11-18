import { AutocompleteInput, NumberInput, ReferenceInput, SelectInput, TextInput } from "prompify-admin-kit/admin";
import { required } from "ra-core";

export const UNITS = ["pcs", "box", "pallet", "kg", "g", "l", "m", "roll", "set"].map((u) => ({ id: u, name: u }));

/** Item form fields, shared by create and edit. Stock changes through stock movements, not here. */
export const ProductInputs = ({ isCreate = false }: { isCreate?: boolean }) => (
  <div className="flex flex-col gap-4 max-w-3xl">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput source="sku" validate={required()} />
      <TextInput source="material_id" />
      <TextInput source="reference" validate={required()} />
      <SelectInput source="unit" choices={UNITS} />
      <ReferenceInput source="category_id" reference="categories">
        <AutocompleteInput />
      </ReferenceInput>
      <ReferenceInput source="location_id" reference="locations">
        <AutocompleteInput />
      </ReferenceInput>
      <ReferenceInput source="supplier_id" reference="suppliers">
        <AutocompleteInput />
      </ReferenceInput>
      <NumberInput source="cost" />
      <NumberInput source="reorder_level" helperText="Flagged as low stock at or below this number" />
      {isCreate && <NumberInput source="stock" helperText="Opening stock" />}
    </div>
    <TextInput source="description" multiline />
  </div>
);
