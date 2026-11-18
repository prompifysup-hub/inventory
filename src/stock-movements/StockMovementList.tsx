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
} from "prompify-admin-kit/admin";
import type { StockMovement } from "@/types";
import { MOVEMENT_TYPES, QuantityChange, StockMovementTypeBadge } from "./StockMovementType";

const filters = [
  <ReferenceInput key="product" source="product_id" reference="products" sort={{ field: "reference", order: "ASC" }} alwaysOn>
    <AutocompleteInput placeholder="Filter by product" label={false} />
  </ReferenceInput>,
  <SelectInput key="type" source="type" choices={MOVEMENT_TYPES} emptyText="All types" label={false} alwaysOn />,
];

const ListActions = () => (
  <div className="flex items-center gap-2">
    <CreateButton label="Adjust stock" />
    <ExportButton />
  </div>
);

export const StockMovementList = () => (
  <List sort={{ field: "date", order: "DESC" }} filters={filters} actions={<ListActions />} perPage={25}>
    <DataTable<StockMovement> rowClick={false} bulkActionButtons={false}>
      <DataTable.Col source="date">
        <DateField source="date" showTime />
      </DataTable.Col>
      <DataTable.Col source="product_id">
        <ReferenceField source="product_id" reference="products" link="edit" />
      </DataTable.Col>
      <DataTable.Col source="type" render={(record) => <StockMovementTypeBadge type={record.type} />} />
      <DataTable.Col source="quantity" className="text-right" render={(record) => <QuantityChange quantity={record.quantity} />} />
      <DataTable.Col source="to_location_id" label="To" className="hidden md:table-cell">
        <ReferenceField source="to_location_id" reference="locations" link={false} />
      </DataTable.Col>
      <DataTable.Col source="reason" className="hidden md:table-cell" />
      <DataTable.Col source="reference" className="hidden lg:table-cell" />
    </DataTable>
  </List>
);
