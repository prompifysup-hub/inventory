import { DeleteButton, Edit, SaveButton, SimpleForm } from "prompify-admin-kit/admin";
import { Button } from "prompify-admin-kit/ui/button";
import { useNotify, useRecordContext, useRefresh, useTranslate, useUpdate } from "ra-core";
import { PackageCheck, Send } from "lucide-react";
import type { PurchaseOrder } from "@/types";
import { PurchaseOrderInputs } from "./PurchaseOrderForm";
import { PurchaseOrderStatusBadge } from "./PurchaseOrderStatusBadge";

export const PurchaseOrderEdit = () => (
  <Edit actions={<StatusActions />}>
    <SimpleForm className="max-w-3xl" toolbar={<Toolbar />}>
      <PurchaseOrderInputs />
    </SimpleForm>
  </Edit>
);

const Toolbar = () => (
  <div className="flex items-center justify-between gap-2 pt-4">
    <SaveButton />
    <DeleteButton />
  </div>
);

/** Status badge plus "Mark as ordered" / "Mark as received" (receiving books the items into stock). */
const StatusActions = () => {
  const record = useRecordContext<PurchaseOrder>();
  const translate = useTranslate();
  const notify = useNotify();
  const refresh = useRefresh();
  const [update, { isPending }] = useUpdate();
  if (!record) return null;

  const setStatus = (status: PurchaseOrder["status"], message: string) =>
    update(
      "purchase_orders",
      { id: record.id, data: { status, ...(status === "received" ? { received_date: new Date().toISOString() } : {}) }, previousData: record },
      {
        onSuccess: () => {
          notify(message, { type: "success" });
          refresh();
        },
        onError: (error: unknown) => notify(error instanceof Error ? error.message : String(error), { type: "error" }),
      },
    );

  return (
    <div className="flex items-center gap-2">
      <PurchaseOrderStatusBadge status={record.status} />
      {record.status === "draft" && (
        <Button variant="outline" disabled={isPending} onClick={() => setStatus("ordered", "Purchase order marked as ordered")}>
          <Send className="mr-1 h-4 w-4" />
          {translate("resources.purchase_orders.actions.mark_ordered")}
        </Button>
      )}
      {(record.status === "draft" || record.status === "ordered") && (
        <Button disabled={isPending || !record.items?.length} onClick={() => setStatus("received", translate("resources.purchase_orders.actions.received"))}>
          <PackageCheck className="mr-1 h-4 w-4" />
          {translate("resources.purchase_orders.actions.mark_received")}
        </Button>
      )}
    </div>
  );
};
