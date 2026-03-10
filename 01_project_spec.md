# Solar Cooking Solution Finder

## Project Specification — v0.4 | March 2026

**Lead:** Jason Erwin
**Collaborators:** EWB-Sweden (food group, ISC, MEL), solar PV/thermal vendors in Kenya & Tanzania
**Sprint period:** March 2 – April 1, 2026 (paused April 2–19; work resumes April 20)
**Target end state:** Working prototype tested with 1–2 schools in Kenya or Tanzania
**Budget:** Self-funded by Jason Erwin. No EWB funds required for this phase.

---

## 1. The Problem We're Solving

Schools in Kenya and Tanzania spend heavily on LPG and biomass for cooking — one school in Karagwe reports €1,600/month for 400 students. Solar cooking solutions (thermal and PV) exist and are cost-effective but market penetration is below 1%. The main barrier isn't technology — it's the buying process.

Schools and vendors face the same friction points:

- No easy way for school administrators to understand which solar options are viable for their site
- High complexity comparing solar thermal, PV, and hybrid systems on equal footing
- Slow, manual back-and-forth between schools and vendors with no standard information format
- No accessible tools to estimate payback, savings, or cost-per-meal for non-technical users

---

## 2. What We're Building

A mobile-accessible screening tool — working name: **Solution Finder** — that allows school administrators to input basic information about their school, cooking setup, and site, and receive a clear output ranking the feasibility and economics of available solar cooking solutions.

The tool is not a full engineering assessment. It's a rapid first-pass screen — fast enough that a school administrator can complete it in under 15 minutes on a phone, with no technical background required.

### Primary User

School administrators and bursars in Kenya and Tanzania. Non-technical. Likely using a mid-range Android phone with variable connectivity. Plain language, simple inputs, clear outputs.

### Technologies Assessed

1. **Scheffler + LPG hybrid** — Solar thermal dishes provide baseload cooking energy for lunch and supper via pre-cooking and sequential cooking strategies. LPG backup handles breakfast and cloudy days. Uses existing cookware. Vendor data: Thermofield Industrial.
2. **Solar PV + battery** — PV panels with LFP battery storage power induction cookers. Cook anytime. Highest flexibility, highest CAPEX. Requires induction-compatible cookware.
3. **Solar PV + LPG hybrid** — PV panels for daytime induction cooking, LPG for mornings/evenings. Lower CAPEX than full battery. Requires induction-compatible cookware.

Standalone Scheffler (no backup) was dropped as impractical.

### Technical Approach

- Form-based intake with deterministic calculations
- Template-based recommendation output
- Bilingual: English and Swahili
- React web app, mobile-responsive
- Multi-currency: costs stored in KES, auto-converted to local currency (KES or TZS) for all outputs
- Export: WhatsApp-friendly text summary

---

## 3. Core User Flow

| Step | What happens |
|------|-------------|
| 1 | School location → solar irradiation lookup, currency set |
| 2 | Student/staff count, school type, attendance |
| 3 | Meals served, schedule |
| 4 | Foods cooked → energy intensity |
| 5 | Site space, shading, grid, electrical needs |
| 6 | Fuel type, monthly cost, equipment, pot material |
| 7 | Knockout filters → currency conversion → energy demand → technology screening → ranked output with CAPEX, payback, energy priority analysis |
| 8 | Vendor contacts |

---

## 4. Solution Economics

### Scheffler + LPG Hybrid

| Parameter | Value | Source |
|-----------|-------|--------|
| Dish size | 16m², 5.5-6 kW thermal | Thermofield spec |
| Capacity | 4 dishes per 200 students (lunch + supper) | Thermofield recommendation |
| Output | 120-140 MJ/day per dish | Thermofield testing |
| Cost | KES 770,000/dish installed | Thermofield March 2024 proposal |
| Solar fraction (lunch+supper) | 55% | Thermofield empirical claim |
| Solar fraction (3 meals incl. breakfast) | 45% | Adjusted for breakfast energy not solar-cookable |
| Cookware change | Not required | Direct heat to existing pots |

