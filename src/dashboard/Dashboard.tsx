import { Translate } from "ra-core";
import { Breadcrumb, BreadcrumbPage } from "prompify-admin-kit/admin";

import Welcome from "./Welcome";
import { LowStock, RecentMovements, StockValueCards } from "./InventoryCards";

export const Dashboard = () => (
  <>
    <Breadcrumb>
      <BreadcrumbPage>
        <Translate i18nKey="ra.page.dashboard">Home</Translate>
      </BreadcrumbPage>
    </Breadcrumb>
    <Welcome />
    <div className="flex flex-col gap-4 mb-4">
      <StockValueCards />
      <div className="flex flex-col md:flex-row gap-4">
        <LowStock />
        <RecentMovements />
      </div>
    </div>
  </>
);

export default Dashboard;
