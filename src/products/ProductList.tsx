import {
  CreateButton,
  DataTable,
  ExportButton,
  List,
  ReferenceField,
  ReferenceInput,
  AutocompleteInput,
  TextInput,
  ToggleFilterButton,
} from "prompify-admin-kit/admin";
import type { Product } from "@/types";

const filters = [
  <TextInput key="q" source="q" placeholder="Search item, SKU or material ID" label={false} alwaysOn />,
  <ReferenceInput key="cat" source="category_id" reference="categories" alwaysOn>
    <AutocompleteInput placeholder="Category" label={false} />
  </ReferenceInput>,
  <ReferenceInput key="loc" source="location_id" reference="locations" alwaysOn>
    <AutocompleteInput placeholder="Location" label={false} />
  </ReferenceInput>,
];

const ListActions = () => (
  <div className="flex items-center gap-2">
    <ToggleFilterButton label="resources.products.filters.below_reorder" value={{ low_stock: true }} />
    <CreateButton />
    <ExportButton />
  </div>
);

/** Items in stock: one row per item with codes, location and stock level. */
export const ProductList = () => (
  <List sort={{ field: "sku", order: "ASC" }} filters={filters} actions={<ListActions />} perPage={25}>
    <DataTable<Product> rowClick="edit">
      <DataTable.Col source="sku" className="font-medium" />
      <DataTable.Col source="material_id" className="hidden md:table-cell" />
      <DataTable.Col source="reference" />
      <DataTable.Col source="category_id" className="hidden lg:table-cell">
        <ReferenceField source="category_id" reference="categories" link={false} />
      </DataTable.Col>
      <DataTable.Col source="location_id" className="hidden md:table-cell">
        <ReferenceField source="location_id" reference="locations" link={false} />
      </DataTable.Col>
      <DataTable.Col
        source="stock"
        className="text-right"
        render={(p) => (
          <span className={p.low_stock ? "font-semibold text-destructive" : "font-medium"}>
            {p.stock} {p.unit ?? ""}
          </span>
        )}
      />
      <DataTable.Col source="reorder_level" className="hidden lg:table-cell text-right" />
    </DataTable>
  </List>
);
