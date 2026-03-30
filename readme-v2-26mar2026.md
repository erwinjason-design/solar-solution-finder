# Solar Cooking Solution Finder ☀️🍳

Screening tool for school administrators in Kenya and Tanzania to compare solar cooking solutions — apples-to-apples across solar thermal (Scheffler) and solar PV, using the same metrics.

## Status: Prototype v0.6 (March 2026)

Mobile-responsive prototype with full bilingual support, UX improvements from formal review, and collapsible results. Key assumptions (MJ/meal, PV costs) need expert validation.

## What it does

- 6-step form (~10 min): location, headcount, meals, menu, site, fuel costs
- Compares 3 solutions: Scheffler+LPG, PV+Battery, PV+LPG
- Plain language: "Upfront cost" not "CAPEX", "Total cost (30yr)" not "TCO"
- Mobile-first: stacked cards, touch targets, collapsible sections
- All figures in local currency (KES or TZS)
- English + Swahili throughout
- Export: Copy Summary, Share via WhatsApp

## Files

| File | Description |
|------|-------------|
| `project-spec-v2-26mar2026.md` | Scope, approach, status |
| `decision-tree-v2-26mar2026.md` | Assessment flow, calculations |
| `assumptions-register-v2-26mar2026.md` | All assumptions with status |
| `solution-finder-v3-26mar2026.jsx` | React prototype (Claude.ai) |
| `solar-cooking-solution-finder-v3-26mar2026.html` | Standalone (any browser) |

## Before school testing

1. 🔴 MJ/meal values from ISC experts
2. 🔴 Real PV vendor quotes (30-80kW off-grid)
3. 🟡 Swahili review by native speaker
4. 🟡 Regional contact list for next steps
