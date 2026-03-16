# Solar Cooking Solution Finder

## Project Specification — v0.5.1 | March 2026

**Lead:** Jason Erwin
**Collaborators:** EWB-Sweden (food group, ISC, MEL), solar PV/thermal vendors in Kenya & Tanzania

---

## 1. The Problem

Schools in Kenya and Tanzania spend heavily on LPG and biomass for cooking. Solar cooking solutions exist and are cost-effective but market penetration is below 1%. The barrier is the buying process — not the technology.

## 2. What We're Building

A mobile-accessible screening tool that lets school administrators input basic school info and receive a ranked comparison of solar cooking solutions with indicative costs, payback, and practical guidance. Under 15 minutes, no technical background needed.

### Technologies Assessed

1. **Scheffler + LPG hybrid** — Solar thermal baseload (lunch + supper via pre-cooking). LPG backup for breakfast and cloudy days. Works with existing cookware.
2. **Solar PV + battery** — PV + LFP storage + induction cookers. Cook anytime. Highest CAPEX. Requires induction-compatible cookware.
3. **Solar PV + LPG hybrid** — PV daytime induction + LPG backup. Lower CAPEX than full battery. Requires induction-compatible cookware.

### Technical Approach

- Form-based intake, deterministic calculations, template-based recommendations
- Bilingual: English and Swahili (fully translated including results page)
- Multi-currency: costs in KES, auto-converted to local currency (KES or TZS)
- Export: Copy to clipboard, Share via WhatsApp
- React web app + standalone HTML for sharing

---

## 3. User Flow (6 steps)

| Step | Inputs | Required fields |
|------|--------|----------------|
| 1. Location | Country, region, school name | Country*, Region* |
| 2. Headcount | Students, staff, school type | Students*, School type* |
| 3. Meals | Meals served, days/week, weeks/year | Meals* |
| 4. Menu | Foods cooked (multi-select) | At least 1 food* |
| 5. Site | Outdoor space, shading, electrical needs | Space*, Shading*, Electrical needs* |
| 6. Fuel & costs | Fuel types (multi-select), monthly cooking fuel spend, pot material | Fuel types*, Monthly spend*, Pot material* |

Progressive summary bar builds up as user enters data.

---

## 4. Solution Economics

### Scheffler + LPG Hybrid

- 1 dish per 50 students, sized for lunch + supper only. Breakfast from LPG backup.
- KES 770,000/dish installed (Thermofield March 2024)
- Solar fraction: 55% (L+S), 45% (B+L+S) — Thermofield empirical
- No cookware change required

### Solar PV Systems

- PV: KES 200,000/kW installed. Battery: KES 40,000/kWh. Inverter: KES 40,000/kW.
- BOS + install: 25%. Induction burners: KES 125,000/unit. Cookware: KES 200,000/set if aluminium.
- All costs converted to local currency before calculations.

### Expected Payback

| Solution | Low fuel | Medium fuel | High fuel |
|----------|----------|-------------|-----------|
| Scheffler + LPG | 10-15 yr | 5-8 yr | 3-5 yr |
| PV + Battery | 25+ yr | 12-18 yr | 8-12 yr |
| PV + LPG | 25+ yr | 15-25 yr | 10-15 yr |

---

## 5. Key Design Decisions

- **Energy priority framework**: Flags unmet electrical needs; shows opportunity cost of PV cooking vs lighting/computers/water
- **Induction cookware CAPEX**: Auto-added to PV solutions when school uses aluminium pots
- **Currency handling**: KES→TZS conversion (~17.1x) before all economics
- **Scheffler solar fraction**: Thermofield empirical pre-cooking model (45-55%), not meal-window matching
- **CO2**: Handles all fuel types (LPG, firewood, charcoal, mixed, electric)
- **Shading "no"**: Knocks out Scheffler (not just conditional)
- **School type → days/week**: Boarding=7, day=5, mixed=6 (auto-set)
- **"Energy cost per meal"**: Clarified label, excludes food ingredients

---

## 6. UX Features

| Feature | Description |
|---------|-------------|
| Required/optional markers | Red asterisk vs grey "(optional)" |
| Simplified fields | Removed: contact info, equipment age, grid connection, existing solar, kitchen type |
| Multi-select fuel | Checkboxes: LPG, Firewood, Charcoal, Electric |
| Currency formatting | Auto-commas, currency prefix |
| Info tooltips | Scheffler, induction, solar fraction, payback, TCO, energy cost/meal |
| Progressive summary | Running display of school profile as data is entered |
| Full bilingual | All UI including results page, caveats, vendor section in EN + SW |
| Three export options | Copy Summary, Share via WhatsApp, New Assessment |
| Clean restart | Resets all fields to defaults |

---

## 7. Bugs Fixed (cumulative)

| Version | Bug | Fix |
|---------|-----|-----|
| v0.4 | Currency mismatch (~17x for Tanzania) | All costs converted to local currency |
| v0.4 | Solar fraction 25% (should be 45-55%) | Thermofield empirical data |
| v0.4 | Dish oversizing (12→9 for 400 students) | ceil(diners/50), lunch+supper only |
| v0.4 | Savings formula double-counting | fuel × solar_fraction - OPEX |
| v0.5 | CO2 zero for mixed/electric fuel | Added handlers for all fuel types |
| v0.5.1 | School type didn't update days/week | Boarding→7, day→5, mixed→6 |
| v0.5.1 | Results page half-English in Swahili mode | All strings use t() translation |
| v0.5.1 | Restart carried over stale data | Full state reset |
| v0.5.1 | Dead fields in state | Removed contact info, equipment age, etc. |

---

## 8. Sprint Status

### Done
- Calculation engine (3 solutions), bilingual UI, WhatsApp + clipboard export
- Induction costing, energy priority framework, realistic PV costs
- All currency/solar fraction/dish sizing/CO2 fixes
- UX overhaul: required/optional, simplified fields, multi-select, formatting, tooltips, progressive summary
- Full translation (results page, caveats, vendor section)
- Bug fixes from code review: 12 issues addressed

### Remaining
- Mobile testing on mid-range Android
- Field test with 1+ school and 1+ vendor
- Validate MJ/meal with ISC (🔴 blocking)
- Real PV vendor quotes (🔴 needed)
- Swahili review by native speaker
- Invoice upload, PDF export, map integration (next sprint)

---

*v0.5.1 — March 2026.*
