# Solar Cooking Solution Finder ☀️🍳

A screening tool that helps school administrators in Kenya and Tanzania assess which solar cooking solutions could work for their school — comparing costs, payback, and practical requirements across solar thermal (Scheffler) and solar PV options.

## Status: Prototype v0.4 (March 2026)

Working prototype with validated economic model. Several key assumptions (particularly MJ/meal by food type and PV system costs) are placeholders awaiting validation with technical partners. All numbers should be treated as directional, not definitive.

**v0.4 fixes critical bugs:** currency handling for Tanzania schools, Scheffler solar fraction based on empirical data, correct dish sizing and savings formula. Payback periods now align with expected ranges (5-10yr Scheffler, 10-15yr PV).

## What it does

- Collects school cooking needs, fuel costs, and site info in 6 steps (~10 minutes)
- Applies knockout filters (solar resource, available space)
- Calculates energy demand based on student count, meal schedule, and menu
- Converts all costs to school's local currency (KES or TZS)
- Compares three solar cooking solutions with CAPEX, cost/meal, payback, 30-year TCO
- Flags induction equipment requirements for PV solutions
- Provides energy priority analysis (should PV capacity go to cooking or lighting/computers?)
- Generates WhatsApp-shareable text summary
- Available in English and Swahili

## Solutions compared

| Solution | How it works | Payback range | Cookware change? |
|----------|-------------|---------------|-----------------|
| **Scheffler + LPG** | Solar thermal baseload, LPG backup | 5-10 years | No |
| **PV + Battery** | PV + LFP storage + induction | 10-18 years | Yes (induction) |
| **PV + LPG** | PV daytime + LPG backup | 12-25 years | Yes (induction) |

Payback depends heavily on current fuel spend and school size.

## Key documents

| Document | Description |
|----------|-------------|
| `01_project_spec.md` | Project scope, approach, sprint status |
| `02_decision_tree.md` | Assessment flow, calculations, assumptions log |
| `03_assumptions.md` | All assumptions with values, sources, validation status |
| `solution-finder.jsx` | React prototype |

## Data sources

- **Scheffler:** Thermofield Industrial (Nairobi), March 2024 vendor proposal
- **PV costs:** IRENA 2024 (Africa avg $1,093/kW) + Kenyan installer benchmarks
- **Battery:** Kenyan installer data (KES 30-45k/kWh), BloombergNEF 2025
- **Energy demand:** Kituyi (2000), Ngeywo (2008) — firewood per student
- **CO₂:** IPCC emission factors
- **Menu reference:** Mavuno Modal Girls Secondary School (Tanzania)

## What's needed before school testing

1. 🔴 **MJ/meal values** validated by ISC/solar cooking experts
2. 🔴 **Real PV vendor quotes** for 30-80kW off-grid in Kenya/Tanzania
3. 🟡 **Swahili translation review** by native speaker
4. 🟡 **Induction equipment pricing** from East African suppliers

## Contact

Jason Erwin — project lead
