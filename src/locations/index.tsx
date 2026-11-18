import type { ResourceProps } from "ra-core";
import { MapPin } from "lucide-react";
import {
  Create,
  CreateButton,
  DataTable,
  Edit,
  List,
  ReferenceManyCount,
  SelectInput,
  SimpleForm,
  TextInput,
} from "prompify-admin-kit/admin";
import { required } from "ra-core";

const TYPES = ["storage", "receiving", "shipping", "quarantine"].map((t) => ({ id: t, name: t }));

const Inputs = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
    <TextInput source="code" validate={required()} helperText="e.g. A-01-03 (aisle-rack-shelf)" />
    <TextInput source="warehouse" validate={required()} />
    <TextInput source="zone" />
    <SelectInput source="location_type" choices={TYPES} />
    <TextInput source="notes" multiline className="md:col-span-2" />
  </div>
);

/** Warehouses, zones and bin locations. Items have a location; transfers move them. */
export const locations: ResourceProps = {
  name: "locations",
  recordRepresentation: "code",
  icon: MapPin,
  list: () => (
    <List
      sort={{ field: "code", order: "ASC" }}
      filters={[<TextInput key="q" source="q" placeholder="Search" label={false} alwaysOn />]}
      actions={<CreateButton />}
    >
      <DataTable rowClick="edit">
        <DataTable.Col source="code" className="font-medium" />
        <DataTable.Col source="warehouse" />
        <DataTable.Col source="zone" />
        <DataTable.Col source="location_type" />
        <DataTable.Col label="resources.products.name" className="text-right" disableSort>
          <ReferenceManyCount reference="products" target="location_id" />
        </DataTable.Col>
      </DataTable>
    </List>
  ),
  create: () => (
    <Create redirect="list">
      <SimpleForm defaultValues={{ location_type: "storage" }}>
        <Inputs />
      </SimpleForm>
    </Create>
  ),
  edit: () => (
    <Edit>
      <SimpleForm>
        <Inputs />
      </SimpleForm>
    </Edit>
  ),
};
