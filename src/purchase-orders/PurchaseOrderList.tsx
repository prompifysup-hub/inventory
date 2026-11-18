import {
  AutocompleteInput,
  CreateButton,
  DataTable,
  DateField,
  ExportButton,
  List,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "prompify-admin-kit/admin";
import type { PurchaseOrder } from "@/types";
import { PURCHASE_ORDER_STATUSES, PurchaseOrderStatusBadge } from "./PurchaseOrderStatusBadge";

const filters = [
  <TextInput key="q" source="q" placeholder="Search" label={false} alwaysOn />,
  <ReferenceInput key="supplier" source="supplier_id" reference="suppliers" sort={{ field: "name", order: "ASC" }} alwaysOn>
    <AutocompleteInput placeholder="Filter by supplier" label={false} />
  </ReferenceInput>,
  <SelectInput key="status" source="status" choices={PURCHASE_ORDER_STATUSES} emptyText="All statuses" label={false} alwaysOn />,
];

const ListActions = () => (
  <div className="flex items-center gap-2">
    <CreateButton />
    <ExportButton />
  </div>
);

export const PurchaseOrderList = () => (
  <List sort={{ field: "date", order: "DESC" }} filters={filters} actions={<ListActions />}>
    <DataTable<PurchaseOrder> rowClick="edit">
      <DataTable.Col source="reference" className="font-medium" />
      <DataTable.Col source="date">
        <DateField source="date" />
      </DataTable.Col>
      <DataTable.Col source="supplier_id">
        <ReferenceField source="supplier_id" reference="suppliers" link={false} />
      </DataTable.Col>
      <DataTable.Col source="expected_date" className="hidden md:table-cell">
        <DateField source="expected_date" />
      </DataTable.Col>
      <DataTable.Col source="status" render={(record) => <PurchaseOrderStatusBadge status={record.status} />} />
      <DataTable.Col
        label="resources.purchase_orders.fields.items"
        className="hidden md:table-cell text-right"
        disableSort
        render={(record) => (record.items || []).reduce((n: number, i: { quantity: number }) => n + Number(i.quantity || 0), 0)}
      />
      <DataTable.NumberCol source="total" options={{ style: "currency", currency: "USD" }} />
    </DataTable>
  </List>
);
