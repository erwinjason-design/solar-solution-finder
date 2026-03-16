# Solar Cooking Solution Finder ☀️🍳

Screening tool for school administrators in Kenya and Tanzania to assess solar cooking solutions — comparing costs, payback, and practical requirements across solar thermal (Scheffler) and solar PV.

## Status: Prototype v0.5.1 (March 2026)

Working prototype with validated economics and full bilingual support. v0.5.1 addresses 12 issues from code review. Key assumptions (MJ/meal, PV costs) need expert validation.

## What it does

- 6-step form (~10 min): location, headcount, meals, menu, site, fuel costs
- Compares 3 solutions with CAPEX, energy cost/meal, payback, 30yr TCO
- All figures in school's local currency (KES or TZS)
- Flags induction requirements and energy priority tradeoffs
- Fully bilingual (English + Swahili) including results
- Export: Copy Summary, Share via WhatsApp

## Solutions

| Solution | Payback | Cookware change? |
|----------|---------|-----------------|
| **Scheffler + LPG** | 5-10 yr | No |
| **PV + Battery** | 10-18 yr | Yes (induction) |
| **PV + LPG** | 12-25 yr | Yes (induction) |

## Files

| File | Description |
|------|-------------|
| `01_project_spec.md` | Scope, approach, status |
| `02_decision_tree.md` | Assessment flow, calculations |
| `03_assumptions.md` | All assumptions with status |
| `solution-finder.jsx` | React prototype (Claude.ai) |
| `solar-cooking-solution-finder.html` | Standalone (any browser) |

## Before school testing

1. 🔴 MJ/meal values from ISC experts
2. 🔴 Real PV vendor quotes (30-80kW off-grid)
3. 🟡 Swahili review by native speaker
