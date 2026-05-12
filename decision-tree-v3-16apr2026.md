# Solar Cooking Solution Finder

## Decision Tree & Assessment Flow — v0.6.1 | April 2026

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

Auto-set: Boarding → 100%, 7d. Day → 85%, 5d. Mixed → 90%, 6d.

## Input 3 — Meals

| Field | Required |
|-------|----------|
| Meals served | **Required** (multi-select) |
| Days per week | Default from school type |
| School weeks/year | Default 38 |

## Input 4 — Menu

| Field | Required |
|-------|----------|
| Foods cooked | **Required** (min 1) |

Energy multipliers (⚠️ placeholders):

| High | Medium | Low |
|------|--------|-----|
| Ugali 1.30 | Stew 0.90 | Greens 0.50 |
| Beans 1.30 | Rice 0.85 | Porridge 0.40 |
| Makande 1.25 | Chapati 0.70 | Eggs 0.30 |
| | Cassava 0.50 | Tea 0.25 |

## Input 5 — Site & Electrical Needs

| Field | Required | Notes |
|-------|----------|-------|
| Outdoor space | **Required** | Range picker: <classroom / classroom / half pitch / >pitch |
| Shading | **Required** | Default: partial (conservative). "No" → Scheffler knockout. |
| Electrical needs | **Required** | Energy priority analysis |

## Input 6 — Fuel & Costs

| Field | Required | Notes |
|-------|----------|-------|
| Fuel types | **Required** | Multi-select: LPG, Firewood, Charcoal, Electric |
| LPG cylinders/mo | Optional | Auto-estimates monthly cost (KES 2,500/cylinder Kenya) |
| Biomass kg/mo | Optional | |
| Monthly cooking fuel | **Required** | Currency-formatted, cooking only |
| Pot material | **Required** | Aluminium → cookware cost for PV |

---

# PART B — KNOCKOUTS

1. GHI < 4.5 kWh/m²/day → all solar eliminated
2. Space < 50m² OR shading "no" → Scheffler removed. "Partial" → conditional.

---

# PART C — CALCULATIONS

## C0 — Currency
Kenya: ×1.0. Tanzania: ×17.1 (KES→TZS via USD).

## C1 — Energy Demand
```
Diners = (students + staff) × attendance
Daily energy (MJ) = diners × 3.0 × meal_scale × food_multiplier
```

## C2 — Scheffler
```
Dishes = ceil(diners / 50), min 2. Lunch+supper only.
Solar fraction: 55% (L+S), 45% (B+L+S), 65% (L only)
```

## C3 — PV + Battery
```
PV = ceil(daily_kWh / (GHI × 0.80))
Battery = ceil(daily_kWh × 0.6). Solar fraction = 85%
```

## C4 — PV + LPG
PV at 50% demand, battery at 15%, solar fraction 55%.

## C5 — Economics
```
Savings = fuel × solar_fraction - OPEX
Payback = upfront_cost (local) ÷ savings (local)
Baseline TCO = 30yr with 5%/yr fuel inflation
```

## C6 — CO2
- LPG: kg estimated from cylinders or from cost (KES 192/kg Kenya, TZS 2,500/kg Tanzania)
- Biomass: 1.83 kg CO₂/kg. Electric: 0.4 kg CO₂/kWh. Mixed: 50/50.

## C7 — Opportunity Cost
Only when Scheffler eligible: PV budget minus Scheffler cost = alternative PV for electricity.

---

# PART D — OUTPUTS

All fully translated (EN + SW). Mobile-responsive. Pre-compiled JSX for phone compatibility.

1. **Header** — school name, diners, meals/year, GHI
2. **Baseline** — monthly fuel cost, fuel cost/meal, CO₂/year
3. **Recommendation** — template paragraph
4. **"What to do next"** — vendor tap-to-call, "share with your bursar"
5. **Comparison** — stacked cards (mobile) or table (desktop)
6. **Energy priority** — condensed note + expandable details (poor/no electricity only)
7. **Solution details** — collapsible: technical specs, induction notice, cooking tips
8. **Schedule** — collapsible: solar/backup per meal
9. **Caveats** — full EN/SW
10. **Vendors** — Thermofield (expanding)
11. **Export** — Copy Summary, Share via WhatsApp, New Assessment

---

# PART E — ASSUMPTIONS

See `assumptions-register-v3-16apr2026.md` for full register.

Key blockers: MJ/meal multipliers (🔴), PV vendor quotes (🔴), Swahili review (🟡).

---

*v0.6.1 — April 2026. LPG pricing update (KES 2,500/13kg), parabolic under investigation.*
