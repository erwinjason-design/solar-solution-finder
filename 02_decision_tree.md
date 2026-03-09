# Solar Cooking Solution Finder
## Decision Tree & Assessment Flow — v0.2 | March 2026

*For school administrators in Kenya and Tanzania. Designed for non-technical users on mobile.*

---

## Overview

This document describes the full assessment flow: what information is collected from the school, how it is used, what assumptions are applied, and how outputs are generated. Each section maps directly to a screen or step in the tool.

**Structure:**
- [Part A — User Inputs](#part-a--user-inputs)
- [Part B — Knockout Filters](#part-b--knockout-filters)
- [Part C — Calculations](#part-c--calculations)
- [Part D — Outputs & Recommendations](#part-d--outputs--recommendations)
- [Part E — Master Assumptions Log](#part-e--master-assumptions-log)

---

# PART A — USER INPUTS

The tool collects six categories of input from the school.

---

## Input 1 — Location & Solar Data
*Establishes where the school is and what solar resource is available*

| Field | How collected | Why it matters |
|-------|--------------|----------------|
| School name | Free text | Identifies the school in reports and vendor follow-up |
| Address / village / district | Free text + optional GPS pin | Used to retrieve solar irradiation data from Global Solar Atlas API |
| Country | Dropdown: Kenya / Tanzania | Sets currency for outputs (KES or TZS) and relevant vendor database |
| Contact name, phone, email | Free text | Required for vendor handoff and report delivery |

> **Assumptions**
> - Solar irradiation data (GHI) is fetched automatically from Global Solar Atlas using GPS or nearest district centroid. The user does not enter this value.
> - If GPS is unavailable, the tool falls back to district-level average GHI. This introduces some imprecision — flagged in outputs.
> - GHI knockout threshold is set at **4.5 kWh/m²/day**. To be validated with ISC before prototype testing.

---

## Input 2 — Number of People Eating
*Determines the scale of cooking capacity required*

| Field | How collected | Why it matters |
|-------|--------------|----------------|
| Number of students enrolled | Numeric input | Base figure for cooking capacity calculation |
| Number of faculty/staff eating | Numeric input (or estimate) | Adds to total daily load |
| Average daily attendance (%) | Slider or dropdown: 70% / 80% / 90% / 100% | Day schools have variable attendance; boarding schools default to 100% |

> **Assumptions**
> - Total daily diners = (students + staff) × attendance rate.
> - Attendance rate defaults to **100% for boarding schools** and **85% for day schools** unless overridden.
> - Faculty/staff count defaults to **5% of student enrollment** if left blank.

---

## Input 3 — School Type & Meal Schedule
*Identifies when meals are served and how many cooking events happen per day*

A boarding school serving three hot meals per day has approximately **3x the energy demand** of a day school serving lunch only.

| Field | How collected | Why it matters |
|-------|--------------|----------------|
| School type | Dropdown: Boarding / Day school / Mixed | Determines default meal schedule and days per week |
| Meals served | Multi-select: Breakfast / Morning tea / Lunch / Afternoon tea / Dinner | Each checked meal adds a cooking event to the daily energy load |
| Days per week meals are served | Dropdown: 5 / 6 / 7 days | Boarding schools typically 7 days; day schools typically 5 |
| School weeks per year | Numeric (default: 38 weeks) | Used for annual energy and cost calculations |

> **Assumptions**
> - **ALL meals are assumed to be hot cooked meals.** This is a sanitation and food safety assumption — cold food handling in school settings in Kenya and Tanzania carries significant hygiene risk. To be reviewed with EWB food group.
> - Breakfast is assumed to be the lightest cooking event (porridge/tea); dinner the heaviest if ugali or beans are served.
> - School year defaults to **38 weeks**. User can override.
> - Weekend meals for day schools default to zero unless specified.

---

## Input 4 — Menu & Foods Cooked
*Determines energy intensity of cooking — the most important variable after headcount*

Menu type is the single biggest driver of energy demand after the number of people. Ugali and beans require significantly more energy per meal than rice or light porridge.

| Field | How collected | Why it matters |
|-------|--------------|----------------|
| Primary lunch/dinner foods | Multi-select: Ugali / Beans / Rice / Greens / Mixed stew / Other | Sets energy intensity category for main cooking load |
| Breakfast foods | Multi-select: Porridge / Tea / Bread / Eggs / Other | Typically lower energy — helps size morning cooking window |
| Weekly menu document | Optional: PDF or photo upload, or doc share link | AI reads uploaded menu to auto-populate food selections. User can override. |
| Cooking frequency per food type | Auto-populated, user can adjust (e.g., "beans 3x per week") | Refines energy calculation beyond simple daily averages |

### Energy Intensity by Food Type

| Food type | Energy intensity | MJ/meal | Notes |
|-----------|-----------------|---------|-------|
| Ugali (maize) | 🔴 High | TBC — validate with ISC | Sustained high heat. Best match for Scheffler thermal. |
| Beans / pulses | 🔴 High | TBC — validate with ISC | Long cook times. Hybrid solar + LPG often optimal. |
| Rice / mixed grains | 🟡 Medium | TBC — validate with ISC | Flexible timing. All solutions viable. |
| Porridge / tea | 🟢 Low | TBC — validate with ISC | PV + induction pots most cost-effective. |

> **Assumptions**
> - **MJ/meal values are placeholders.** These MUST be validated with ISC/solar cooking experts before the tool produces real economic outputs.
> - If the user uploads a menu document, the AI maps foods to energy intensity categories. User reviews before calculation runs.
> - Where schools cook multiple food types, the tool uses a weighted average energy intensity based on frequency.

---

## Input 5 — Site & Available Space
*Determines whether space-constrained solutions like Scheffler reflectors are viable*

| Field | How collected | Why it matters |
|-------|--------------|----------------|
| Estimated outdoor space (m²) | Numeric input with visual guide (e.g., "about the size of a basketball court = ~400m²") | Minimum 50m² required for one Scheffler unit |
| Is the space unshaded? | Yes / No / Partially — with text box | Shading significantly reduces solar thermal output |
| Photos of school yard / kitchen area | Optional: photo upload via mobile camera | Helps vendors validate space estimate remotely |
| Is the kitchen indoors or outdoors? | Dropdown: Indoor / Outdoor / Both | Scheffler requires heat pipe connection to indoor kitchen |
| Grid electricity connection | Yes / No | Affects PV economics (net metering available in Kenya, 2024 regulations) |
| Existing solar installation | Yes / No — if yes, describe | Avoids double-counting; identifies expansion opportunities |

> **Assumptions**
> - Scheffler reflector requires minimum **50m²** of contiguous, unshaded outdoor space near the kitchen. Below this, solar thermal is knocked out.
> - If space is "partially shaded", solar thermal is flagged **conditional** rather than eliminated — vendor site visit needed.
> - Photo uploads are optional in v0.1 and stored for vendor review, not automatically analysed.

---

## Input 6 — Current Cooking Setup & Costs
*Establishes the baseline against which solar savings are measured*

Without knowing what the school currently pays for fuel, it is impossible to calculate savings, payback period, or cost-per-meal comparisons.

| Field | How collected | Why it matters |
|-------|--------------|----------------|
| Primary fuel type | Dropdown: LPG / Firewood / Charcoal / Electric / Mixed | Sets baseline energy source and cost structure |
| LPG: cylinders per month | Numeric (if LPG selected) | Standard 13kg cylinders. Used to calculate monthly spend and CO₂ baseline. |
| LPG: monthly spend | Numeric in KES or TZS | Direct cost input is more reliable than calculating from cylinder count |
| Biomass: kg per month + monthly spend | Numeric (if firewood/charcoal selected) | Harder to measure — tool flags higher uncertainty in outputs for biomass schools |
| Cooking equipment currently used | Multi-select: Open fire / LPG burners / Electric hotplates / Other | Informs training needs and compatibility with solar solutions |
| Estimated age of current equipment | Dropdown: < 2 yrs / 2–5 yrs / 5–10 yrs / > 10 yrs | Old equipment near end-of-life strengthens the solar investment case |

> **Assumptions**
> - **Current cost per meal (baseline)** = monthly fuel spend ÷ monthly meals served. This is the number all solar cost-per-meal figures are compared against.
> - LPG price is assumed to be the price the school reports paying. No regional price adjustment in v0.1.
> - Biomass baselines carry higher uncertainty. Outputs for biomass schools are presented as ranges.
> - Mixed fuel schools (LPG + biomass) handled by collecting both and summing costs. Flag for manual review in v0.1.

---

# PART B — KNOCKOUT FILTERS

Before any calculations run, two hard filters are applied. These either eliminate a solution or stop the assessment entirely.

---

## Knockout 1 — Solar Resource
*Applies to all solutions*

**Question (auto-checked — no user input required):**  
Is the site's annual Global Horizontal Irradiation (GHI) ≥ 4.5 kWh/m²/day?

| Result | Outcome |
|--------|---------|
| ✅ GHI ≥ 4.5 kWh/m²/day | Adequate solar resource. Proceed to Knockout 2. |
| ❌ GHI < 4.5 kWh/m²/day | **KNOCKOUT — All solar solutions eliminated.** |

**Message to user if knocked out:**  
*"Based on your location, solar energy levels at your site are unlikely to support a cost-effective solar cooking solution. We recommend speaking with a local energy advisor about LPG efficiency improvements or biogas options. You can still contact local vendors below for a professional assessment."*

> Assessment ends here if triggered. Vendor list is still shown.

> **Note:** Most of Kenya and Tanzania exceeds 5.0 kWh/m²/day. Below 4.5 is rare but possible in highland or frequently overcast areas. Threshold to be confirmed with ISC.

---

## Knockout 2 — Available Space
*Applies to Scheffler thermal solutions only*

**Question:**  
Does the school have ≥ 50m² of contiguous, unshaded outdoor space accessible to the kitchen?

| Result | Outcome |
|--------|---------|
| ✅ Yes | Scheffler reflector stays in solution set. Proceed to calculations. |
| ⚠️ Partially shaded | Scheffler flagged as **conditional**. Vendor site visit required to confirm. |
| ❌ No | **Scheffler reflector removed from solution set.** PV and hybrid PV options remain. |

**Message to user if knocked out:**  
*"Your available outdoor space does not meet the minimum for a Scheffler reflector system. We will assess solar PV and hybrid options instead."*

---

# PART C — CALCULATIONS

These are the calculations the tool runs on user inputs. All formulas and default values are documented here for expert review.

---

## C1 — Daily Energy Demand

```
Weekly meal count = (students + staff) × attendance rate × meals per day × days per week

Daily energy demand (MJ) = total daily diners × MJ per meal (weighted avg by menu type)

Annual energy demand (MJ) = daily energy demand × school days per year
```

> **Note:** MJ/meal values are placeholders — TO BE VALIDATED with ISC before prototype testing.

---

## C2 — Solar Energy Available

```
Usable solar energy per day (MJ/m²) = GHI (kWh/m²/day) × system efficiency factor × 3.6
```

**System efficiency factors (v0.1 defaults — to be validated):**
- Solar PV + induction cooking: ~12–14% overall (panel efficiency × inverter × induction)
- Scheffler reflector: 50–60% optical efficiency of usable heat at cooking surface

---

## C3 — Cost Per Meal (Primary Benchmark)

This is the lead output metric — directly comparable to what the school pays today.

```
Current cost per meal = monthly fuel spend ÷ monthly meals served

Solar cost per meal = (annualised CAPEX + annual OPEX + annual backup fuel cost) ÷ annual meals served

Annualised CAPEX = total system cost ÷ system lifespan, accounting for replacement costs (e.g. batteries at year 6)
```

> **Assumptions**
> - System lifespan: PV panels = 25 years. Batteries = 6 years (replacement included). Scheffler = 30 years.
> - All costs calculated over a **30-year horizon**.
> - NPV discount rate: **8% real** (placeholder — TBC with EWB MEL group).
> - Fuel price inflation: **5% per year real** (placeholder — TBC).
> - Cost per meal shown in both local currency (KES/TZS) and USD.
> - CAPEX benchmarks TO BE SOURCED from Kenya/Tanzania vendors.

---

## C4 — CO₂ / Environmental Impact

```
Annual CO₂ saved (kg) = annual fuel displaced × CO₂ emission factor per fuel type
```

**Emission factors:**
- LPG: 2.98 kg CO₂/kg (IPCC standard)
- Firewood/charcoal: 1.83 kg CO₂/kg dry biomass (IPCC)

> This is an **informational output only** — not a decision factor in the ranking.

---

## C5 — Cooking Schedule Compatibility
*Added in v0.2 — supports cooking habit guidance output*

The tool checks whether the recommended solution's productive hours align with the school's meal schedule:

```
Solar thermal productive window = approximately 09:00–16:00 (varies by season and location)

For each meal checked by user:
  - If meal time falls within solar window → COMPATIBLE
  - If meal time falls outside solar window → FLAG for backup or schedule adjustment
```

**Example flags generated:**
- Breakfast before 9am + Scheffler recommended → *"Your breakfast service falls before peak solar hours. LPG backup or a pre-heating strategy will be needed for breakfast."*
- Dinner + Scheffler only (no backup) → *"Dinner cannot be cooked using solar thermal without a backup energy source."*

---

# PART D — OUTPUTS & RECOMMENDATIONS

---

## D1 — Comparison Table

For each eligible solution, the tool shows the following benchmarks side by side:

| Solution | Est. cost/meal (USD) | Payback (yrs) | 30yr TCO (USD) | CO₂ saved/yr (kg) |
|----------|---------------------|---------------|----------------|-------------------|
| Solar PV + battery | $0.04–0.07 | 4–7 | $45,000–65,000 | 8,500 |
| Scheffler + LPG hybrid | $0.03–0.06 | 3–6 | $38,000–55,000 | 11,000 |
| Solar PV + LPG hybrid | $0.04–0.08 | 4–8 | $40,000–60,000 | 6,500 |
| Scheffler only | $0.03–0.05 | 4–7 | $35,000–50,000 | 13,000 |
| **Current (LPG baseline)** | **$0.18–0.22** | **N/A** | **$180,000–220,000** | **0** |

> ⚠️ All figures above are **illustrative placeholders** — shown to define the format only. Real values will be populated from validated vendor benchmarks and ISC energy data before prototype testing.

---

## D2 — Plain-Language Recommendation

Below the table, the tool generates a short paragraph summarising the top-ranked solution. Example:

> *"Based on your school's location, cooking needs, and available space, a Scheffler solar reflector with LPG backup looks like your strongest option. Your school currently spends about KES 48,000 per month on LPG. A Scheffler system could reduce that by 60–75%, saving you an estimated KES 28,000–36,000 per month. At current prices, you would recover the investment cost in around 4–6 years, and the system lasts 30+ years. We recommend speaking with the vendors listed below to get a site-specific quote."*

---

## D3 — Cooking Habit Tips (per solution)

For each recommended solution, the tool shows practical guidance for kitchen staff. This content is static per solution type — it does not change the ranking but accompanies the recommendation.

**Solar thermal (Scheffler) tips:**
- Pre-soak beans and lentils overnight to reduce daytime cooking time
- Schedule high-energy foods (ugali, beans) for 10am–2pm when solar output is highest
- Use LPG backup for breakfast and any cooking that runs past 4pm
- A trained operator is required — budget for initial training and annual refresher

**Solar PV + battery tips:**
- Induction pots are more efficient than conventional pots on electric — use flat-bottomed cookware
- Battery storage means cooking can happen at any time, but avoid running multiple high-draw appliances simultaneously
- Check battery charge level each morning — if below 30%, prioritise the most critical meal

**Hybrid system tips:**
- Think of LPG as insurance, not the primary fuel — aim to use solar for 60–80% of cooking
- Track monthly LPG use after installation to verify solar fraction is as expected

---

## D4 — Caveats & Assumptions Summary

Every output screen includes a visible caveats section:

- These figures are estimates based on the information you provided. A vendor site visit is needed for a firm quote.
- Energy costs and fuel prices change over time. Savings figures assume 5% annual fuel price increase.
- Scheffler systems require a trained operator. Budget for operator training in your total cost.
- Battery replacement costs are included in PV system totals at year 6. Check with your vendor on current battery prices.
- CO₂ savings figures are indicative. Actual savings depend on your local grid mix if grid-connected.

---

## D5 — Vendor Handoff

After the recommendation, the tool shows a filtered list of solution providers in the school's region:

- Organisation name and contact person
- Technologies supplied (PV / thermal / hybrid)
- Phone, email, website
- *"Share my assessment" button* — sends summary to a selected vendor *(future feature — out of scope v0.1)*

> **Assumptions**
> - Vendor database is a manually maintained spreadsheet in v0.1, filtered by region and technology.
> - Vendors listed have been pre-vetted by EWB or ISC partners. The tool does not endorse any specific vendor.
> - If no vendors are found in the school's region, the tool shows the nearest available and notes the distance.

---

# PART E — MASTER ASSUMPTIONS LOG

All assumptions used in the tool are logged here. Items marked **TBC** must be resolved before the tool produces real economic outputs.

| # | Assumption | Current value / basis | Status | Owner |
|---|-----------|----------------------|--------|-------|
| 1 | All meals are hot cooked meals | Sanitation/safety rationale for school settings | ✅ CONFIRMED | EWB food group |
| 2 | GHI knockout threshold | 4.5 kWh/m²/day | 🟡 TBC | ISC / solar experts |
| 3 | Minimum space for Scheffler | 50m² contiguous, unshaded | ✅ CONFIRMED | ISC |
| 4 | MJ/meal by food type | Placeholders only — not yet validated | 🔴 TBC | ISC / solar cooking experts |
| 5 | Solar PV system efficiency | 12–14% overall | 🟡 TBC | ISC / PV vendors |
| 6 | Scheffler optical efficiency | 50–60% usable heat at cooking surface | 🟡 TBC | ISC / Scheffler suppliers |
| 7 | Battery lifespan | 6 years (Li-ion) | ✅ CONFIRMED | Industry standard |
| 8 | PV panel lifespan | 25 years | ✅ CONFIRMED | Industry standard |
| 9 | Scheffler system lifespan | 30 years with regular maintenance | ✅ CONFIRMED | ISC |
| 10 | Assessment time horizon | 30 years | ✅ CONFIRMED | Jason / EWB |
| 11 | NPV discount rate | 8% real (placeholder) | 🟡 TBC | EWB MEL group |
| 12 | Fuel price inflation rate | 5% per year real (placeholder) | 🟡 TBC | EWB MEL / finance partners |
| 13 | LPG CO₂ emission factor | 2.98 kg CO₂/kg LPG (IPCC) | ✅ CONFIRMED | IPCC |
| 14 | Biomass CO₂ emission factor | 1.83 kg CO₂/kg dry wood (IPCC) | ✅ CONFIRMED | IPCC |
| 15 | School year duration | 38 weeks default (user can override) | ✅ CONFIRMED | Jason |
| 16 | CAPEX benchmarks by solution | TBC — source from Kenya/Tanzania vendors | 🔴 TBC | Solar PV vendors + Scheffler suppliers |
| 17 | Attendance rate defaults | Boarding 100%, day school 85% | 🟡 TBC | Field testing feedback |
| 18 | Vendor database | Manual spreadsheet, maintained by EWB/Jason | 🟡 IN PROGRESS | Jason / EWB Kenya/Tanzania |
| 19 | Solar thermal productive window | 09:00–16:00 (seasonal variation applies) | 🟡 TBC | ISC / solar thermal experts |
| 20 | Cooking schedule compatibility threshold | Meals outside 09:00–16:00 flagged for backup | 🟡 TBC | ISC / EWB food group |

---

*v0.2 — Updated March 2026. All TBC items must be resolved with EWB/ISC technical partners before the tool is tested with schools.*
