# Solar Cooking Solution Finder

## Decision Tree & Assessment Flow — v0.4 | March 2026

---

## Overview

Full assessment flow: inputs collected, assumptions applied, outputs generated. Each section maps to a screen in the tool. Solutions assessed: Scheffler+LPG hybrid, PV+battery, PV+LPG hybrid.

---

# PART A — USER INPUTS

## Input 1 — Location & Solar Data

| Field | Type | Purpose |
|-------|------|---------|
| School name | Free text | Report identification |
| Country | Dropdown: Kenya / Tanzania | Sets currency (KES/TZS), vendor database |
| Region / District | Dropdown | GHI lookup from regional data table |
| Contact name, phone, email | Free text | Vendor handoff |

GHI knockout threshold: 4.5 kWh/m²/day (TBC with ISC).

## Input 2 — Number of People Eating

| Field | Type | Default |
|-------|------|---------|
| Students enrolled | Numeric | Required |
| Faculty/staff | Numeric | 5% of students if blank |
| School type | Dropdown | Sets attendance default |
| Attendance % | Numeric | Boarding: 100%, Day: 85% |

## Input 3 — Meal Schedule

| Field | Type | Notes |
|-------|------|-------|
| Meals served | Multi-select | Breakfast, Morning tea, Lunch, Afternoon tea, Dinner |
| Days per week | Dropdown: 5/6/7 | Boarding typically 7 |
| School weeks/year | Numeric | Default 38 |

Solar-compatible meals: Morning tea, Lunch, Afternoon tea (09:00–16:00).
Meals requiring backup: Breakfast (~7am), Dinner (~6:30pm).

## Input 4 — Menu & Foods Cooked

Multi-select from common foods. Energy intensity multipliers (relative to 3.0 MJ/student/day baseline):

| Food | Multiplier | Category |
|------|-----------|----------|
| Ugali | 1.30 | High |
| Beans/pulses | 1.30 | High |
| Makande | 1.25 | High |
| Stew/meat | 0.90 | Medium |
| Rice | 0.85 | Medium |
| Bread/chapati | 0.70 | Medium |
| Cassava | 0.50 | Medium |
| Potatoes | 0.50 | Medium |
| Greens | 0.50 | Low |
| Porridge | 0.40 | Low |
| Eggs | 0.30 | Low |
| Tea | 0.25 | Low |

**⚠️ These multipliers are placeholders. Must be validated with ISC before school testing.**

## Input 5 — Site, Space & Electrical Needs

| Field | Type | Purpose |
|-------|------|---------|
| Outdoor space (m²) | Numeric | Min 50m² for Scheffler |
| Shading | Dropdown | Partial = conditional |
| Kitchen type | Dropdown | Indoor/outdoor/both |
| Grid connection | Yes/No | PV economics |
| Existing solar | Yes/No | Avoid double-counting |
| **Electrical needs** | Dropdown: Well served / Some / Poor / None | **Energy priority analysis** |

If electrical needs are "poor" or "none": PV solutions flagged with opportunity cost comparison.

## Input 6 — Current Cooking Setup & Costs

| Field | Type | Purpose |
|-------|------|---------|
| Fuel type | Dropdown | Baseline energy source |
| LPG cylinders/month | Numeric | If LPG |
| Biomass kg/month | Numeric | If biomass |
| Monthly fuel spend | Numeric (local currency) | Primary economic baseline |
| Cooking equipment | Dropdown | Compatibility |
| Equipment age | Dropdown | Investment case |
| **Pot material** | Dropdown: Aluminium / Stainless / Cast iron / Mixed | **If aluminium: cookware CAPEX added to PV solutions** |

---

# PART B — KNOCKOUT FILTERS

## Knockout 1 — Solar Resource (all solutions)

GHI < 4.5 kWh/m²/day → all solar solutions eliminated.

## Knockout 2 — Space (Scheffler only)

< 50m² → Scheffler removed. Partial shade → Scheffler conditional.

---

