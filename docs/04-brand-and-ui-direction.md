# Brand & UI Direction (Phase 0)

Source: brief's description of the visiting card. **Must be re-checked against the actual card image when supplied.**

## 1. Brand principles
- Credible packaging supplier, not a SaaS/ERP look: warm, trade-practical, photo-led.
- The client's SP floral logo is used **as supplied or carefully cleaned from an approved source**. No AI-redrawn substitute. Until supplied, Phase 1 mockups use a clearly marked text placeholder "SP — Business Link".
- Bilingual identity: English name primary, Nepali name always shown in header/footer.

## 2. Palette (design tokens)

| Token | Hex | Use |
|---|---|---|
| `--navy` | #12336B | Headings, header, footer, primary buttons |
| `--red` | #D83B55 | CTAs ("Request Quotation"), accents, badges |
| `--green` | #21876D | Success, "In stock/Available", fabric/eco accents |
| `--bg` | #F8FAFC | Page background |
| `--white` | #FFFFFF | Cards |
| `--text` | #172033 | Body |
| `--muted` | #5B6578 | Secondary text (verify ≥ 4.5:1 on bg) |
| `--border` | #E2E8F0 | Dividers |
| `--sky` | #EAF2FB | Light-blue section tint (echoes card background) |

Derive hover/dark-mode shades with a script and contrast-check them; admin panel may offer dark mode later (not v1).

## 3. Typography
- Latin: Inter or Plus Jakarta Sans (headings semi-bold), 16 px base.
- Devanagari: Noto Sans Devanagari, self-hosted, same scale; line-height +10% for Nepali.
- Numbers in tables: tabular figures; currency "NPR" / "रु" format `Rs. 1,250.00`.

## 4. Components & motion
shadcn/ui base, 12 px radius cards, soft shadow, 8-pt spacing. Motion restrained: 150–250 ms fades/translates, `prefers-reduced-motion` respected. Product cards: photo, name (EN/NE), spec chips (e.g. "GSM 60 · 40 in"), price display per mode (`Rs. X / kg`, `Starting from`, `Price on request`), primary action "Customize" or "Request Quote".

## 5. Homepage section map (14 sections from brief)
1 Contact bar (phones, address) → 2 Header/nav (logo, Products, Customize, About, Contact, Login, language toggle) → 3 Hero ("Quality Plastic & Fabric Packaging for Your Business") → 4 Category grid (admin-driven) → 5 Featured products → 6 Fabric & plastic rolls → 7 Shopping/handle bags → 8 Custom printing → 9 How custom orders work (4 steps) → 10 Wholesale supply (text only; no capacity claims) → 11 Benefits (only verifiable statements) → 12 Inquiry CTA + form → 13 Contact/location (map embed once coordinates confirmed) → 14 Footer.
Rules: no invented testimonials, achievements, years in business, or certifications. Demo content in Phase 1 carries a visible "DEMO" marker.

## 6. Footer design (from card)

Deep navy `#12336B`, thin red top rule (`#D83B55`, 3 px), white/70% text.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [Approved SP logo]  Sanjana Plastic & Business Link                      │
│                     सञ्जना प्लास्टिक एण्ड बिजनेस लिंक                    │
│  Tarkeshwor-6, Dharmasthali, Kathmandu                                   │
│  ☎ 9851255796 · 9841180105     (tap-to-call on mobile)                   │
├──────────────┬───────────────┬──────────────────┬────────────────────────┤
│ COMPANY      │ PRODUCTS      │ CUSTOMER SUPPORT │ CONTACT                │
│ About Us     │ Fabric Rolls  │ My Account       │ Address                │
│ Contact Us   │ Plastic Rolls │ My Orders        │ Phone ×2               │
│ Wholesale    │ Shopping Bags │ Request Quotation│ WhatsApp *             │
│ Supply       │ Handle Bags   │ Delivery Info    │ Email *                │
│              │ Custom Printed│                  │ Business hours *       │
├──────────────┴───────────────┴──────────────────┴────────────────────────┤
│ LEGAL: Privacy Policy · Terms & Conditions · Return/Cancellation Policy  │
│ © {year} Sanjana Plastic & Business Link   |  PAN/VAT * (only if verified)│
└──────────────────────────────────────────────────────────────────────────┘
* rendered only when filled and verified in Admin → Settings
```
Mobile: single column, accordion link groups, sticky bottom bar "Call · Quote" on public pages. Footer product links come from enabled categories, not hard-coded.

## 7. Bag customizer UX
Left: step wizard (Bag type → Material → Color → Size → Handle → Printing → Artwork → Quantity → Delivery → Notes). Right: SVG bag preview (recolor via CSS var; logo/shop-name placement draggable within safe area; front/back toggle). Persistent caption: "Approximate preview — not final print-ready artwork." Footer of panel: price state (`Rs. X` / "Request Custom Quotation"), MOQ, validation messages in plain language.

## 8. Phase 1 mockup scope (after approval)
Next.js static mockups with demo data: Homepage, Product catalog, Product detail, Bag customizer, Customer account (orders + dues), Admin dashboard. Responsive at 375 / 768 / 1280. Each screen shows a "Demo data" ribbon.

## 9. Accessibility & performance
Contrast AA; focus rings; semantic landmarks; alt text from admin; Next/Image with AVIF/WebP, sized; fonts subset + `font-display: swap`; no layout shift on hero.
