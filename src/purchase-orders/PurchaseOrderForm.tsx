import {
  ArrayInput,
  AutocompleteInput,
  DateInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleFormIterator,
  TextInput,
} from "prompify-admin-kit/admin";
import { required, minValue, useTranslate } from "ra-core";
import { useWatch } from "react-hook-form";
import { PURCHASE_ORDER_STATUSES } from "./PurchaseOrderStatusBadge";

/** Fields of the purchase order form, shared by create and edit. */
export const PurchaseOrderInputs = ({ isCreate = false }: { isCreate?: boolean }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput source="reference" helperText={isCreate ? "Leave empty to number it automatically" : undefined} />
      <ReferenceInput source="supplier_id" reference="suppliers" sort={{ field: "name", order: "ASC" }}>
        <AutocompleteInput validate={required()} />
      </ReferenceInput>
      <DateInput source="date" />
      <DateInput source="expected_date" />
      <SelectInput
        source="status"
        choices={PURCHASE_ORDER_STATUSES.filter((s) => s.id !== "received")}
        helperText="Use “Mark as received” to book the items into stock."
      />
    </div>
    <ArrayInput source="items" validate={required()}>
      <SimpleFormIterator inline>
        <ReferenceInput source="product_id" reference="products" sort={{ field: "reference", order: "ASC" }}>
          <AutocompleteInput label="Product" validate={required()} className="min-w-56" />
        </ReferenceInput>
        <NumberInput source="quantity" label="Quantity" validate={[required(), minValue(1)]} className="w-28" />
        <NumberInput source="unit_cost" label="Unit cost" validate={minValue(0)} className="w-32" />
      </SimpleFormIterator>
    </ArrayInput>
    <OrderTotal />
    <TextInput source="notes" multiline />
  </>
);

const OrderTotal = () => {
  const translate = useTranslate();
  const items = (useWatch({ name: "items" }) as { quantity?: number; unit_cost?: number }[] | undefined) || [];
  const total = items.reduce((t, i) => t + Number(i?.quantity || 0) * Number(i?.unit_cost || 0), 0);
  return (
    <p className="text-right text-sm">
      {translate("resources.purchase_orders.fields.total")}:{" "}
      <span className="font-semibold">{total.toLocaleString(undefined, { style: "currency", currency: "USD" })}</span>
    </p>
  );
};