# PART C — CALCULATIONS

## C0 — Currency Conversion (v0.4 critical fix)

All vendor costs (Scheffler, PV, battery, inverter, induction) are stored in KES. Before any economic calculation:

```
local_cost = KES_cost × (TZS_per_USD / KES_per_USD)   // for Tanzania
local_cost = KES_cost × 1.0                            // for Kenya
```

Conversion factor: KES→TZS ≈ 17.1. This ensures CAPEX and savings are in the same currency for payback calculation.

**Previous bug:** v0.1-v0.3 divided KES CAPEX by TZS savings, underestimating Tanzania payback by ~17x.

## C1 — Daily Energy Demand

```
Total diners = (students + staff) × attendance rate
Meal scale factor = Σ(0.5 per main meal + 0.1 per light meal)
Food energy multiplier = average of selected food intensities
Daily energy (MJ) = diners × 3.0 MJ × meal_scale × food_multiplier
```

## C2 — Scheffler + LPG Sizing

```
Dishes = ceil(diners / 50), rounded to nearest 4-dish unit, minimum 2
CAPEX (KES) = dishes × 770,000 + 200,000 kitchen mods
CAPEX (local) = CAPEX (KES) × currency conversion factor
```

**Solar fraction (v0.4 — based on Thermofield empirical data):**

| Meal combination | Solar fraction | Basis |
|-----------------|---------------|-------|
| Lunch + supper only | 55% | Thermofield's core claim: 55-60% fuel displacement |
| Lunch + supper + breakfast | 45% | Breakfast ~20% of energy, can't be solar-cooked |
| Lunch only | 65% | Most cooking in solar window |
| Other combinations | 35% | Conservative fallback |

**Previous bug:** v0.1-v0.3 used meal-window matching (25% for 3-meal boarding), ignoring Thermofield's pre-cooking and sequential cooking model.

```
Annual savings (local) = annual_fuel × solar_fraction - annual_OPEX
Payback = CAPEX (local) / annual_savings (local)
```

## C3 — PV + Battery Sizing

```
Daily energy (kWh) = daily energy (MJ) / 3.6
PV (kW) = ceil(daily_kWh / (GHI × 0.85))
Battery (kWh) = ceil(daily_kWh × 0.6)
Inverter (kW) = ceil(PV × 1.1)
Induction burners = max(2, ceil(diners/200) × 2)

CAPEX (KES):
  PV: kW × 200,000
  Battery: kWh × 40,000
  Inverter: kW × 40,000
  BOS+install: 25% of above
  Induction: burners × 125,000 + cookware if aluminium pots

CAPEX (local) = CAPEX (KES) × conversion factor
Solar fraction = 85% (battery enables anytime cooking)
```

## C4 — PV + LPG Sizing

Same structure as C3 but:
- PV sized at 50% of demand (daytime only)
- Battery at 15% (small buffer)
- Solar fraction capped at 55%

## C5 — 30-Year TCO

Year-by-year in local currency:
- Initial CAPEX
- Annual OPEX + annual backup fuel (with 5%/yr inflation)
- Battery + inverter replacement at yr 10, 20
- Induction burner replacement at yr 6, 12, 18, 24
- Cookware replacement at yr 15

## C6 — Opportunity Cost (Energy Priority)

For each PV solution:
```
Remaining = PV_CAPEX - Scheffler_CAPEX
Alt PV size (kW) = remaining / (250,000 × conversion_factor)
```
Displayed as: "Same capital → Scheffler + X kW PV for lighting/computers/water."

---

# PART D — OUTPUTS

1. **Comparison table** — CAPEX, cost/meal, payback, 30yr TCO, solar %, CO₂ (all in local currency)
2. **Recommendation** — template paragraph, caveats for unmet electrical needs
3. **Energy priority analysis** — opportunity cost for PV solutions
4. **Induction notice** — for PV solutions, with cookware cost if applicable
5. **Cooking tips** — per solution type
6. **Schedule compatibility** — each meal flagged solar/backup
7. **Caveats** — estimates only, vendor visit needed, placeholder assumptions
8. **Vendor contacts** — Thermofield (Scheffler, Kenya); database expanding

