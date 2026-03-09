# Solar Cooking Solution Finder
## Project Specification — v0.1 | March 2026

**Lead:** Jason Erwin  
**Collaborators:** EWB-Sweden (food group, ISC, MEL), solar PV/thermal vendors in Kenya & Tanzania  
**Sprint period:** March 2 – April 1, 2026 (paused April 2–19; work resumes April 20)  
**Target end state:** Working prototype tested with 1–2 schools in Kenya or Tanzania  
**Budget:** Self-funded by Jason Erwin. No EWB funds required for this phase.

---

## 1. The Problem We're Solving

Schools in Kenya and Tanzania spend heavily on LPG and biomass for cooking — one school in Karagwe reports €1,600/month for 400 students. Solar cooking solutions (thermal and PV) exist and are cost-effective but market penetration is below 1%. The main barrier isn't technology — it's the buying process.

Schools and vendors face the same friction points:

- No easy way for school administrators to understand which solar options are viable for their site
- High complexity comparing solar thermal, PV, and hybrid systems on equal footing
- Slow, manual back-and-forth between schools and vendors with no standard information format
- No accessible tools to estimate payback, savings, or cost-per-meal for non-technical users

---

## 2. What We're Building

A mobile-accessible, AI-assisted screening tool — working name: **Solution Finder** — that allows school administrators to input basic information about their school, cooking setup, and site, and receive a clear output ranking the feasibility and economics of available solar cooking solutions.

The tool is not a full engineering assessment. It's a rapid first-pass screen — fast enough that a school administrator can complete it in under 15 minutes on a phone, with no technical background required.

### Primary User
School administrators and bursars in Kenya and Tanzania. Non-technical. Likely using a mid-range Android phone with variable connectivity. Plain language, simple inputs, clear outputs.

### Technologies Covered
- Solar PV + battery storage
- Solar thermal (Scheffler reflectors)
- Hybrid: solar thermal + LPG/biogas backup
- Hybrid: solar PV + battery + backup

---

## 3. Core User Flow

| Step | What happens |
|------|-------------|
| 1 | User enters school location. Tool pulls solar irradiation data automatically from Global Solar Atlas. |
| 2 | User answers questions about cooking capacity: students, meals per day, days per week, menu type. |
| 3 | User describes current fuel use and monthly costs. |
| 4 | User provides available outdoor space and site constraints. |
| 5 | Tool calculates energy demand, screens each technology against constraints, outputs ranked comparison with indicative CAPEX, payback, and NPV. |
| 6 | Tool displays local vendors relevant to the school's region and suitable technologies. |

---

## 4. Key Inputs & Outputs

### Inputs

| Input | Why it matters |
|-------|---------------|
| School location (address / GPS) | Retrieve solar irradiation data; identify nearby vendors |
| Number of students + staff eating | Size the required cooking capacity |
| School type + meal schedule | Boarding vs. day school changes energy demand by up to 3x |
| Menu type (porridge, beans, ugali, etc.) | Determines energy intensity and cooking method compatibility |
| Current fuel and monthly cost | Baseline for savings calculation and payback estimate |
| Available outdoor space (m²) | Key constraint for Scheffler reflector feasibility (min ~50m²) |
| Grid connection (yes/no) | Affects viability of net metering and PV economics |
| Contact details | For vendor follow-up and report delivery |

### Outputs
- Ranked comparison of applicable solar solutions
- **Estimated cost per meal** for each solution vs. current baseline
- Indicative CAPEX range per solution
- Estimated annual savings vs. current fuel costs
- Simple payback period and 30-year total cost of ownership
- CO₂ savings per year (informational)
- List of relevant local vendors with contact info
- Shareable summary report

---

## 5. The Role of AI — Open Question

The role of AI in this tool is not yet defined. Two plausible approaches:

| Option A: AI as conversational intake | Option B: AI as calculation & report engine |
|--------------------------------------|---------------------------------------------|
| Claude guides the user through input collection in natural language. The underlying calculations are deterministic/coded. | Inputs collected via standard form. AI interprets inputs, runs analysis, generates written output. |

A hybrid approach — form-based intake with AI-generated plain-language summaries in the output — is also viable and may be the simplest path to a trustworthy prototype. **Decision needed in week 1 of the sprint.**

---

## 6. Sprint Scope (March 2 – April 1)

- [ ] Finalise assessment methodology with EWB/ISC experts (week 1)
- [ ] Define AI role and choose technical approach (week 1)
- [ ] Build input form and calculation engine covering all 4 solution types (weeks 1–2)
- [ ] Build output/report view with rankings, financials, and vendor lookup (weeks 2–3)
- [ ] Mobile-responsive design — functional on mid-range Android (week 3)
- [ ] Test with at least 1 school, 1 vendor in Kenya or Tanzania (weeks 3–4)
- [ ] Document findings and open questions for post-Japan phase (week 4)

### Out of Scope for This Sprint
- Native mobile app (responsive web is sufficient)
- Direct lender/financier integration
- Multi-language support (English first)
- Production deployment and long-term hosting decisions

---

## 7. Open Questions

| Question | Who decides |
|----------|------------|
| What is the role of AI — conversational, analytical, or both? | Jason + EWB technical partners, week 1 |
| Where will the tool live long-term — EWB site, ISC/Asulma, standalone? | EWB ownership discussion, post-prototype |
| Which solar thermal vendor data and Scheffler specs to use? | ISC / solar thermal partners |
| Assume consistent connectivity or build offline-first? | Jason, based on field feedback |
| What is the vendor directory format and who maintains it? | EWB Kenya/Tanzania teams |

---

*This document is a working spec, not a final design. Update as the sprint progresses.*
