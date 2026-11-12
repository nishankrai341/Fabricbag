# API Module Plan (Phase 0)

REST, `/api/v1`, OpenAPI at `/api/docs` (disabled/auth-protected in production). Auth: `C` = customer token, `S:perm` = staff permission, `P` = public.
Conventions: cursor/page pagination, `?q=` search, RFC 7807 errors, idempotency key header on `POST /orders` and `POST /payments`, money as decimal strings.

| Module | Key endpoints | Auth |
|---|---|---|
| auth | `POST /auth/register`, `/login`, `/logout`, `/refresh`, `/forgot-password`, `/reset-password`; `POST /admin/auth/login` | P / C / S |
| customers | `GET/PATCH /me`, `/me/business`, `/me/addresses[/:id]`; admin: `GET /admin/customers[/:id]`, `PATCH /admin/customers/:id/approval` | C / S:customers |
| categories | `GET /categories`; admin CRUD + `PUT /admin/categories/reorder` | P / S:catalog |
| products | `GET /products?category&type&q`, `GET /products/:slug`; admin CRUD, variants, images, specs, `PATCH visibility` | P / S:catalog |
| rates | `GET /units`; admin `GET/POST /admin/rates`, `POST /admin/rates/:id/supersede`, `GET /admin/rates/history?productId`, CSV import; `POST /pricing/check` (resolve price for config) | P / S:rates |
| customizations | `GET /products/:id/customization-config`; `POST /designs`, `GET/PATCH/DELETE /me/designs[/:id]`; `POST /files/artwork`; admin `PUT /admin/products/:id/customization-config`, `POST /admin/design-assets/:id/approval` | C / S:orders |
| inquiries | `POST /inquiries` (rate-limited), admin list/assign/close; leads CRUD | P / S:inquiries |
| quotations | `POST /me/quotations` (from design/cart), `GET /me/quotations[/:id]`, `POST /me/quotations/:id/accept|reject`; admin create, `POST /admin/quotations/:id/revisions`, `/send`, `/convert-to-order`, `GET /:id/pdf` | C / S:quotations |
| orders | `POST /me/orders`, `GET /me/orders[/:id]`, `POST /me/orders/:id/cancel`, `POST /me/orders/:id/reorder`; admin list, `PATCH /admin/orders/:id/status`, notes | C / S:orders |
| invoices | admin `POST /admin/orders/:id/invoices`, `POST /admin/invoices/:id/void`, `GET /:id/pdf`; `GET /me/invoices[/:id]` | S:finance / C |
| payments | admin `POST /admin/payments`, `POST /admin/payments/:id/allocate`, `/reverse`; `GET /admin/customers/:id/statement`; `GET /admin/dues`, `/dues/overdue`; `GET /me/statement` | S:finance / C |
| cms | `GET /site` (business profile, footer, nav), `/pages/:slug`, `/homepage`, `/banners`, `/gallery`; admin CRUD + publish (triggers Next revalidate webhook) | P / S:content |
| files | `POST /admin/files` , `GET /files/:id/signed-url` (ownership check) | S / C |
| reports | `GET /admin/reports/dashboard`, `/sales`, `/dues`, `/top-products` | S:reports |
| settings | `GET/PATCH /admin/settings`, `/business-profile`, `/tax`; `GET /admin/audit-log` | S:settings (OWNER) |

## Permission codes (seed)
`catalog.read|write`, `rates.read|write`, `customers.read|write|approve`, `inquiries.*`, `quotations.*`, `orders.read|write|status`, `finance.read|write|void|reverse`, `content.write`, `reports.read`, `settings.write`, `audit.read`.
Staff default: all except `settings.write`, `audit.read`, `finance.void|reverse`, `rates.write` (owner decides).

## Cross-cutting
Guards (auth, permission, customer-ownership) · interceptors (audit, request-id) · filters (error shape) · throttler profiles · `PricingService`, `NumberingService` (DocumentSequence), `StorageService`, `PdfService`, `NotificationService` (outbox) · Next ISR revalidation webhook on CMS/product/rate publish.
