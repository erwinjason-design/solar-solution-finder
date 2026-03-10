# Solar Cooking Solution Finder — Assumptions Register

## v0.4 | March 2026

Every assumption in the calculation engine with current values, sources, and validation status.

**Status:** ✅ Confirmed | 🟡 TBC (reasonable estimate) | 🔴 BLOCKING (must resolve before school testing)

---

## 1. School & Demand

| # | Assumption | Value | Source | Status |
|---|-----------|-------|--------|--------|
| 1 | All meals hot cooked | Yes | Sanitation/safety for KE/TZ schools | ✅ (EWB food group) |
| 15 | School year | 38 weeks (user override) | Jason/EWB | ✅ |
| 17 | Attendance — boarding | 100% | Default, user override | 🟡 |
| 17 | Attendance — day | 85% | Default, user override | 🟡 |
| 17 | Staff count default | 5% of students | Estimate | 🟡 |
| 31 | Useful energy/student/day | 3.0 MJ (lunch+supper baseline) | 0.35-0.55 kg firewood/student/day (Kituyi 2000, Ngeywo 2008), 19 MJ/kg, 35% stove efficiency | 🟡 Needs ISC |

---

## 2. Food Energy Intensity

Multipliers scale the 3.0 MJ baseline. Weighted average calculated from school's food selection.

| # | Food | Multiplier | Category | Status |
|---|------|-----------|----------|--------|
| 4 | Ugali | 1.30 | High | 🔴 Placeholder |
| 4 | Beans/pulses | 1.30 | High | 🔴 Placeholder |
| 4 | Makande | 1.25 | High | 🔴 Placeholder |
| 4 | Stew/meat | 0.90 | Medium | 🔴 Placeholder |
| 4 | Rice | 0.85 | Medium | 🔴 Placeholder |
| 4 | Bread/chapati | 0.70 | Medium | 🔴 Placeholder |
| 4 | Cassava | 0.50 | Medium | 🔴 Placeholder |
| 4 | Potatoes | 0.50 | Medium | 🔴 Placeholder |
| 4 | Greens | 0.50 | Low | 🔴 Placeholder |
| 4 | Porridge | 0.40 | Low | 🔴 Placeholder |
| 4 | Eggs | 0.30 | Low | 🔴 Placeholder |
| 4 | Tea | 0.25 | Low | 🔴 Placeholder |

**⚠️ Most important assumptions to validate.** Relative ordering is directionally correct; specific multipliers need ISC calibration with MJ/meal data.

---

## 3. Solar Resource

| # | Assumption | Value | Source | Status |
|---|-----------|-------|--------|--------|
| 2 | GHI knockout | 4.5 kWh/m²/day | ISC | 🟡 TBC |
| 24 | Solar productive days/yr | 235 | Thermofield 200-270 midpoint | 🟡 TBC |
| 19 | Solar thermal window | 09:00–16:00 | ISC/Thermofield | 🟡 TBC |
| 20 | Outside window → backup | Yes | Design decision | ✅ |

---

## 4. Scheffler Solar Thermal

Source: **Thermofield Industrial** (Nairobi), March 2024 proposal.

| # | Assumption | Value | Source | Status |
|---|-----------|-------|--------|--------|
| 3 | Min space | 50m² unshaded | ISC/Thermofield | ✅ |
| 6 | Optical efficiency | 55% (50-60%) | Thermofield/ISC | 🟡 TBC |
| 9 | Lifespan | 30 years | ISC/Thermofield | ✅ |
| — | Dish area | 16m² | Thermofield spec | ✅ |
| — | Dish output | 130 MJ/day (120-140) | Thermofield testing | ✅ |
| — | Capacity | 4 dishes per 200 students (L+S) | Thermofield recommendation | ✅ |
| 16a | Dish cost | KES 700,000 + 70,000 install = KES 770,000 | Thermofield quote | ✅ |
| — | Kitchen mods | KES 200,000 | Estimate | 🟡 |
| — | Annual maintenance | KES 15,000/dish + KES 60,000 operator | Estimate | 🟡 |
| — | Cookware change | Not required | Direct heat design | ✅ |
| 32 | Solar fraction — lunch+supper | **55%** | Thermofield empirical claim (55-60%) | 🟡 TBC |
| 32 | Solar fraction — 3 meals w/ breakfast | **45%** | Breakfast ~20% of energy, not solar-cookable | 🟡 TBC |
| 32 | Solar fraction — lunch only | **65%** | Most cooking in solar window | 🟡 TBC |

**v0.4 fix:** Previous versions used meal-window matching (25% for 3-meal boarding). Thermofield's model cooks supper foods during solar hours using pre-cooking and sequential strategies. 55% for lunch+supper is their tested operational claim.

---

## 5. Solar PV Systems

Market estimates — **not vendor quotes**. Replace with real quotes when available.

