# Solar Cooking Solution Finder

## Project Specification — v0.6 | March 2026

**Lead:** Jason Erwin
**Collaborators:** EWB-Sweden (food group, ISC, MEL), solar PV/thermal vendors in Kenya & Tanzania

---

## 1. The Problem

Schools in Kenya and Tanzania spend heavily on LPG and biomass for cooking. LPG is expensive and supply chains can be limited or unreliable. Solar cooking solutions exist and are cost-effective, but market penetration is below 1%. No standardised comparison of alternatives exists — each vendor presents their solution in isolation. Schools lack an apples-to-apples way to evaluate options.

## 2. What We're Building

A mobile-accessible screening tool that lets school administrators input basic school info and receive a ranked, apples-to-apples comparison of solar cooking solutions — using the same metrics (upfront cost, fuel cost/meal, payback, 30-year total cost) across fundamentally different technologies. Under 15 minutes, no technical background needed. Saves hours on data collection.

### Technologies Assessed

1. **Scheffler + LPG hybrid** — Solar thermal (lunch + supper via pre-cooking). LPG backup for breakfast/cloudy days. Works with existing cookware.
2. **Solar PV + battery** — PV + LFP storage + induction cookers. Cook anytime. Highest upfront cost. Requires induction-compatible cookware.
3. **Solar PV + LPG hybrid** — PV daytime induction + LPG backup. Lower upfront cost than full battery. Requires induction-compatible cookware.

### Technical Approach

- Form-based intake, deterministic calculations, template-based recommendations/comparisons
- Bilingual: English and Swahili (fully translated including results)
- Multi-currency: costs in KES, auto-converted to local (KES or TZS)
- Mobile-responsive: stacked cards, touch targets, radio pickers, collapsible sections
- Export: Copy to clipboard, Share via WhatsApp

---

## 3. Target Audience

| Audience | Use case |
|----------|----------|
| **School administrators** | Many don't know options like solar thermal exist. Tool raises awareness while providing clear, actionable outputs to present to their board. Non-technical, mobile-first. |
| **EWB / ISC partners** | Prioritise school visits, validate assumptions, connect schools with vendors. |
| **Solar vendors** | Receive pre-qualified leads with standardised school data. |

---

## 4. User Flow (6 steps)

| Step | Inputs | Required |
|------|--------|----------|
| 1. Location | Country, region, school name | Country*, Region* |
| 2. Headcount | Students, staff, school type | Students*, School type* |
| 3. Meals | Meals served, days/week, weeks/year | Meals* |
| 4. Menu | Foods cooked (multi-select) | At least 1 food* |
| 5. Site | Outdoor space (range picker), shading, electrical needs | Space*, Shading*, Electrical needs* |
| 6. Fuel & costs | Fuel types (multi-select), monthly cooking fuel spend, pot material | Fuel types*, Monthly spend*, Pot material* |

Progressive summary bar builds as user enters data.

---

## 5. Solution Economics

### Scheffler + LPG Hybrid

- 1 dish per 50 students, lunch + supper only. Breakfast from LPG.
- KES 770,000/dish installed (Thermofield March 2024)
- Solar fraction: 55% (L+S), 45% (B+L+S)
- No cookware change required

### Solar PV Systems

- PV: KES 200,000/kW. Battery: KES 40,000/kWh. Inverter: KES 40,000/kW.
- BOS: 25%. Induction: KES 125,000/burner. Cookware: KES 200,000/set if aluminium.

### Expected Payback

| Solution | Low fuel | Medium fuel | High fuel |
|----------|----------|-------------|-----------|
| Scheffler + LPG | 10-15 yr | 5-8 yr | 3-5 yr |
| PV + Battery | 25+ yr | 12-18 yr | 8-12 yr |
| PV + LPG | 25+ yr | 15-25 yr | 10-15 yr |

---

## 6. UX Design (v0.6)

### Mobile-First
- Breakpoint 640px. Stacked solution cards on mobile. Full-width buttons, 48px touch targets.
- Radio picker for space estimate. Info tooltips as centred modal overlays.
- iOS zoom prevention (16px inputs).

### Plain Language
- CAPEX → "Upfront cost", TCO → "Total cost (30yr)", Solar % → "Solar share"
- Full EN/SW translation including induction notice, GHI knockout, detail labels, progress bar

### Results Page Hierarchy
1. Header + baseline stats
2. Recommendation
3. "What to do next" CTA — vendor phone (tap-to-call), "share with your bursar"
4. Solution comparison (cards on mobile, table on desktop)
5. Energy priority (only for poor/no electricity, condensed, expandable)
6. Collapsible: technical details, cooking tips, schedule notes
7. Caveats, vendor info

### Input Improvements
- Space: range picker (classroom/half pitch/pitch)
- LPG cylinders: auto-estimates monthly cost
- Shading: defaults to "partial" (conservative)
- Fuel: multi-select checkboxes
- Currency: auto-commas, prefix

---

## 7. Bugs Fixed (cumulative)

| Version | Bug | Fix |
|---------|-----|-----|
| v0.4 | Currency mismatch (~17x Tanzania) | Local currency conversion |
| v0.4 | Solar fraction 25% → 45-55% | Thermofield empirical |
| v0.4 | Dish oversizing 12→9 | ceil(diners/50) |
| v0.5 | CO2 zero for mixed/electric | All fuel handlers |
| v0.5.1 | School type didn't update days/week | Boarding→7, day→5, mixed→6 |
| v0.5.1 | Half-English results in Swahili | All strings via t() |
| v0.5.1 | Stale data on restart | Full state reset |
| v0.6 | ProgressBar crash (missing lang prop) | Added lang prop |
| v0.6 | Hooks violation (useIsMobile inline) | Moved to component top |
| v0.6 | Induction/GHI/detail labels hardcoded English | All translated |

---

## 8. Status

### Done
- Calculation engine, bilingual UI, WhatsApp + clipboard export
- Mobile-responsive design, UX overhaul from formal review
- Jargon removal, collapsible results, "What to do next" CTA
- Full translation, all bug fixes, 9-slide deck, documentation

### Under Consideration
- Range-based outputs (needs confidence bands)
- Additional solution for smaller schools (technology TBD)
- Regional contact list for Kenya/Tanzania (needs data)

### Remaining
- Validate MJ/meal with ISC (🔴 blocking)
- Real PV vendor quotes (🔴 needed)
- Swahili review by native speaker
- Deploy to web host (TBD)
- Field test with 1+ school

---

*v0.6 — March 2026.*
