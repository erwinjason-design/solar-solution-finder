# Solar Cooking Solution Finder ☀️🍳

Screening tool for school administrators in Kenya and Tanzania to compare solar cooking solutions — apples-to-apples across solar thermal (Scheffler) and solar PV, using the same metrics.

## Live tool

**https://erwinjason-design.github.io/solar-solution-finder/**

## Status: Prototype v0.6.1 (April 2026)

Mobile-responsive, bilingual (EN/SW), deployed to GitHub Pages. LPG pricing updated from vendor data. Parabolic reflector option under investigation. Key assumptions (MJ/meal, PV costs) need expert validation.

## What it does

- 6-step form (~10 min): location, headcount, meals, menu, site, fuel costs
- Compares 3 solutions: Scheffler+LPG, PV+Battery, PV+LPG
- Plain language: "Upfront cost" not "CAPEX", "Total cost (30yr)" not "TCO"
- Mobile-first: stacked cards, touch targets, collapsible sections
- All figures in local currency (KES or TZS)
- English + Swahili throughout
- Export: Copy Summary, Share via WhatsApp

## Solutions

| Solution | Payback | Cookware change? |
|----------|---------|-----------------|
| **Scheffler + LPG** | 5-10 yr | No |
| **PV + Battery** | 10-18 yr | Yes (induction) |
| **PV + LPG** | 12-25 yr | Yes (induction) |
| **Parabolic + fireless** | TBD | TBD (under investigation) |

## Files

| File | Description |
|------|-------------|
| `project-spec-v3-16apr2026.md` | Scope, approach, status |
| `decision-tree-v3-16apr2026.md` | Assessment flow, calculations |
| `assumptions-register-v3-16apr2026.md` | All assumptions with status |
| `solution-finder-v4-16apr2026.jsx` | React prototype (Claude.ai) |
| `index.html` | Deployed standalone (GitHub Pages) |

## Before school testing

1. 🔴 MJ/meal values from ISC experts
2. 🔴 Real PV vendor quotes (30-80kW off-grid)
3. 🟡 Swahili review by native speaker
4. 🟡 Regional contact list for next steps
5. 🟡 Parabolic reflector data from experts
