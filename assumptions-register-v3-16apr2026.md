# Solar Cooking Solution Finder — Assumptions Register

## v0.6.1 | April 2026

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
| — | Shading default | "Partial" (conservative) | ✅ |
| — | Space input | Range picker | ✅ |
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

## 9. LPG Pricing (v0.6.1 update)

| Item | Kenya (KES) | Tanzania (TZS) | Source | Status |
|------|-------------|-----------------|--------|--------|
| 13kg cylinder refill | **2,500** | ~50,000 | Asulmas vendor | ✅ Updated |
| 6kg cylinder refill | 1,200 | — | Asulmas vendor | ✅ |
| 13kg initial purchase | 8,000 | — | Asulmas vendor | ✅ |
| 6kg initial purchase | 4,500 | — | Asulmas vendor | ✅ |
| Implied KES/kg (13kg) | **192** | ~3,846 | Derived | ✅ |

Previous values: KES 3,000/cylinder, KES 250/kg. Updated April 2026.

---

## 10. Currency

| Value | Rate | Status |
|-------|------|--------|
| KES/USD | 155 | 🟡 Fixed |
| TZS/USD | 2,650 | 🟡 Fixed |
| KES→TZS | ≈17.1 | Derived |

---

## 11. CO2

| Fuel | Factor | Status |
|------|--------|--------|
| LPG | 2.98 kg/kg | ✅ |
| Biomass | 1.83 kg/kg | ✅ |
| Electric | 0.4 kg/kWh | 🟡 |
| Mixed | 50/50 split | 🟡 |

---

## 12. UX Assumptions

| Assumption | Value | Status |
|-----------|-------|--------|
| LPG auto-estimate (Kenya) | KES 2,500/cylinder | ✅ Updated |
| LPG auto-estimate (Tanzania) | TZS 50,000/cylinder | 🟡 |
| Space: "classroom" | 75m² | 🟡 |
| Space: "half pitch" | 200m² | 🟡 |
| Space: "larger" | 500m² | 🟡 |

---

## 13. Parabolic Reflector — Under Investigation

| Parameter | Known value | Source | Status |
|-----------|-------------|--------|--------|
| Cost | KES 22,000/cooker | Asulmas | ✅ |
| Power | 300-350W (1.5m²) | SCI | ✅ |
| Capacity | 6-10 people | SCI | ✅ |
| Space | ~6m²/cooker | SCI | ✅ |
| Solar fraction | **Unknown** | — | 🔴 |
| Fireless cooker cost | **Unknown** | — | 🔴 |
| Lifetime | **Unknown** | — | 🔴 |
| Cooking time/meal | **Unknown** | — | 🔴 |
| Operator model | **Unknown** | — | 🔴 |
| OPEX | **Unknown** | — | 🔴 |
| Institutional case studies | **Unknown** | — | 🟡 |

Sent to experts April 2026. Not integrated into tool until critical gaps addressed.

---

## Change Log

| Version | Changes |
|---------|---------|
| v0.1 | Initial |
| v0.2 | Battery 6→10yr, inverter, induction, PV components |
| v0.3 | Realistic PV costs, energy priority, bilingual |
| v0.4 | Currency fix, solar fraction fix, dish sizing, savings formula |
| v0.5 | CO2 fix. UX: required/optional, multi-select fuel, formatting, tooltips, progressive summary |
| v0.5.1 | School type→days/week, full results translation, clean restart, dead fields |
| v0.6 | Mobile responsive. Plain language. Collapsible results. CTA. Space range picker. LPG auto-estimate. Shading default flipped. All remaining English translated. Hooks fixes. Pre-compiled HTML. GitHub Pages deploy. |
| v0.6.1 | LPG pricing: KES 3,000→2,500/cylinder, KES 250→192/kg (Asulmas vendor data). Parabolic reflector data gap analysis initiated. |

---

*Update when assumptions change.*
