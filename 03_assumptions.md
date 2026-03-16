# Solar Cooking Solution Finder — Assumptions Register

## v0.5.1 | March 2026

**Status:** ✅ Confirmed | 🟡 TBC | 🔴 BLOCKING

---

## 1. School & Demand

| # | Assumption | Value | Source | Status |
|---|-----------|-------|--------|--------|
| 1 | All meals hot cooked | Yes | Sanitation/safety | ✅ |
| 15 | School year | 38 weeks | Jason/EWB | ✅ |
| 17 | Attendance — boarding | 100% | Default | 🟡 |
| 17 | Attendance — day | 85% | Default | 🟡 |
| 17 | Staff default | 5% of students | Estimate | 🟡 |
| 31 | Useful energy/student/day | 3.0 MJ (lunch+supper) | Kituyi 2000, Ngeywo 2008 | 🟡 Needs ISC |
| — | School type → days/week | Boarding=7, Day=5, Mixed=6 | v0.5.1 fix | ✅ |

---

## 2. Food Energy Intensity

⚠️ **Most important assumptions to validate.**

| # | Food | Multiplier | Status |
|---|------|-----------|--------|
| 4 | Ugali | 1.30 | 🔴 |
| 4 | Beans/pulses | 1.30 | 🔴 |
| 4 | Makande | 1.25 | 🔴 |
| 4 | Stew/meat | 0.90 | 🔴 |
| 4 | Rice | 0.85 | 🔴 |
| 4 | Bread/chapati | 0.70 | 🔴 |
| 4 | Cassava, Potatoes | 0.50 | 🔴 |
| 4 | Greens | 0.50 | 🔴 |
| 4 | Porridge | 0.40 | 🔴 |
| 4 | Eggs | 0.30 | 🔴 |
| 4 | Tea | 0.25 | 🔴 |

---

## 3. Solar Resource

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 2 | GHI knockout | 4.5 kWh/m²/day | 🟡 |
| 24 | Solar days/yr | 235 | 🟡 |
| 19 | Thermal window | 09:00–16:00 | 🟡 |

---

## 4. Scheffler (Thermofield Industrial, March 2024)

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 3 | Min space | 50m² unshaded | ✅ |
| — | Shading "no" | Knocks out Scheffler | ✅ v0.5.1 |
| 6 | Efficiency | 55% | 🟡 |
| 9 | Lifespan | 30 yr | ✅ |
| — | Dish area | 16m² | ✅ |
| — | Output | 130 MJ/day | ✅ |
| — | Capacity | 1 per 50 students, L+S only. Breakfast from LPG. | ✅ |
| 16a | Cost | KES 770k/dish installed | ✅ Vendor |
| — | Kitchen mods | KES 200k | 🟡 |
| — | Maintenance | KES 15k/dish + 60k operator/yr | 🟡 |
| — | Cookware change | Not required | ✅ |
| 32 | Solar fraction L+S | 55% | 🟡 |
| 32 | Solar fraction B+L+S | 45% | 🟡 |
| 32 | Solar fraction L only | 65% | 🟡 |

---

## 5. Solar PV (market estimates, not vendor quotes)

| # | Assumption | Value | Source | Status |
|---|-----------|-------|--------|--------|
| 8 | Panel life | 30 yr | IRENA | ✅ |
| 16b | PV installed | KES 200k/kW ($1,290) | IRENA 2024 Africa + 20% | 🟡 |
| 16c | LFP battery | KES 40k/kWh ($258) | Kenyan installer | 🟡 |
| 16d | Inverter | KES 40k/kW ($258) | Market est. | 🟡 |
| 16e | BOS + install | 25% | Off-grid EA | 🟡 |
| — | PV derate | 0.80 (temp, wiring, soiling) | Industry | ✅ |

---

## 6. Component Lifetimes

| # | Component | Life | Replacements | Cost factor | Status |
|---|-----------|------|-------------|------------|--------|
| 8 | PV panels | 30 yr | 0 | — | ✅ |
| 7 | LFP batteries | 10 yr | 2 | 60% | ✅ |
| 21 | Inverter | 10 yr | 2 | 80% | ✅ |
| 28 | Induction burners | 6 yr | 4 | 85% | 🟡 |
| — | Cookware | 15 yr | 1 | 80% | 🟡 |
| 9 | Scheffler | 30 yr | 0 | — | ✅ |

---

## 7. Induction (PV only)

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 25 | Required | Mandatory (85-90% vs 60% resistive) | ✅ |
| 26 | Burner cost | KES 125k/unit | 🟡 |
| 27 | Cookware set | KES 200k | 🟡 |
| 29 | Efficiency | 90% | ✅ |

---

## 8. Financial

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 10 | Horizon | 30 yr | ✅ |
| 11 | Discount rate | 8% real | 🟡 |
| 12 | Fuel inflation | 5%/yr | 🟡 |
| — | Savings formula | fuel × solar_fraction - OPEX | ✅ |
| — | Payback | CAPEX (local) ÷ savings (local) | ✅ |
| — | Baseline TCO | 30yr with fuel inflation (same as solar) | ✅ |

---

## 9. Currency

| Value | Rate | Status |
|-------|------|--------|
| KES/USD | 155 | 🟡 Fixed |
| TZS/USD | 2,650 | 🟡 Fixed |
| KES→TZS | ≈17.1 | Derived |

---

## 10. CO2

| Fuel | Factor | Status |
|------|--------|--------|
| LPG | 2.98 kg CO₂/kg | ✅ |
| Biomass | 1.83 kg CO₂/kg dry | ✅ |
| Electric | 0.4 kg CO₂/kWh (EA grid) | 🟡 |
| Mixed | 50/50 LPG/biomass | 🟡 |

---

## Change Log

| Version | Changes |
|---------|---------|
| v0.1 | Initial from decision tree + Thermofield |
| v0.2 | Battery 6→10yr, inverter, induction, PV components |
| v0.3 | Realistic PV costs, energy priority, bilingual |
| v0.4 | Currency fix, solar fraction fix, dish sizing, savings formula |
| v0.5 | CO2 fix (mixed/electric). UX: required/optional, simplified fields, multi-select fuel, currency formatting, tooltips, progressive summary, energy cost labeling, 3 exports |
| v0.5.1 | Code review: school type→days/week, full results translation (EN+SW), clean restart, dead field removal, shading "no" knockout confirmed, baseline TCO with inflation confirmed, PV derate clarified |

---

*Update when assumptions change. Flag in dev conversations and commits.*