### Solar PV Systems

| Parameter | Value | Source |
|-----------|-------|--------|
| PV panels installed | KES 200,000/kW ($1,290/kW) | IRENA 2024 Africa avg + 20% off-grid premium |
| LFP battery installed | KES 40,000/kWh ($258/kWh) | Kenyan installer benchmarks (Plasma Solar 2025) |
| Inverter installed | KES 40,000/kW ($258/kW) | Market estimate |
| BOS + installation | 25% of equipment | Off-grid East Africa standard |
| Induction burners | KES 125,000/unit (5-10kW) | Market estimate |
| Induction cookware | KES 200,000/set (if replacing aluminium) | Market estimate |

### Component Lifetimes

| Component | Life | Replacements (30yr) | Cost at replacement |
|-----------|------|--------------------|--------------------|
| PV panels | 30 yr | 0 | — |
| LFP batteries | 10 yr | 2 | 60% of original |
| Inverter | 10 yr | 2 | 80% of original |
| Induction burners | 6 yr | 4 | 85% of original |
| Induction cookware | 15 yr | 1 | 80% of original |
| Scheffler dish | 30 yr | 0 | — |

### Expected Payback Ranges

| Solution | Low fuel spend | Medium fuel spend | High fuel spend |
|----------|---------------|-------------------|-----------------|
| Scheffler + LPG | 10-15 years | 5-8 years | 3-5 years |
| PV + Battery | 25+ years | 12-18 years | 8-12 years |
| PV + LPG | 25+ years | 15-25 years | 10-15 years |

Payback is highly sensitive to current fuel spend, solar fraction achieved, and local currency.

---

## 5. Currency Handling (v0.4)

All vendor costs are stored in KES. For Tanzanian schools, KES→TZS conversion is applied before any economic calculation. The conversion factor: TZS/KES = (TZS/USD) / (KES/USD) ≈ 2650/155 ≈ 17.1.

This was a critical bug fix in v0.4 — prior versions divided KES CAPEX by TZS savings without conversion, underestimating payback by ~17x for Tanzanian schools.

---

## 6. Energy Priority Framework

Electricity is the highest-value energy carrier. Cooking requires heat, which can come directly from sunlight without converting to electricity. The tool captures whether the school has unmet electrical needs and shows an opportunity cost comparison: what the same PV cooking budget could buy if split between Scheffler (cooking) + smaller PV (lighting, computers, water).

---

## 7. Key Bugs Fixed in v0.4

| Bug | Impact | Fix |
|-----|--------|-----|
| Currency mismatch | Payback underestimated ~17x for Tanzania | All costs converted to local currency before calculations |
| Scheffler solar fraction | Used 25% (only lunch in window); should be 45-55% | Based on Thermofield empirical data using pre-cooking model |
| Dish sizing | Inflated by meal scale factor (10 instead of 8 for 400 students) | Uses Thermofield's direct recommendation |
| Savings formula | Double-counted backup fuel | Corrected to: fuel × solar_fraction - OPEX |

---

## 8. Sprint Status

### Done
- Assessment methodology, input form, calculation engine (3 solutions)
- Bilingual UI (EN/SW), WhatsApp export
- Induction equipment costing, energy priority framework
- Realistic PV installed costs (IRENA + Kenyan data)
- Currency handling fix, solar fraction fix, dish sizing fix
- Payback validation against 5-10yr (Scheffler) / 10-15yr (PV) benchmarks

### Remaining
- Mobile testing on mid-range Android
- Field test with 1+ school and 1+ vendor
- Validate MJ/meal with ISC (🔴 blocking)
- Real PV vendor quotes (🔴 needed)
- Swahili review by native speaker
- Map integration, menu upload, photo upload, PDF export (next sprint)

---

*Working spec. Updated March 2026 (v0.4).*