---

# PART E — MASTER ASSUMPTIONS LOG

| # | Assumption | Value | Source | Status |
|---|-----------|-------|--------|--------|
| 1 | All meals hot cooked | Yes | Sanitation rationale | ✅ |
| 2 | GHI knockout | 4.5 kWh/m²/day | ISC | 🟡 TBC |
| 3 | Min space Scheffler | 50m² | ISC | ✅ |
| 4 | MJ/meal by food type | Placeholder multipliers | Kituyi/Ngeywo/Thermofield | 🔴 TBC |
| 5 | PV efficiency | 13% overall | Industry | 🟡 TBC |
| 6 | Scheffler efficiency | 55% optical | Thermofield/ISC | 🟡 TBC |
| 7 | LFP battery life | 10 years | Conservative for daily tropical cycling | ✅ |
| 8 | PV panel life | 30 years | IRENA/industry | ✅ |
| 9 | Scheffler life | 30 years | ISC/Thermofield | ✅ |
| 10 | Time horizon | 30 years | Jason/EWB | ✅ |
| 11 | Discount rate | 8% real | Placeholder | 🟡 TBC |
| 12 | Fuel inflation | 5%/yr real | Placeholder | 🟡 TBC |
| 13 | LPG CO₂ | 2.98 kg/kg | IPCC | ✅ |
| 14 | Biomass CO₂ | 1.83 kg/kg dry | IPCC | ✅ |
| 15 | School year | 38 weeks | Jason | ✅ |
| 16a | Scheffler cost | KES 770k/dish installed | Thermofield quote | ✅ |
| 16b | PV installed | KES 200k/kW | IRENA Africa + off-grid premium | 🟡 Needs quotes |
| 16c | Battery installed | KES 40k/kWh | Kenyan installer data | 🟡 Needs quotes |
| 16d | Inverter installed | KES 40k/kW | Market estimate | 🟡 Needs quotes |
| 16e | BOS + install | 25% of equipment | Off-grid standard | 🟡 Needs quotes |
| 17 | Attendance defaults | Boarding 100%, day 85% | Estimate | 🟡 TBC |
| 18 | Vendor database | Thermofield only | Jason/EWB | 🟡 Expanding |
| 19 | Solar thermal window | 09:00–16:00 | ISC | 🟡 TBC |
| 20 | Schedule compatibility | Outside window → backup | Design decision | ✅ |
| 21 | Inverter life | 10 years | Off-grid heavy use | ✅ |
| 22 | Battery replacement | 60% of original | Falling prices | 🟡 |
| 23 | Inverter replacement | 80% of original | Market estimate | 🟡 |
| 24 | Solar days/year | 235 | Thermofield 200-270 midpoint | 🟡 TBC |
| 25 | Induction for PV | Mandatory | Efficiency requirement | ✅ |
| 26 | Induction burner | KES 125k/unit | Market estimate | 🟡 Needs quotes |
| 27 | Induction cookware | KES 200k/set | Market estimate | 🟡 Needs quotes |
| 28 | Induction burner life | 6 years | Heavy institutional use | 🟡 |
| 29 | Induction efficiency | 90% | Industry standard | ✅ |
| 30 | Energy priority | Qualitative + opportunity cost | Design decision | ✅ |
| 31 | Energy per student/day | 3.0 MJ (lunch+supper) | Firewood consumption literature | 🟡 Needs ISC |
| 32 | Scheffler solar fraction | 55% (L+S), 45% (B+L+S), 65% (L only) | Thermofield empirical | 🟡 TBC |
| 33 | KES/TZS conversion | ~17.1 (via USD rates) | Exchange rate | 🟡 Fixed rate |

---

*v0.4 — March 2026. Critical fixes: currency handling, solar fraction, dish sizing, savings formula.*