| # | Assumption | Value | Source | Status |
|---|-----------|-------|--------|--------|
| 5 | PV system efficiency | 13% overall | Industry standard | 🟡 TBC |
| 8 | PV panel life | 30 years (~0.5%/yr degradation) | IRENA/industry | ✅ |
| 16b | PV panels installed | **KES 200,000/kW ($1,290)** | IRENA 2024 Africa avg $1,093/kW + 20% off-grid premium | 🟡 Needs quotes |
| 16c | LFP battery installed | **KES 40,000/kWh ($258)** | Kenyan installer: KES 30-45k/kWh (Plasma Solar 2025) | 🟡 Needs quotes |
| 16d | Inverter installed | **KES 40,000/kW ($258)** | Market estimate (inverter + wiring + protection) | 🟡 Needs quotes |
| 16e | BOS + installation | **25% of equipment** | Mounting, wiring, transport, commissioning, site prep | 🟡 Needs quotes |

---

## 6. Component Lifetimes & Replacements

| # | Component | Life | Replacements (30yr) | Cost factor | Source | Status |
|---|-----------|------|--------------------|-----------|---------| --------|
| 8 | PV panels | 30 yr | 0 | — | IRENA | ✅ |
| 7 | LFP batteries | 10 yr | 2 (yr 10, 20) | 60% | LFP 6000-10000 cycles, conservative tropical | ✅ |
| 21 | Inverter | 10 yr | 2 (yr 10, 20) | 80% | Off-grid heavy daily use | ✅ |
| 28 | Induction burners | 6 yr | 4 | 85% | Heavy institutional use | 🟡 |
| — | Induction cookware | 15 yr | 1 (yr 15) | 80% | Stainless steel | 🟡 |
| 9 | Scheffler dish | 30 yr | 0 | — | ISC/Thermofield | ✅ |

---

## 7. Induction Equipment (PV solutions only)

| # | Assumption | Value | Source | Status |
|---|-----------|-------|--------|--------|
| 25 | Required for PV | **Yes, mandatory** | Induction 85-90% efficiency vs 60% resistive; resistive would ~double PV sizing | ✅ |
| 26 | Burner cost | KES 125,000/unit (5-10kW) | Market estimate | 🟡 Needs quotes |
| — | Burners needed | 2 per 200 students | Sizing estimate | 🟡 |
| 27 | Cookware set | KES 200,000 (50-100L stainless steel) | Market estimate | 🟡 Needs quotes |
| 29 | Induction efficiency | 90% | Industry standard | ✅ |

---

## 8. Financial

| # | Assumption | Value | Source | Status |
|---|-----------|-------|--------|--------|
| 10 | Time horizon | 30 years | Longest component life | ✅ |
| 11 | Discount rate | 8% real | Placeholder for East Africa | 🟡 TBC (EWB MEL) |
| 12 | Fuel inflation | 5%/yr real | Placeholder | 🟡 TBC |
| — | Cost per meal | Annual fuel ÷ annual meals | Direct calculation | ✅ |
| — | Solar cost/meal | (Annualised CAPEX + OPEX + backup) ÷ annual meals | Includes replacements | ✅ |
| — | Savings | Annual fuel × solar fraction - OPEX | **v0.4 fix** | ✅ |
| — | Payback | CAPEX (local) ÷ savings (local) | **v0.4 fix: same currency** | ✅ |

---

## 9. Currency (v0.4 critical fix)

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 33 | KES per USD | 155 | 🟡 Fixed rate |
| 33 | TZS per USD | 2,650 | 🟡 Fixed rate |
| 33 | KES→TZS conversion | ≈ 17.1 | Derived from USD rates |

All vendor costs stored in KES. Converted to local currency before all economic calculations. Previous versions (v0.1-v0.3) had a critical bug: KES CAPEX divided by TZS savings for Tanzania schools, underestimating payback by ~17x.

---

## 10. Environmental

| # | Assumption | Value | Source | Status |
|---|-----------|-------|--------|--------|
| 13 | LPG CO₂ | 2.98 kg CO₂/kg LPG | IPCC | ✅ |
| 14 | Biomass CO₂ | 1.83 kg CO₂/kg dry | IPCC | ✅ |
| — | CO₂ savings | Informational only, not a ranking factor | Design decision | ✅ |

---

## 11. Energy Priority

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 30 | Weighting | Qualitative context + opportunity cost display | ✅ |
| — | Alt PV cost | KES 250,000/kW installed (with small buffer) | 🟡 |
| — | Poor/no electricity | Recommendation text caveats PV solutions | ✅ |

---

## Change Log

| Version | Date | Changes |
|---------|------|---------|
| v0.1 | Mar 2026 | Initial from decision tree + Thermofield |
| v0.2 | Mar 2026 | Battery 6→10yr, inverter added, induction equipment, separated PV components |
| v0.3 | Mar 2026 | Realistic PV installed costs (IRENA + Kenyan data), energy priority framework, bilingual |
| v0.4 | Mar 2026 | **Critical fixes:** currency conversion (KES→TZS), Scheffler solar fraction (25→45-55%), dish sizing, savings formula. Payback now matches expected 5-10yr (Scheffler) / 10-15yr (PV) ranges. |

---

*Update this register whenever assumptions change. Flag all changes in dev conversations and commits.*
