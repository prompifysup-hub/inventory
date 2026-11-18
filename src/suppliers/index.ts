import type { ResourceProps } from "ra-core";
import { Truck } from "lucide-react";
import { SupplierList } from "./SupplierList";
import { SupplierEdit } from "./SupplierEdit";
import { SupplierCreate } from "./SupplierCreate";

export const suppliers: ResourceProps = {
  name: "suppliers",
  list: SupplierList,
  edit: SupplierEdit,
  create: SupplierCreate,
  recordRepresentation: "name",
  icon: Truck,
};
