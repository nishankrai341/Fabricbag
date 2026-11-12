# Sanjana Plastic & Business Link — Product Requirements (Phase 0)

Status: PROPOSAL for approval. Source: project brief only (visiting-card image not yet received).

## 1. Business summary

| Field | Value | Status |
|---|---|---|
| Business | Sanjana Plastic & Business Link (सञ्जना प्लास्टिक एण्ड बिजनेस लिंक) | From brief — confirm spelling |
| Proprietor | Lal Bahadur | Confirm |
| Address | Tarkeshwor-6, Dharmasthali, Kathmandu | Confirm |
| Phones | 9851255796, 9841180105 | Confirm |
| Activity | Plastic materials, printed plastic packaging, cloth/fabric bags | From card |
| Email, domain, PAN, VAT, WhatsApp, hours | — | **Not supplied. Blank, admin-editable** |
| Payment QR | Present on card | **Inactive until original QR + account verified** |

## 2. Goals and non-goals

Goals: (1) credible online catalog, (2) show approved rates, (3) bag customizer, (4) quotation requests, (5) eligible direct ordering with tracking, (6) simple owner panel incl. who-owes-what.

Non-goals: ERP, general ledger, manufacturing/BOM, payroll/HR, multi-tenant, warehouse stock ledger, online payment capture, AI agents, bulk marketing automation.

## 3. Users and roles

| Role | Can do |
|---|---|
| Visitor | Browse, see public rates, use customizer preview, send inquiry, register |
| Customer (browse-only) | Everything above + saved designs + quotation requests, profile |
| Customer (approved) | + place direct orders for priced configurations, view invoices/payments/statement, reorder |
| Staff | Manage catalog, inquiries, quotations, orders, payments (no settings/audit) |
| Owner | All, incl. rates approval, settings, customer approval, reports |

## 4. Functional requirements (by module)

**FR-CAT Catalog.** Admin-configurable categories (enable/disable/rename/reorder; 11 seeded). Three product types (roll/raw, finished bag, custom-made) with type-specific specs. Products can be hidden or flagged out-of-stock/on-request. Photos with alt text. Bilingual (EN/NE) names and descriptions.

**FR-RATE Rates.** Units: pcs, kg, g, m, m², roll, bundle, packet (admin-extendable). Pricing modes: fixed, starting-from, tiered by quantity, price-on-request. Customer-specific rates, validity dates, discount, history. Conversion only within same dimension; roll weight/length per variant, never assumed. All prices from DB; backend re-validates at order time.

**FR-CUST Customizer.** 14 options per brief; custom size validated against admin limits; PNG/JPG/SVG/PDF upload with secure validation; live approximate 2D preview (color + logo placement), labelled "approximate". No approved price → "Request Custom Quotation"; approved price + approved customer → direct order.

**FR-AUTH Accounts.** Register, login, logout, forgot/reset password, profile, shop profile, addresses. PAN/VAT optional. Customers only see their own data.

**FR-QUO Quotations.** Inquiry → quotation → revisions (history kept) → send (branded PDF) → accept/reject → convert to order.

**FR-ORD Orders.** Multi-item, frozen price/spec/customization snapshot, delivery details, customer note, 8 statuses (separate payment status), cancellation only before dispatch, status history, in-app/email notifications, repeat order.

**FR-FIN Receivables.** Invoices, partial payments, allocation, due dates, customer statement, overdue report, outstanding by customer. Order value ≠ revenue ≠ payment.

**FR-CMS Content.** Business details, logo, hero, banners, gallery, About/Services, policies, footer, social, SEO metadata — editable without code.

**FR-SEO.** Metadata, sitemap, robots, canonical URLs, Product JSON-LD, LocalBusiness JSON-LD (only with verified data), optimized images. Target queries are research targets, not ranking promises.

## 5. Customer dashboard structure (`/account`)

| Page | Content |
|---|---|
| Overview | Greeting, open orders, pending quotes, outstanding balance, quick reorder |
| Orders (+detail) | List, status timeline, items with snapshots, invoice link, reorder, cancel (if allowed) |
| Quotations (+detail) | Versions, PDF download, accept/reject, status |
| Payments | Invoices, payments, outstanding, statement download |
| Saved designs | Thumbnails, edit, order again, request quote |
| Profile | Contact, shop/business details, PAN/VAT, password, addresses |

## 6. Admin structure (`/admin`) — max 14 menu items

Dashboard · Products · Categories · Product Rates · Customers · Inquiries (incl. Marketing Leads tab) · Quotations · Orders · Payments · Customer Dues · Content · Gallery & Banners · Reports · Settings.

Dashboard KPI cards: Total/Today's Orders, Monthly Order Value, Invoiced Sales, Payments Received, Outstanding Balance, Pending Inquiries/Quotations/Orders, Total Customers, Most Requested Products.

## 7. Non-functional requirements

- Mobile-first; usable on low-end phones and 3G-class links (target LCP < 2.5 s on a mid-range phone; verify, don't promise).
- WCAG 2.1 AA basics (contrast, keyboard, labels, alt text).
- English + Nepali (Devanagari font self-hosted).
- Security per architecture §4; IDOR tests mandatory.
- Daily DB backups, restore tested.
- Admin usable by a non-technical owner: ≤ 3 clicks to change a rate, hide a product, record a payment.

## 8. Acceptance criteria samples

1. A customer cannot read another customer's order/design/invoice by changing an ID (404).
2. Changing a rate never alters existing orders/quotations.
3. A client-tampered price is rejected at order creation.
4. Payment allocations can never exceed payment amount or invoice total, even under concurrent requests.
5. A configuration outside manufacturing limits cannot be ordered or quoted automatically.
6. Hidden products are absent from listings, search, sitemap, and direct URL (404).
7. PAN/VAT/QR/email never render while empty/unverified.

## 9. Risks

| Risk | Mitigation |
|---|---|
| Client has no structured rate list | Start with price-on-request; rate import template (CSV) in Phase 3 |
| Poor product photos | Placeholder style guide; client photo checklist |
| Malicious SVG/PDF artwork | Sanitization, separate asset origin, private storage |
| Scope creep to ERP | This document's non-goals; change-request for anything beyond |
| Nepali content delays | Ship EN first, NE fields optional with graceful fallback |

## 10. Milestones

| M | Phase | Output | Exit gate |
|---|---|---|---|
| M0 | 0 | Docs 01–06 | Owner/stakeholder approval |
| M1 | 1 | Clickable branded mockups (6 screens sets, demo data labelled) | UI direction approved |
| M2 | 2 | Auth, customers, catalog, admin products | Demo + tests |
| M3 | 3 | Specs, rates, customizer, quote requests | Demo with real rate sample |
| M4 | 4 | Orders + tracking | Order E2E passing |
| M5 | 5 | Admin orders, invoices, payments, dues, reports | Financial-integrity tests passing |
| M6 | 6 | CMS, SEO, security tests, deployment | Go-live checklist signed |

No dates or delivery commitments are made here; timelines to be agreed with the client after M0 approval.
