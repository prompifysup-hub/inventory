# Prompify inventory template

The shadcn-admin-kit e-commerce demo by Marmelab (MIT, see `LICENSE`), turned into an inventory
app and connected to Prompify's database.

Added: suppliers, stock movements (ledger), purchase orders (mark as ordered / received; receiving
books stock in), reorder levels with low-stock badges and filter, a stock panel on product pages
(Adjust stock, Reorder, stock history), inventory cards on the dashboard, and delivered orders
booking stock out. Removed: product reviews.

- **Inside Prompify**: data is loaded from and saved to the tables listed in `.bolt/prompt`
  (see `src/providers/index.ts`, which also holds the inventory rules).
- **Locally**: `npm install && npm run dev` runs it with the demo's generated poster-shop data.

The component library (shadcn-admin-kit `components/admin` and `components/ui`) lives in the
`prompify-admin-kit` package (folder `../admin-kit`). In that package the sidebar shows the app's
`title`, and edit / delete write to the database immediately (no 5-second undo window, which a
preview reload would lose). `package.json` currently points at a local tarball; it must point at a
public URL before the template is used in Prompify.
