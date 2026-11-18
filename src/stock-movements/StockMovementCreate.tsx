import {
  AutocompleteInput,
  Create,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "prompify-admin-kit/admin";
import { required, minValue, FormDataConsumer } from "ra-core";
import { useSearchParams } from "react-router";
import { MOVEMENT_TYPES } from "./StockMovementType";
import { idFromParam } from "@/types";

/**
 * Record stock coming in, going out, or a correction. Saving updates the product's stock.
 * Opened from a product page with ?product_id=… to pre-select the product.
 */
export const StockMovementCreate = () => {
  const [params] = useSearchParams();
  const productId = idFromParam(params.get("product_id"));
  return (
    <Create redirect={productId !== undefined ? `/products/${productId}` : "list"} title="Adjust stock">
      <SimpleForm
        className="max-w-xl"
        defaultValues={{ type: "in", quantity: 1, product_id: productId }}
      >
        <ReferenceInput source="product_id" reference="products" sort={{ field: "reference", order: "ASC" }}>
          <AutocompleteInput validate={required()} />
        </ReferenceInput>
        <SelectInput source="type" choices={MOVEMENT_TYPES} validate={required()} />
        <NumberInput
          source="quantity"
          validate={[required(), minValue(-100000)]}
          helperText="Stock in / out: how many. Adjustment: negative removes. Transfer: ignored (the item moves)."
        />
        <FormDataConsumer>
          {({ formData }) =>
            formData.type === "transfer" ? (
              <ReferenceInput source="to_location_id" reference="locations">
                <AutocompleteInput label="Move to location" validate={required()} />
              </ReferenceInput>
            ) : null
          }
        </FormDataConsumer>
        <TextInput source="reason" placeholder="e.g. Stock count, damaged, returned by customer" />
        <TextInput source="reference" placeholder="Optional: order or document number" />
      </SimpleForm>
    </Create>
  );
};
