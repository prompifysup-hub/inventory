import {
  CreateButton,
  DataTable,
  EmailField,
  ExportButton,
  List,
  ReferenceManyCount,
  TextInput,
} from "prompify-admin-kit/admin";

const filters = [<TextInput key="q" source="q" placeholder="Search suppliers" label={false} alwaysOn />];

const ListActions = () => (
  <div className="flex items-center gap-2">
    <CreateButton />
    <ExportButton />
  </div>
);

export const SupplierList = () => (
  <List sort={{ field: "name", order: "ASC" }} filters={filters} actions={<ListActions />}>
    <DataTable rowClick="edit">
      <DataTable.Col source="name" className="font-medium" />
      <DataTable.Col source="contact_name" />
      <DataTable.Col source="email">
        <EmailField source="email" />
      </DataTable.Col>
      <DataTable.Col source="phone" className="hidden md:table-cell" />
      <DataTable.Col source="city" className="hidden lg:table-cell" />
      <DataTable.Col label="resources.products.name" className="text-right" disableSort>
        <ReferenceManyCount reference="products" target="supplier_id" />
      </DataTable.Col>
    </DataTable>
  </List>
);
