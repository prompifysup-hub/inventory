import { Resource } from "ra-core";
import { Admin } from "prompify-admin-kit/admin";

import { dataProvider } from "./providers";
import { authProvider } from "./providers/authProvider";
import { i18nProvider } from "./i18nProvider";
import { products } from "./products";
import { categories } from "./categories";
import { locations } from "./locations";
import { suppliers } from "./suppliers";
import { purchaseOrders } from "./purchase-orders";
import { stockMovements } from "./stock-movements";
import { Dashboard } from "./dashboard/Dashboard";

/** The order of the <Resource> elements is the order of the sidebar menu. */
function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      dashboard={Dashboard}
      title="Warehouse"
    >
      <Resource {...products} />
      <Resource {...stockMovements} />
      <Resource {...purchaseOrders} />
      <Resource {...suppliers} />
      <Resource {...locations} />
      <Resource {...categories} />
    </Admin>
  );
}

export default App;
