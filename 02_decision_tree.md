# Solar Cooking Solution Finder

## Decision Tree & Assessment Flow — v0.5.1 | March 2026

---

# PART A — USER INPUTS

## Input 1 — Location

| Field | Required | Purpose |
|-------|----------|---------|
| School name | Optional | Report ID |
| Country | **Required** | Currency, vendors |
| Region | **Required** | GHI lookup |

## Input 2 — Headcount

| Field | Required | Default |
|-------|----------|---------|
| Students | **Required** | — |
| Staff | Optional | 5% of students |
| School type | **Required** | Sets attendance + days/week |

School type auto-sets: Boarding → 100% attendance, 7 days/wk. Day → 85%, 5 days. Mixed → 90%, 6 days.

## Input 3 — Meals

| Field | Required |
|-------|----------|
| Meals served | **Required** (multi-select) |
| Days per week | Has default (from school type) |
| School weeks/year | Default 38 |

## Input 4 — Menu

| Field | Required |
|-------|----------|
| Foods cooked | **Required** (multi-select, min 1) |

Energy multipliers (⚠️ placeholders, need ISC):

| Food | Mult. | | Food | Mult. |
|------|-------|-|------|-------|
| Ugali | 1.30 | | Bread/chapati | 0.70 |
| Beans | 1.30 | | Cassava, Potatoes | 0.50 |
| Makande | 1.25 | | Greens | 0.50 |
| Stew/meat | 0.90 | | Porridge | 0.40 |
| Rice | 0.85 | | Eggs | 0.30 |
| | | | Tea | 0.25 |

## Input 5 — Site & Electrical Needs

| Field | Required | Purpose |
|-------|----------|---------|
| Outdoor space (m²) | **Required** | Min 50m² for Scheffler |
| Shading | **Required** | "No" → Scheffler knockout. "Partial" → conditional. |
| Electrical needs | **Required** | Energy priority analysis |

## Input 6 — Fuel & Costs

| Field | Required | Notes |
|-------|----------|-------|
| Fuel types | **Required** | Multi-select checkboxes: LPG, Firewood, Charcoal, Electric |
| LPG cylinders/mo | Optional | If LPG selected |
| Biomass kg/mo | Optional | If firewood/charcoal selected |
| Monthly cooking fuel spend | **Required** | Local currency, auto-formatted with commas. **Cooking only.** |
| Pot material | **Required** | Aluminium → cookware CAPEX for PV |

---

# PART B — KNOCKOUT FILTERS

1. GHI < 4.5 kWh/m²/day → all solar eliminated
2. Space < 50m² OR shading "no" → Scheffler removed. Shading "partial" → Scheffler conditional.

---

# PART C — CALCULATIONS

## C0 — Currency Conversion

All costs in KES. Kenya: ×1.0. Tanzania: ×17.1 (TZS/KES via USD rates).

## C1 — Energy Demand

```
Diners = (students + staff) × attendance
Meal scale = Σ(0.5 per main meal + 0.1 per light meal)
Food multiplier = avg of selected food intensities
Daily energy (MJ) = diners × 3.0 × meal_scale × food_multiplier
```

## C2 — Scheffler Sizing

```
Dishes = ceil(diners / 50), min 2. Lunch+supper only. Breakfast from LPG.
Solar fraction: 55% (L+S), 45% (B+L+S), 65% (L only)
```

## C3 — PV + Battery

```
PV (kW) = ceil(daily_kWh / (GHI × 0.80))
Battery = ceil(daily_kWh × 0.6), Inverter = ceil(PV × 1.1)
Solar fraction = 85%
```

## C4 — PV + LPG

PV at 50% demand, battery at 15%, solar fraction capped at 55%.

## C5 — Economics

```
Savings = annual_fuel × solar_fraction - OPEX
Payback = CAPEX (local) ÷ savings (local)
Baseline TCO = 30yr sum with 5%/yr fuel inflation (same treatment as solar TCO)
```

## C6 — CO2

- LPG: kg × 2.98. Firewood/charcoal: kg × 1.83. Electric: kWh × 0.4.
- Mixed: 50/50 LPG/biomass split. All fuel types handled.

## C7 — Opportunity Cost

Only when Scheffler eligible: `PV_CAPEX - Scheffler_CAPEX = budget for alt PV (lighting/computers)`.

---

# PART D — OUTPUTS

All fully translated (EN + SW):

1. Comparison table (CAPEX, energy cost/meal, payback, 30yr TCO, solar %, CO₂)
2. Recommendation with energy priority caveats
3. Opportunity cost analysis (when Scheffler eligible)
4. Induction equipment notice (PV solutions)
5. Cooking tips per solution
6. Schedule compatibility (solar/backup per meal)
7. Caveats (full Swahili version)
8. Vendor contacts
9. Export: Copy Summary, Share via WhatsApp, New Assessment

---

# PART E — ASSUMPTIONS LOG

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 1 | All meals hot cooked | Yes | ✅ |
| 2 | GHI knockout | 4.5 kWh/m²/day | 🟡 |
| 3 | Min space Scheffler | 50m² | ✅ |
| 4 | Food energy multipliers | Placeholders | 🔴 TBC |
| 5 | PV efficiency | 13% | 🟡 |
| 6 | Scheffler efficiency | 55% | 🟡 |
| 7 | LFP battery life | 10 yr | ✅ |
| 8 | PV panel life | 30 yr | ✅ |
| 9 | Scheffler life | 30 yr | ✅ |
| 10 | Time horizon | 30 yr | ✅ |
| 11 | Discount rate | 8% | 🟡 |
| 12 | Fuel inflation | 5%/yr | 🟡 |
| 13 | LPG CO₂ | 2.98 kg/kg | ✅ |
| 14 | Biomass CO₂ | 1.83 kg/kg | ✅ |
| 15 | School year | 38 wk | ✅ |
| 16a | Scheffler | KES 770k/dish | ✅ Vendor |
| 16b | PV installed | KES 200k/kW | 🟡 |
| 16c | Battery | KES 40k/kWh | 🟡 |
| 16d | Inverter | KES 40k/kW | 🟡 |
| 16e | BOS | 25% | 🟡 |
| 21 | Inverter life | 10 yr | ✅ |
| 22 | Battery replacement | 60% | 🟡 |
| 23 | Inverter replacement | 80% | 🟡 |
| 25 | Induction for PV | Mandatory | ✅ |
| 26 | Induction burner | KES 125k/unit | 🟡 |
| 27 | Cookware set | KES 200k | 🟡 |
| 28 | Burner life | 6 yr | 🟡 |
| 29 | Induction efficiency | 90% | ✅ |
| 30 | Energy priority | Qualitative + opp. cost | ✅ |
| 31 | Energy/student/day | 3.0 MJ | 🟡 |
| 32 | Scheffler solar fraction | 55/45/65% | 🟡 |
| 33 | KES→TZS | ~17.1 | 🟡 |

---

*v0.5.1 — March 2026. Code review fixes: school type→days/week, full translation, clean restart, dead field removal.*
