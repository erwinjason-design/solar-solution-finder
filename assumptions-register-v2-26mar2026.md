# Solar Cooking Solution Finder — Assumptions Register

## v0.6 | March 2026

**Status:** ✅ Confirmed | 🟡 TBC | 🔴 BLOCKING

---

## 1. School & Demand

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 1 | All meals hot cooked | Yes | ✅ |
| 15 | School year | 38 weeks | ✅ |
| 17 | Attendance: boarding/day/mixed | 100% / 85% / 90% | 🟡 |
| 17 | Staff default | 5% of students | 🟡 |
| 17 | Days/week: boarding/day/mixed | 7 / 5 / 6 (auto-set) | ✅ |
| 31 | Energy/student/day | 3.0 MJ (L+S baseline) | 🟡 Needs ISC |

---

## 2. Food Energy Intensity

⚠️ **Most important assumptions to validate.**

| Food | Multiplier | Status |
|------|-----------|--------|
| Ugali | 1.30 | 🔴 |
| Beans | 1.30 | 🔴 |
| Makande | 1.25 | 🔴 |
| Stew/meat | 0.90 | 🔴 |
| Rice | 0.85 | 🔴 |
| Chapati | 0.70 | 🔴 |
| Cassava/Potatoes | 0.50 | 🔴 |
| Greens | 0.50 | 🔴 |
| Porridge | 0.40 | 🔴 |
| Eggs | 0.30 | 🔴 |
| Tea | 0.25 | 🔴 |

---

## 3. Solar Resource

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 2 | GHI knockout | 4.5 kWh/m²/day | 🟡 |
| 24 | Solar days/yr | 235 | 🟡 |
| 19 | Thermal window | 09:00–16:00 | 🟡 |

---

## 4. Scheffler (Thermofield, March 2024)

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 3 | Min space | 50m² unshaded | ✅ |
| — | Shading "no" | Knocks out Scheffler | ✅ |
| — | Shading default | "Partial" (conservative) | ✅ v0.6 |
| — | Space input | Range picker (not raw m²) | ✅ v0.6 |
| 6 | Efficiency | 55% | 🟡 |
| 9 | Lifespan | 30 yr | ✅ |
| — | Capacity | 1 per 50 students, L+S only | ✅ |
| 16a | Cost | KES 770k/dish | ✅ Vendor |
| 32 | Solar fraction L+S | 55% | 🟡 |
| 32 | Solar fraction B+L+S | 45% | 🟡 |
| 32 | Solar fraction L only | 65% | 🟡 |

---

## 5. Solar PV (market estimates)

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 16b | PV installed | KES 200k/kW | 🟡 Needs quotes |
| 16c | LFP battery | KES 40k/kWh | 🟡 Needs quotes |
| 16d | Inverter | KES 40k/kW | 🟡 Needs quotes |
| 16e | BOS + install | 25% | 🟡 |
| — | PV derate | 0.80 | ✅ |
| 8 | Panel life | 30 yr | ✅ |

---

## 6. Component Lifetimes

| Component | Life | Replacements | Cost factor | Status |
|-----------|------|-------------|------------|--------|
| PV panels | 30 yr | 0 | — | ✅ |
| LFP batteries | 10 yr | 2 | 60% | ✅ |
| Inverter | 10 yr | 2 | 80% | ✅ |
| Induction burners | 6 yr | 4 | 85% | 🟡 |
| Cookware | 15 yr | 1 | 80% | 🟡 |
| Scheffler | 30 yr | 0 | — | ✅ |

---

## 7. Induction (PV only)

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 25 | Required | Mandatory | ✅ |
| 26 | Burner cost | KES 125k/unit | 🟡 |
| 27 | Cookware set | KES 200k | 🟡 |
| 29 | Efficiency | 90% | ✅ |

---

## 8. Financial

| # | Assumption | Value | Status |
|---|-----------|-------|--------|
| 10 | Horizon | 30 yr | ✅ |
| 11 | Discount rate | 8% | 🟡 |
| 12 | Fuel inflation | 5%/yr | 🟡 |
| — | Baseline TCO | 30yr with inflation | ✅ |

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
| LPG | 2.98 kg/kg | ✅ |
| Biomass | 1.83 kg/kg | ✅ |
| Electric | 0.4 kg/kWh | 🟡 |
| Mixed | 50/50 split | 🟡 |

---

## 11. UX Assumptions (v0.6)

| Assumption | Value | Status |
|-----------|-------|--------|
| LPG cylinder price (Kenya) | KES 3,000 | 🟡 (for auto-estimate) |
| LPG cylinder price (Tanzania) | TZS 50,000 | 🟡 (for auto-estimate) |
| Space range: "classroom" | 75m² | 🟡 |
| Space range: "half pitch" | 200m² | 🟡 |
| Space range: "larger" | 500m² | 🟡 |

---

## Change Log

| Version | Changes |
|---------|---------|
| v0.1 | Initial |
| v0.2 | Battery 6→10yr, inverter, induction, PV components |
| v0.3 | Realistic PV costs, energy priority, bilingual |
| v0.4 | Currency fix, solar fraction fix, dish sizing, savings formula |
| v0.5 | CO2 fix. UX: required/optional, multi-select fuel, formatting, tooltips, progressive summary |
| v0.5.1 | School type→days/week, full results translation, clean restart, dead fields removed |
| v0.6 | Mobile responsive. UX review: plain language labels, collapsible results, "What to do next" CTA, space range picker, LPG auto-estimate, shading default flipped, energy priority condensed, all remaining hardcoded English translated, hooks fixes |

---

*Update when assumptions change.*
