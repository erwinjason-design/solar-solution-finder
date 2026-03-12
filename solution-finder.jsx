import { useState, useEffect, useCallback, useMemo } from "react";

// ============================================================
// SOLAR COOKING SOLUTION FINDER — Prototype v0.1
// For schools in Kenya & Tanzania
// Decision tree: 02_decision_tree.md (authoritative)
// Scheffler data: Thermofield Industrial (March 2024)
// ============================================================

// ---------- CONSTANTS & ASSUMPTIONS ----------
// All assumptions logged per Master Assumptions Log

const ASSUMPTIONS = {
  // Assumption #2: GHI knockout threshold
  GHI_KNOCKOUT: 4.5, // kWh/m²/day — TBC with ISC
  // Assumption #3: Min space for Scheffler
  SCHEFFLER_MIN_SPACE_M2: 50, // confirmed by ISC
  // Assumption #15: School year
  DEFAULT_SCHOOL_WEEKS: 38,
  // Assumption #17: Attendance defaults
  ATTENDANCE_BOARDING: 1.0,
  ATTENDANCE_DAY: 0.85,
  // Assumption #5: Solar PV system efficiency
  PV_SYSTEM_EFFICIENCY: 0.13, // 12-14% overall — TBC
  // Assumption #6: Scheffler optical efficiency
  SCHEFFLER_EFFICIENCY: 0.55, // 50-60% — TBC
  // Assumption #7: LFP Battery lifespan (UPDATED v0.2)
  // LFP rated 6000-10000 cycles; real-world daily cycling in tropical climate: 10 years conservative
  BATTERY_LIFESPAN_YRS: 10,
  // Assumption #8: PV panel lifespan
  PV_LIFESPAN_YRS: 30, // updated from 25 — modern panels last 30yrs with ~0.5%/yr degradation
  // Assumption #9: Scheffler lifespan
  SCHEFFLER_LIFESPAN_YRS: 30, // confirmed
  // Assumption #10: Assessment horizon
  HORIZON_YRS: 30,
  // Assumption #11: NPV discount rate
  DISCOUNT_RATE: 0.08, // 8% real — TBC
  // Assumption #12: Fuel price inflation
  FUEL_INFLATION: 0.05, // 5%/yr real — TBC
  // Assumption #13: LPG CO2 factor
  LPG_CO2_KG_PER_KG: 2.98, // IPCC confirmed
  // Assumption #14: Biomass CO2 factor
  BIOMASS_CO2_KG_PER_KG: 1.83, // IPCC confirmed
  // Assumption #19: Solar thermal window
  SOLAR_WINDOW_START: 9,
  SOLAR_WINDOW_END: 16,
  // From Thermofield: 16m² dish specs
  SCHEFFLER_DISH_AREA_M2: 16,
  SCHEFFLER_DISH_OUTPUT_MJ_DAY: 130, // 120-140 avg
  SCHEFFLER_DISH_COST_KES: 700000, // ~600k dish + 100k accessories
  SCHEFFLER_INSTALL_PER_DISH_KES: 70000, // 560k / 8
  // Thermofield: 4 dishes per 200 students (lunch + supper)
  STUDENTS_PER_DISH_LUNCH_SUPPER: 50,
  // LPG equivalence: 1 dish = 18 x 50kg cylinders/yr
  LPG_DISPLACED_KG_PER_DISH_YR: 900, // 18 * 50
  // Solar productive days per year (tropical)
  SOLAR_DAYS_PER_YEAR: 235, // midpoint of 200-270
  // PV system costs (East Africa installed — v0.3 updated from IRENA + Kenyan installer data)
  // IRENA 2024: Africa avg solar TIC $1,093/kW; off-grid institutional ~20% premium
  PV_COST_PER_KW_KES: 200000, // panels + mounting, installed (~$1,290/kW)
  // Kenyan installer benchmark: KES 30,000-45,000/kWh installed LFP (Plasma Solar 2025)
  BATTERY_COST_PER_KWH_KES: 40000, // LFP, East Africa installed (~$258/kWh)
  // Assumption #21: Inverter lifespan & cost (v0.3 updated)
  INVERTER_LIFESPAN_YRS: 10, // off-grid heavy daily use, tropical climate
  INVERTER_COST_PER_KW_KES: 40000, // off-grid inverter + installation + wiring + protection (~$258/kW)
  // Assumption #22: Battery replacement cost factor (NEW v0.2)
  BATTERY_REPLACEMENT_FACTOR: 0.60, // 60% of original — prices falling
  // Assumption #23: Inverter replacement cost factor (NEW v0.2)
  INVERTER_REPLACEMENT_FACTOR: 0.80, // 80% of original
  // Assumption #25-29: Induction equipment (NEW v0.2)
  // PV solutions REQUIRE induction cooking — mandatory, not optional
  INDUCTION_REQUIRED_FOR_PV: true,
  INDUCTION_BURNER_COST_KES: 125000, // per 5-10kW commercial unit
  INDUCTION_BURNERS_PER_200_STUDENTS: 2, // 2 burners per 200 students
  INDUCTION_BURNER_LIFESPAN_YRS: 6, // heavy institutional use
  INDUCTION_COOKWARE_SET_COST_KES: 200000, // stainless steel 50-100L pots, full set
  INDUCTION_COOKWARE_LIFESPAN_YRS: 15, // stainless steel is durable
  INDUCTION_EFFICIENCY: 0.90, // 85-95%, use 90%
  RESISTIVE_EFFICIENCY: 0.60, // for comparison — why induction is mandatory
  // Energy content
  LPG_CALORIFIC_MJ_PER_KG: 45,
  LPG_BURNER_EFFICIENCY: 0.65,
  FIREWOOD_CALORIFIC_MJ_PER_KG: 19,
  FIREWOOD_STOVE_EFFICIENCY: 0.35,
  // From literature: 0.35-0.55 kg firewood/student/day
  // => useful energy ~2.4-3.8 MJ/student/day for lunch+supper
  // We use 3.0 MJ as midpoint
  USEFUL_ENERGY_PER_STUDENT_PER_DAY_MJ: 3.0,
  // Breakfast is ~20% of daily energy (Thermofield)
  BREAKFAST_FRACTION: 0.20,
  // Exchange rates (approximate, for display)
  KES_PER_USD: 155,
  TZS_PER_USD: 2650,
};

// Energy intensity multipliers by food type (relative to baseline)
const FOOD_ENERGY = {
  ugali: { label: "Ugali (stiff maize porridge)", intensity: 1.3, category: "high" },
  beans: { label: "Beans / pulses / lentils", intensity: 1.3, category: "high" },
  makande: { label: "Makande (maize + beans)", intensity: 1.25, category: "high" },
  rice: { label: "Rice", intensity: 0.85, category: "medium" },
  greens: { label: "Greens / vegetables", intensity: 0.5, category: "low" },
  stew: { label: "Mixed stew / meat", intensity: 0.9, category: "medium" },
  porridge: { label: "Porridge", intensity: 0.4, category: "low" },
  tea: { label: "Tea", intensity: 0.25, category: "low" },
  bread: { label: "Bread / chapati", intensity: 0.7, category: "medium" },
  eggs: { label: "Eggs", intensity: 0.3, category: "low" },
  cassava: { label: "Cassava", intensity: 0.5, category: "medium" },
  potatoes: { label: "Potatoes", intensity: 0.5, category: "medium" },
};

// GHI estimates by region (fallback when no GPS)
const REGION_GHI = {
  kenya: {
    "Nairobi": 5.5, "Mombasa": 5.8, "Kisumu": 5.3, "Nakuru": 5.4,
    "Eldoret": 5.1, "Kajiado": 5.6, "Machakos": 5.5, "Garissa": 6.2,
    "Turkana": 6.5, "Nyeri": 5.0, "Meru": 5.2, "Kericho": 4.8,
    "Other": 5.3,
  },
  tanzania: {
    "Dar es Salaam": 5.4, "Dodoma": 5.8, "Arusha": 5.5, "Mwanza": 5.6,
    "Karagwe": 5.2, "Moshi": 5.3, "Tanga": 5.5, "Iringa": 5.7,
    "Tabora": 5.9, "Mbeya": 5.4, "Bukoba": 5.1, "Songea": 5.3,
    "Other": 5.4,
  },
};

const CURRENCY = {
  kenya: { code: "KES", symbol: "KES", rate: ASSUMPTIONS.KES_PER_USD, fromKES: 1 },
  tanzania: { code: "TZS", symbol: "TZS", rate: ASSUMPTIONS.TZS_PER_USD, fromKES: ASSUMPTIONS.TZS_PER_USD / ASSUMPTIONS.KES_PER_USD },
};

// Convert KES-denominated costs to local currency
function kesToLocal(kesAmount, curr) {
  return kesAmount * curr.fromKES;
}

const MEAL_TIMES = {
  breakfast: { label: "Breakfast", hour: 7, solarCompatible: false },
  morningTea: { label: "Morning tea", hour: 10, solarCompatible: true },
  lunch: { label: "Lunch", hour: 12.5, solarCompatible: true },
  afternoonTea: { label: "Afternoon tea", hour: 15, solarCompatible: true },
  dinner: { label: "Dinner", hour: 18.5, solarCompatible: false },
};

// ---------- CALCULATION ENGINE ----------

function calculateResults(inputs) {
  const A = ASSUMPTIONS;
  const curr = CURRENCY[inputs.country];

  // Step 1: Total daily diners
  const staff = inputs.staffCount || Math.round(inputs.studentCount * 0.05);
  const attendance = inputs.attendanceRate / 100;
  const totalDiners = Math.round((inputs.studentCount + staff) * attendance);

  // Step 2: Daily energy demand
  const mealCount = inputs.meals.length;
  const breakfastIncluded = inputs.meals.includes("breakfast");
  const mainMeals = inputs.meals.filter(m => m !== "breakfast" && m !== "morningTea" && m !== "afternoonTea");
  const lightMeals = inputs.meals.filter(m => m === "breakfast" || m === "morningTea" || m === "afternoonTea");

  // Weighted energy intensity from menu
  let energyMultiplier = 1.0;
  if (inputs.foods && inputs.foods.length > 0) {
    const total = inputs.foods.reduce((sum, f) => sum + (FOOD_ENERGY[f]?.intensity || 1.0), 0);
    energyMultiplier = total / inputs.foods.length;
  }

  // Base energy per student per day (lunch + supper baseline)
  const baseEnergyPerStudent = A.USEFUL_ENERGY_PER_STUDENT_PER_DAY_MJ;

  // Scale by actual meals served relative to lunch+supper baseline
  let mealScaleFactor = 0;
  mainMeals.forEach(() => { mealScaleFactor += 0.5; }); // each main meal = 50% of baseline
  lightMeals.forEach(() => { mealScaleFactor += 0.1; }); // light meals ~10% each
  if (mealScaleFactor === 0) mealScaleFactor = 1; // fallback

  const dailyEnergyPerStudent = baseEnergyPerStudent * mealScaleFactor * energyMultiplier;
  const dailyEnergyTotal = totalDiners * dailyEnergyPerStudent;

  // Step 3: Annual figures
  const daysPerWeek = inputs.daysPerWeek;
  const schoolWeeks = inputs.schoolWeeks || A.DEFAULT_SCHOOL_WEEKS;
  const schoolDaysPerYear = daysPerWeek * schoolWeeks;
  const annualMeals = totalDiners * mealCount * schoolDaysPerYear;
  const annualEnergy = dailyEnergyTotal * schoolDaysPerYear;

  // Step 4: GHI and solar resource
  const ghi = inputs.ghi;
  const ghiKnockout = ghi < A.GHI_KNOCKOUT;

  // Step 5: Space knockout for Scheffler
  const schefflerKnockout = inputs.availableSpace < A.SCHEFFLER_MIN_SPACE_M2;
  const schefflerConditional = inputs.shading === "partial";

  // Step 6: Current baseline costs
  const monthlyFuelCost = inputs.monthlyFuelCost;
  const annualFuelCost = monthlyFuelCost * (schoolDaysPerYear / (daysPerWeek || 5)) * (daysPerWeek / 7) * 12;
  // Simpler: assume fuel spend is during school year
  const annualFuelCostSimple = monthlyFuelCost * (schoolWeeks * 7 / 30);
  const currentCostPerMeal = annualMeals > 0 ? annualFuelCostSimple / annualMeals : 0;

  // Step 7: Baseline CO2
  let annualCO2Baseline = 0;
  if (inputs.fuelType === "lpg") {
    const monthlyKg = inputs.lpgCylinders ? inputs.lpgCylinders * 13 : (monthlyFuelCost / (inputs.country === "kenya" ? 250 : 2500) * 1);
    annualCO2Baseline = monthlyKg * (schoolWeeks * 7 / 30) * A.LPG_CO2_KG_PER_KG;
  } else if (inputs.fuelType === "firewood" || inputs.fuelType === "charcoal") {
    const monthlyKg = inputs.biomassKg || 0;
    annualCO2Baseline = monthlyKg * (schoolWeeks * 7 / 30) * A.BIOMASS_CO2_KG_PER_KG;
  }

  // ---------- SOLUTION CALCULATIONS ----------

  const solutions = [];

  // --- SOLUTION 1: Scheffler + LPG Hybrid ---
  if (!schefflerKnockout && !ghiKnockout) {
    // Dish sizing: Thermofield recommends 4 dishes per 200 students for lunch + supper
    // That's 1 dish per 50 students. Breakfast energy comes from LPG backup, NOT additional dishes.
    // We size for lunch+supper only (the solar-cooked meals), regardless of whether breakfast is served.
    const dishesNeeded = Math.max(2, Math.ceil(totalDiners / A.STUDENTS_PER_DISH_LUNCH_SUPPER));
    const spaceRequired = dishesNeeded * A.SCHEFFLER_DISH_AREA_M2 * 2.5; // spacing factor

    // Solar fraction: based on Thermofield's empirical data, NOT meal-window matching
    // Thermofield claims 55-60% for lunch+supper using pre-cooking and sequential strategies
    // Breakfast adds ~20% to total energy demand but can't be solar-cooked
    // So: if breakfast included, solar fraction drops by ~15-20 percentage points
    const hasBreakfast = inputs.meals.includes("breakfast");
    const hasDinner = inputs.meals.includes("dinner");
    const hasLunch = inputs.meals.includes("lunch");

    let solarFraction;
    if (hasLunch && hasDinner && !hasBreakfast) {
      solarFraction = 0.55; // Thermofield's core use case: lunch + supper
    } else if (hasLunch && hasDinner && hasBreakfast) {
      solarFraction = 0.45; // 3 meals: breakfast reduces overall solar share
    } else if (hasLunch && !hasDinner) {
      solarFraction = 0.65; // Lunch only: most of the cooking is solar
    } else {
      solarFraction = 0.35; // Fallback for unusual meal combinations
    }

    // CAPEX in KES (Thermofield is a Kenyan vendor)
    const dishCapexKES = dishesNeeded * (A.SCHEFFLER_DISH_COST_KES + A.SCHEFFLER_INSTALL_PER_DISH_KES);
    const kitchenModsKES = 200000;
    const totalCapexKES = dishCapexKES + kitchenModsKES;

    // Convert to local currency for all economic calculations
    const totalCapex = kesToLocal(totalCapexKES, curr);

    // Annual OPEX in local currency
    const annualOpex = kesToLocal(dishesNeeded * 15000 + 60000, curr);

    // Annual backup LPG cost (already in local currency)
    const annualBackupFuel = annualFuelCostSimple * (1 - solarFraction);

    // Annual total cost
    const annualizedCapex = totalCapex / A.SCHEFFLER_LIFESPAN_YRS;
    const annualTotalCost = annualizedCapex + annualOpex + annualBackupFuel;
    const costPerMeal = annualMeals > 0 ? annualTotalCost / annualMeals : 0;

    // Savings
    const annualSavings = annualFuelCostSimple * solarFraction - annualOpex;
    const paybackYears = annualSavings > 0 ? totalCapex / annualSavings : 999;

    // 30-year TCO with fuel inflation
    let tco30 = totalCapex;
    for (let y = 1; y <= 30; y++) {
      tco30 += (annualBackupFuel * Math.pow(1 + A.FUEL_INFLATION, y)) + annualOpex;
    }

    // CO2 savings
    const co2Saved = annualCO2Baseline * solarFraction;

    solutions.push({
      id: "scheffler_lpg",
      name: "Scheffler + LPG Hybrid",
      description: "Solar thermal dishes provide baseload cooking energy. LPG backup handles breakfast, dinner, and cloudy days.",
      eligible: true,
      conditional: schefflerConditional,
      capex: totalCapex,
      costPerMeal,
      paybackYears: Math.round(paybackYears * 10) / 10,
      tco30: Math.round(tco30),
      annualSavings: Math.round(annualSavings),
      co2SavedPerYear: Math.round(co2Saved),
      solarFraction: Math.round(solarFraction * 100),
      details: {
        dishes: dishesNeeded,
        spaceRequired: Math.round(spaceRequired),
        annualBackupFuel: Math.round(annualBackupFuel),
        annualOpex: Math.round(annualOpex),
      },
    });
  }

  // --- SOLUTION 2: PV + Battery ---
  if (!ghiKnockout) {
    // Size PV system to meet daily energy demand
    const dailyEnergyKWh = dailyEnergyTotal / 3.6;
    const pvSizeKW = dailyEnergyKWh / (ghi * A.PV_SYSTEM_EFFICIENCY / 0.13 * 0.85); // derate for losses
    const pvSizeRounded = Math.ceil(pvSizeKW);

    // Battery: enough for ~60% of daily use (evening + morning cooking)
    const batteryKWh = Math.ceil(dailyEnergyKWh * 0.6);

    // Inverter sizing — match PV array with some headroom
    const inverterKW = Math.ceil(pvSizeRounded * 1.1);

    // Induction equipment CAPEX (mandatory for PV solutions)
    const inductionBurners = Math.max(2, Math.ceil(totalDiners / 200) * A.INDUCTION_BURNERS_PER_200_STUDENTS);
    const inductionBurnerCapex = inductionBurners * A.INDUCTION_BURNER_COST_KES;
    const needNewCookware = inputs.potMaterial !== "stainless_steel" && inputs.potMaterial !== "cast_iron";
    const cookwareCapex = needNewCookware ? A.INDUCTION_COOKWARE_SET_COST_KES * Math.ceil(totalDiners / 400) : 0;

    // CAPEX — now with separated components (all in KES, then convert)
    const pvPanelCapex = pvSizeRounded * A.PV_COST_PER_KW_KES;
    const batteryCapex = batteryKWh * A.BATTERY_COST_PER_KWH_KES;
    const inverterCapex = inverterKW * A.INVERTER_COST_PER_KW_KES;
    const installBOS = (pvPanelCapex + batteryCapex + inverterCapex) * 0.25; // BOS: mounting, wiring, transport, commissioning, site prep
    const totalInductionCapexKES = inductionBurnerCapex + cookwareCapex;
    const totalCapexKES = pvPanelCapex + batteryCapex + inverterCapex + installBOS + totalInductionCapexKES;

    // Convert to local currency
    const totalCapex = kesToLocal(totalCapexKES, curr);
    const totalInductionCapex = kesToLocal(totalInductionCapexKES, curr);

    // Replacement schedule over 30 years:
    // Battery: replace at yr 10, 20 (2 replacements)
    // Inverter: replace at yr 10, 20 (2 replacements)
    // Induction burners: replace at yr 6, 12, 18, 24 (4 replacements)
    // Cookware: replace at yr 15 (1 replacement)
    const batteryReplaceCost = kesToLocal(batteryCapex * A.BATTERY_REPLACEMENT_FACTOR, curr);
    const inverterReplaceCost = kesToLocal(inverterCapex * A.INVERTER_REPLACEMENT_FACTOR, curr);
    const inductionBurnerReplaceCost = kesToLocal(inductionBurnerCapex * 0.85, curr);

    // Solar fraction — high because battery enables anytime cooking
    const solarFraction = 0.85;

    // Annual OPEX (in local currency)
    const annualOpex = kesToLocal(pvSizeRounded * 5000 + 30000, curr);

    // Annual backup (small LPG for reliability)
    const annualBackupFuel = annualFuelCostSimple * (1 - solarFraction);

    // 30-year TCO with itemized replacements
    let tco30 = totalCapex;
    for (let y = 1; y <= 30; y++) {
      // Battery + inverter replacement at yr 10, 20
      if (y % A.BATTERY_LIFESPAN_YRS === 0 && y < 30) {
        tco30 += batteryReplaceCost + inverterReplaceCost;
      }
      // Induction burner replacement at yr 6, 12, 18, 24
      if (y % A.INDUCTION_BURNER_LIFESPAN_YRS === 0 && y < 30) {
        tco30 += inductionBurnerReplaceCost;
      }
      // Cookware replacement at yr 15
      if (y === 15 && needNewCookware) {
        tco30 += kesToLocal(cookwareCapex * 0.8, curr);
      }
      tco30 += (annualBackupFuel * Math.pow(1 + A.FUEL_INFLATION, y)) + annualOpex;
    }

    // Total replacement costs for annualization (already in local currency)
    const totalReplacements = (batteryReplaceCost + inverterReplaceCost) * 2
      + inductionBurnerReplaceCost * 4
      + (needNewCookware ? kesToLocal(cookwareCapex * 0.8, curr) : 0);
    const annualizedCapex = (totalCapex + totalReplacements) / A.PV_LIFESPAN_YRS;
    const annualTotalCost = annualizedCapex + annualOpex + annualBackupFuel;
    const costPerMeal = annualMeals > 0 ? annualTotalCost / annualMeals : 0;

    const annualSavings = annualFuelCostSimple * solarFraction - annualOpex;
    const paybackYears = annualSavings > 0 ? totalCapex / annualSavings : 999;

    const co2Saved = annualCO2Baseline * solarFraction;

    solutions.push({
      id: "pv_battery",
      name: "Solar PV + Battery Storage",
      description: "Solar panels with battery storage power induction cookers. Can cook at any time of day. Highest flexibility but highest upfront cost. Requires induction-compatible cooking equipment.",
      eligible: true,
      conditional: false,
      requiresInduction: true,
      needNewCookware,
      capex: Math.round(totalCapex),
      costPerMeal,
      paybackYears: Math.round(paybackYears * 10) / 10,
      tco30: Math.round(tco30),
      annualSavings: Math.round(annualSavings),
      co2SavedPerYear: Math.round(co2Saved),
      solarFraction: Math.round(solarFraction * 100),
      details: {
        pvSizeKW: pvSizeRounded,
        batteryKWh,
        inverterKW,
        inductionBurners,
        inductionCapex: Math.round(totalInductionCapex),
        annualBackupFuel: Math.round(annualBackupFuel),
        annualOpex: Math.round(annualOpex),
      },
    });
  }

  // --- SOLUTION 3: PV + LPG Hybrid ---
  if (!ghiKnockout) {
    const dailyEnergyKWh = dailyEnergyTotal / 3.6;
    // Smaller PV system — no big battery, just daytime cooking
    const pvSizeKW = dailyEnergyKWh * 0.5 / (ghi * A.PV_SYSTEM_EFFICIENCY / 0.13 * 0.85);
    const pvSizeRounded = Math.ceil(pvSizeKW);

    // Small battery buffer only (2-3 hours)
    const batteryKWh = Math.ceil(dailyEnergyKWh * 0.15);

    // Inverter — smaller than full PV+battery
    const inverterKW = Math.ceil(pvSizeRounded * 1.1);

    // Induction equipment (same requirement as PV+battery)
    const inductionBurners = Math.max(2, Math.ceil(totalDiners / 200) * A.INDUCTION_BURNERS_PER_200_STUDENTS);
    const inductionBurnerCapex = inductionBurners * A.INDUCTION_BURNER_COST_KES;
    const needNewCookware = inputs.potMaterial !== "stainless_steel" && inputs.potMaterial !== "cast_iron";
    const cookwareCapex = needNewCookware ? A.INDUCTION_COOKWARE_SET_COST_KES * Math.ceil(totalDiners / 400) : 0;
    const totalInductionCapexKES = inductionBurnerCapex + cookwareCapex;

    const pvPanelCapex = pvSizeRounded * A.PV_COST_PER_KW_KES;
    const batteryCapex = batteryKWh * A.BATTERY_COST_PER_KWH_KES;
    const inverterCapex = inverterKW * A.INVERTER_COST_PER_KW_KES;
    const installBOS = (pvPanelCapex + batteryCapex + inverterCapex) * 0.25;
    const totalCapexKES = pvPanelCapex + batteryCapex + inverterCapex + installBOS + totalInductionCapexKES;

    // Convert to local currency
    const totalCapex = kesToLocal(totalCapexKES, curr);
    const totalInductionCapex = kesToLocal(totalInductionCapexKES, curr);

    const batteryReplaceCost = kesToLocal(batteryCapex * A.BATTERY_REPLACEMENT_FACTOR, curr);
    const inverterReplaceCost = kesToLocal(inverterCapex * A.INVERTER_REPLACEMENT_FACTOR, curr);
    const inductionBurnerReplaceCost = kesToLocal(inductionBurnerCapex * 0.85, curr);

    // Solar fraction: PV+LPG limited to daytime cooking only (no large battery for evening)
    const solarMeals = inputs.meals.filter(m => MEAL_TIMES[m]?.solarCompatible);
    const solarFraction = Math.min(0.55, (solarMeals.length / Math.max(1, mealCount)) * 0.60);

    const annualOpex = kesToLocal(pvSizeRounded * 5000 + 20000, curr);
    const annualBackupFuel = annualFuelCostSimple * (1 - solarFraction);

    let tco30 = totalCapex;
    for (let y = 1; y <= 30; y++) {
      if (y % A.BATTERY_LIFESPAN_YRS === 0 && y < 30) {
        tco30 += batteryReplaceCost + inverterReplaceCost;
      }
      if (y % A.INDUCTION_BURNER_LIFESPAN_YRS === 0 && y < 30) {
        tco30 += inductionBurnerReplaceCost;
      }
      if (y === 15 && needNewCookware) {
        tco30 += kesToLocal(cookwareCapex * 0.8, curr);
      }
      tco30 += (annualBackupFuel * Math.pow(1 + A.FUEL_INFLATION, y)) + annualOpex;
    }

    const totalReplacements = (batteryReplaceCost + inverterReplaceCost) * 2
      + inductionBurnerReplaceCost * 4
      + (needNewCookware ? kesToLocal(cookwareCapex * 0.8, curr) : 0);
    const annualizedCapex = (totalCapex + totalReplacements) / A.PV_LIFESPAN_YRS;
    const annualTotalCost = annualizedCapex + annualOpex + annualBackupFuel;
    const costPerMeal = annualMeals > 0 ? annualTotalCost / annualMeals : 0;

    const annualSavings = annualFuelCostSimple * solarFraction - annualOpex;
    const paybackYears = annualSavings > 0 ? totalCapex / annualSavings : 999;

    const co2Saved = annualCO2Baseline * solarFraction;

    solutions.push({
      id: "pv_lpg",
      name: "Solar PV + LPG Hybrid",
      description: "Solar panels power induction cookers during the day. LPG handles mornings, evenings, and cloudy weather. Lower upfront cost than full battery. Requires induction-compatible cooking equipment.",
      eligible: true,
      conditional: false,
      requiresInduction: true,
      needNewCookware,
      capex: Math.round(totalCapex),
      costPerMeal,
      paybackYears: Math.round(paybackYears * 10) / 10,
      tco30: Math.round(tco30),
      annualSavings: Math.round(annualSavings),
      co2SavedPerYear: Math.round(co2Saved),
      solarFraction: Math.round(solarFraction * 100),
      details: {
        pvSizeKW: pvSizeRounded,
        batteryKWh,
        inverterKW,
        inductionBurners,
        inductionCapex: Math.round(totalInductionCapex),
        annualBackupFuel: Math.round(annualBackupFuel),
        annualOpex: Math.round(annualOpex),
      },
    });
  }

  // Sort by cost per meal
  solutions.sort((a, b) => a.costPerMeal - b.costPerMeal);

  // --- Compute opportunity cost for PV solutions ---
  // What could the same capital buy if split: Scheffler for cooking + smaller PV for electrical needs?
  const schefflerSolution = solutions.find(s => s.id === "scheffler_lpg");
  const schefflerCapex = schefflerSolution ? schefflerSolution.capex : 0;
  // Cost of a general-purpose PV system for lighting/computers/water (smaller, no cooking load)
  const generalPVCostPerKW = kesToLocal(A.PV_COST_PER_KW_KES * 1.25, curr); // installed with small battery buffer

  solutions.forEach(s => {
    if (s.id === "pv_battery" || s.id === "pv_lpg") {
      const remainingBudget = s.capex - schefflerCapex;
      const altPVSizeKW = remainingBudget > 0 ? Math.floor(remainingBudget / generalPVCostPerKW) : 0;
      const altPVCost = altPVSizeKW * generalPVCostPerKW;
      const leftover = s.capex - schefflerCapex - altPVCost;
      s.opportunityCost = {
        schefflerCapex: schefflerCapex,
        altPVSizeKW: altPVSizeKW,
        altPVCost: Math.round(altPVCost),
        leftover: Math.round(Math.max(0, leftover)),
      };
    }
  });

  return {
    totalDiners,
    dailyEnergyTotal: Math.round(dailyEnergyTotal),
    annualMeals,
    annualEnergy: Math.round(annualEnergy),
    currentCostPerMeal,
    annualFuelCost: Math.round(annualFuelCostSimple),
    annualCO2Baseline: Math.round(annualCO2Baseline),
    ghiKnockout,
    solutions,
    ghi,
    currency: curr,
    electricalNeeds: inputs.electricalNeeds,
  };
}

function generateRecommendation(results, inputs) {
  if (results.ghiKnockout) {
    return "Based on your location, solar energy levels at your site are unlikely to support a cost-effective solar cooking solution. We recommend speaking with a local energy advisor about LPG efficiency improvements or biogas options.";
  }
  if (results.solutions.length === 0) {
    return "No solar solutions met all requirements for your school. This may be due to space constraints. Contact the vendors listed below for a professional site assessment.";
  }

  const best = results.solutions[0];
  const curr = results.currency;
  const monthlyFuel = inputs.monthlyFuelCost;
  const monthlySavings = Math.round(best.annualSavings / (inputs.schoolWeeks * 7 / 30));
  const hasUnmetElecNeeds = inputs.electricalNeeds === "poor" || inputs.electricalNeeds === "none";

  let text = `Based on your school's location, cooking needs, and available space, **${best.name}** looks like the strongest option. `;
  text += `Your school currently spends about ${curr.symbol} ${monthlyFuel.toLocaleString()} per month on fuel. `;

  if (best.annualSavings > 0) {
    text += `This system could save you an estimated ${curr.symbol} ${monthlySavings.toLocaleString()} per month during the school year. `;
    text += `At current prices, you would recover the investment cost in about ${best.paybackYears} years, `;
  }

  if (best.id === "scheffler_lpg") {
    text += `and the Scheffler system lasts 30+ years with regular maintenance. `;
    text += `You would need ${best.details.dishes} parabolic dishes, requiring about ${best.details.spaceRequired}m² of unshaded outdoor space near your kitchen.`;
    if (hasUnmetElecNeeds) {
      text += ` Because your school has significant unmet electrical needs, solar thermal for cooking is especially advantageous — it frees up your budget and any future PV capacity for lighting, computers, and water pumping.`;
    }
  } else if (best.id === "pv_battery") {
    text += `and the solar panels last 30+ years (batteries and inverter need replacement around year 10). `;
    text += `You would need a ${best.details.pvSizeKW} kW solar array with ${best.details.batteryKWh} kWh of battery storage.`;
    if (hasUnmetElecNeeds) {
      text += ` However, note that your school has significant unmet electrical needs. Consider whether a lower-cost Scheffler cooking system plus a smaller PV system for lighting and computers might be a better use of the same budget — see the Energy Priority section below.`;
    }
  } else {
    text += `and the solar panels last 30+ years. `;
    text += `You would need a ${best.details.pvSizeKW} kW solar array with a small ${best.details.batteryKWh} kWh battery buffer, plus your existing LPG setup for backup.`;
    if (hasUnmetElecNeeds) {
      text += ` However, note that your school has significant unmet electrical needs. Consider whether a lower-cost Scheffler cooking system plus a smaller PV system for lighting and computers might be a better use of the same budget — see the Energy Priority section below.`;
    }
  }

  return text;
}

// ---------- COOKING TIPS ----------
const COOKING_TIPS = {
  scheffler_lpg: [
    "Pre-soak beans and lentils overnight to reduce daytime cooking time.",
    "Schedule high-energy foods (ugali, beans) for 10am–2pm when solar output is highest.",
    "Use LPG backup for breakfast and any cooking that runs past 4pm.",
    "A trained operator is required — budget for initial training and annual refresher.",
    "Hot water storage can absorb excess solar energy for cleaning and next-day cooking.",
  ],
  pv_battery: [
    "Induction cookers ONLY work with magnetic cookware — stainless steel or cast iron with flat bottoms. Test with a magnet: if it sticks, the pot works.",
    "Use flat-bottomed induction-compatible cookware for best efficiency. Round-bottomed pots lose contact with the cooktop.",
    "Battery storage means cooking can happen at any time, but avoid running multiple high-draw burners simultaneously.",
    "Check battery charge level each morning — if below 30%, prioritise the most critical meal.",
    "LFP batteries need replacement around year 10 — plan for this cost. Inverters also need replacement at year 10.",
    "Keep induction cooktop surfaces clean — food residue reduces efficiency and can damage the glass.",
  ],
  pv_lpg: [
    "Induction cookers ONLY work with magnetic cookware — stainless steel or cast iron with flat bottoms. Your existing aluminum pots will NOT work.",
    "Think of LPG as insurance, not the primary fuel — aim to use solar for 50–65% of cooking.",
    "Schedule the most energy-intensive cooking (ugali, beans) during peak sun hours when PV output is highest.",
    "Track monthly LPG use after installation to verify solar fraction is as expected.",
    "Use flat-bottomed induction-compatible cookware for best efficiency with electric cooking.",
    "When switching between induction and LPG backup, food may need to be transferred to compatible pots — plan kitchen workflow accordingly.",
  ],
};

// ---------- TRANSLATIONS ----------
const T = {
  en: {
    // Header
    appTitle: "Solar Cooking Solution Finder",
    appVersion: "Prototype v0.3",
    appSubtitle: "For schools in Kenya & Tanzania",
    // Welcome
    welcomeHeading: "Is solar cooking right for your school?",
    welcomeBody: "Answer a few questions about your school and we'll show you which solar cooking solutions could save you money and reduce your fuel costs. Takes about 10 minutes.",
    whatItDoes: "What this tool does:",
    whatItDoesBody: "Compares three solar cooking technologies against your current fuel costs and provides indicative savings, payback periods, and practical recommendations.",
    whatItDoesNot: "What this tool does NOT do:",
    whatItDoesNotBody: "This is a screening tool, not an engineering assessment. You'll need a vendor site visit for a firm quote. Numbers shown are estimates based on typical systems.",
    startBtn: "Start Assessment",
    // Progress
    stepOf: "Step {0} of {1}",
    complete: "complete",
    // Navigation
    back: "← Back",
    continueBtn: "Continue →",
    calculateBtn: "Calculate Results →",
    // Step 1 - Location
    step1Title: "School Location",
    step1Desc: "This determines solar energy availability and local currency.",
    schoolName: "School name",
    schoolNameSub: "Identifies your school in reports",
    schoolNamePlaceholder: "e.g. Mavuno Modal Girls Secondary School",
    country: "Country",
    selectCountry: "Select country",
    kenya: "Kenya",
    tanzania: "Tanzania",
    region: "Region / District",
    regionSub: "Used to estimate solar irradiation. Select the closest region.",
    selectRegion: "Select region",
    solarIrradiation: "Estimated solar irradiation:",
    belowMinimum: "Below minimum threshold",
    contactName: "Contact name",
    contactNameSub: "For vendor follow-up and report delivery",
    phone: "Phone",
    email: "Email",
    // Step 2 - Headcount
    step2Title: "Number of People Eating",
    step2Desc: "This determines the scale of cooking capacity required.",
    numStudents: "Number of students",
    numStudentsSub: "Total enrolled students",
    staffCount: "Faculty / staff eating",
    staffCountSub: "Leave blank to estimate at 5% of students",
    schoolType: "School type",
    boarding: "Boarding school",
    daySchool: "Day school",
    mixed: "Mixed (boarding + day)",
    attendance: "Average daily attendance (%)",
    attendanceSub: "Boarding schools default to 100%, day schools to 85%",
    // Step 3 - Meals
    step3Title: "Meal Schedule",
    step3Desc: "A boarding school serving three hot meals has about 3× the energy demand of a day school serving lunch only.",
    whichMeals: "Which meals does your school serve?",
    daysPerWeek: "Days per week meals are served",
    schoolWeeks: "School weeks per year",
    schoolWeeksSub: "Default is 38 weeks. Override if different.",
    // Step 4 - Menu
    step4Title: "Menu & Foods Cooked",
    step4Desc: "Menu type is the biggest driver of energy demand after headcount. Ugali and beans need significantly more energy than rice or porridge.",
    selectFoods: "Select all foods your school regularly cooks",
    energyProfile: "Energy profile:",
    highEnergyMsg: "Your menu includes high-energy foods. Scheffler thermal is well-suited for sustained high heat.",
    lowEnergyMsg: "Your menu is mostly low-to-medium energy. All solution types are viable.",
    // Step 5 - Site
    step5Title: "Site & Available Space",
    step5Desc: "Scheffler reflectors need at least 50m² of unshaded outdoor space near the kitchen. PV solutions are more flexible.",
    outdoorSpace: "Estimated outdoor space available (m²)",
    outdoorSpaceSub: "A basketball court is about 400m². A large classroom is about 50m².",
    belowSpaceMsg: "Below {0}m² — Scheffler reflectors will not be assessed. PV options still available.",
    shading: "Is the outdoor space unshaded?",
    shadingYes: "Yes — fully unshaded",
    shadingPartial: "Partially shaded",
    shadingNo: "No — mostly shaded",
    shadingWarning: "Scheffler will be flagged as conditional — a vendor site visit is needed to confirm.",
    kitchenType: "Kitchen type",
    kitchenIndoor: "Indoor kitchen",
    kitchenOutdoor: "Outdoor kitchen",
    kitchenBoth: "Both indoor and outdoor",
    gridConnection: "Grid electricity connection?",
    yes: "Yes",
    no: "No",
    existingSolar: "Existing solar installation?",
    // Electrical needs (NEW)
    electricalNeeds: "How well served is your school for electricity (lighting, computers, water pumping)?",
    electricalNeedsSub: "This helps us assess whether your budget is better spent on solar cooking or on meeting other electrical needs first.",
    elecWellServed: "Well served — reliable grid or existing solar for lighting, computers, water",
    elecSome: "Some coverage — grid power but unreliable, or basic solar for lighting only",
    elecPoor: "Poor — frequent outages, no computers, limited lighting",
    elecNone: "None — no grid connection, no solar, no reliable electricity",
    elecPoorWarning: "Your school has significant unmet electrical needs. Electricity is a higher-value energy carrier than heat — it powers lights, computers, and water pumps that nothing else can. Consider whether your budget should prioritise these needs before investing in PV-based cooking. Solar thermal (Scheffler) cooks with direct heat and leaves your electrical budget free for these priorities.",
    // Opportunity cost (NEW)
    opportunityCostTitle: "Energy Priority Consideration",
    opportunityCostIntro: "Electricity is the highest-value form of energy. It powers lighting, computers, water pumps, and health equipment — things that only electricity can do. Cooking requires heat, which can come directly from sunlight without converting to electricity first.",
    opportunityCostPV: "This PV cooking system uses {0} kW of solar capacity for cooking. The same capital ({1}) could alternatively fund:",
    opportunityCostAlt: "A Scheffler solar thermal cooking system ({0}) + a {1} kW PV system for lighting, computers & water ({2}) — with {3} remaining.",
    opportunityCostAdvice: "If your school has unmet electrical needs (lighting, computers, clean water), solar thermal cooking frees up your electrical budget for these higher-value uses.",
    opportunityCostNeutral: "Your school appears well-served for electricity, so using PV capacity for cooking is a reasonable option.",
    // Step 6 - Fuel
    step6Title: "Current Cooking Setup & Costs",
    step6Desc: "Without knowing what you currently pay for fuel, we can't calculate savings or payback.",
    fuelType: "Primary fuel type",
    fuelLPG: "LPG (gas)",
    fuelFirewood: "Firewood",
    fuelCharcoal: "Charcoal",
    fuelElectric: "Electric",
    fuelMixed: "Mixed (LPG + biomass)",
    lpgCylinders: "LPG cylinders used per month",
    lpgCylindersSub: "Standard 13kg cylinders",
    biomassKg: "Estimated kg of {0} per month",
    monthlyFuelCost: "Monthly fuel spend ({0})",
    monthlyFuelCostSub: "Enter the total you spend on cooking fuel each month in {0}",
    cookingEquipment: "Cooking equipment currently used",
    equipOpenFire: "Open fire / three-stone",
    equipLPG: "LPG burners",
    equipElectric: "Electric hotplates",
    equipImproved: "Improved wood stove",
    equipMixed: "Mixed",
    equipAge: "Estimated age of current equipment",
    ageLt2: "Less than 2 years",
    age2to5: "2–5 years",
    age5to10: "5–10 years",
    ageGt10: "Over 10 years",
    potMaterial: "What are your current cooking pots made of?",
    potMaterialSub: "PV solutions require induction-compatible (magnetic) cookware. Aluminum pots won't work with induction.",
    potAluminum: "Aluminum (most common)",
    potStainless: "Stainless steel",
    potCastIron: "Cast iron",
    potMixed: "Mixed / not sure",
    potWarning: "If a PV-based solution is recommended, your school will need new induction-compatible (stainless steel or cast iron) cookware. This cost is included in the PV estimates. Scheffler solar thermal works with your existing pots.",
    // Results
    assessmentComplete: "Assessment Complete",
    yourBaseline: "Your Current Baseline",
    monthlyFuelCostLabel: "Monthly fuel cost",
    costPerMealLabel: "Cost per meal",
    co2PerYear: "CO₂ per year",
    recommendation: "Recommendation",
    solutionComparison: "Solution Comparison",
    solution: "Solution",
    capex: "CAPEX",
    costPerMeal: "Cost/meal",
    payback: "Payback",
    tco30yr: "30yr TCO",
    solarPct: "Solar %",
    co2Saved: "CO₂ saved/yr",
    best: "BEST",
    conditional: "conditional",
    current: "Current",
    cookingTipsTitle: "Cooking Tips for Kitchen Staff",
    scheduleNotes: "Cooking Schedule Notes",
    solarCompatible: "Solar compatible",
    backupNeeded: "Backup fuel needed",
    caveatsTitle: "Important Caveats",
    vendorTitle: "Local Vendors",
    vendorDesc: "Vendors are pre-vetted by EWB or ISC partners. Contact them for a site-specific quote.",
    vendorDisclaimer: "Additional vendors will be added as the database is built out. This is not an endorsement of any specific vendor.",
    startNew: "Start New Assessment",
    inductionRequired: "Induction Equipment Required",
    inductionDesc: "This solution requires commercial induction cookers and induction-compatible cookware (stainless steel or cast iron with flat bottoms).",
    inductionCostIncluded: "Induction equipment cost of {0} is included in the CAPEX above.",
    inductionNewCookware: "Your current aluminum pots are not compatible — new cookware cost is included.",
    inductionExistingOk: "Your existing cookware should be compatible — verify with a magnet test (magnet sticks = works).",
    inductionLifespan: "Induction burners last ~6 years in heavy institutional use. Replacement costs are included in the 30-year TCO. Scheffler solar thermal does NOT require new cookware — it works with your existing pots.",
    // Export
    exportPDF: "Download PDF Report",
    exportText: "Copy Summary for WhatsApp",
    copiedToClipboard: "Copied to clipboard!",
    // Meals
    mealBreakfast: "Breakfast",
    mealMorningTea: "Morning tea",
    mealLunch: "Lunch",
    mealAfternoonTea: "Afternoon tea",
    mealDinner: "Dinner",
    // Foods
    foodUgali: "Ugali (stiff maize porridge)",
    foodBeans: "Beans / pulses / lentils",
    foodMakande: "Makande (maize + beans)",
    foodRice: "Rice",
    foodGreens: "Greens / vegetables",
    foodStew: "Mixed stew / meat",
    foodPorridge: "Porridge",
    foodTea: "Tea",
    foodBread: "Bread / chapati",
    foodEggs: "Eggs",
    foodCassava: "Cassava",
    foodPotatoes: "Potatoes",
    high: "high",
    medium: "medium",
    low: "low",
  },
  sw: {
    // Header
    appTitle: "Kitafutaji cha Suluhisho la Kupika kwa Jua",
    appVersion: "Mfano v0.3",
    appSubtitle: "Kwa shule nchini Kenya na Tanzania",
    // Welcome
    welcomeHeading: "Je, kupika kwa jua kunafaa shule yako?",
    welcomeBody: "Jibu maswali machache kuhusu shule yako na tutakuonyesha suluhisho zipi za kupika kwa nishati ya jua zinazoweza kukuokoa pesa na kupunguza gharama za mafuta. Inachukua dakika 10 hivi.",
    whatItDoes: "Chombo hiki kinafanya nini:",
    whatItDoesBody: "Kinalinganisha teknolojia tatu za kupika kwa jua na gharama zako za sasa za mafuta na kutoa mapendekezo ya akiba, kipindi cha kurejesha uwekezaji, na ushauri wa vitendo.",
    whatItDoesNot: "Chombo hiki HAKIFANYI nini:",
    whatItDoesNotBody: "Hiki ni chombo cha uchunguzi wa awali, si tathmini ya kihandisi. Utahitaji ziara ya mtaalamu ili kupata bei kamili. Nambari zilizoonyeshwa ni makadirio.",
    startBtn: "Anza Tathmini",
    // Progress
    stepOf: "Hatua ya {0} kati ya {1}",
    complete: "imekamilika",
    // Navigation
    back: "← Rudi",
    continueBtn: "Endelea →",
    calculateBtn: "Kokotoa Matokeo →",
    // Step 1
    step1Title: "Mahali pa Shule",
    step1Desc: "Hii inaamua upatikanaji wa nishati ya jua na sarafu ya eneo.",
    schoolName: "Jina la shule",
    schoolNameSub: "Kutambua shule yako katika ripoti",
    schoolNamePlaceholder: "mf. Shule ya Sekondari ya Wasichana Mavuno",
    country: "Nchi",
    selectCountry: "Chagua nchi",
    kenya: "Kenya",
    tanzania: "Tanzania",
    region: "Mkoa / Wilaya",
    regionSub: "Inatumika kukadiria mionzi ya jua. Chagua eneo lililo karibu zaidi.",
    selectRegion: "Chagua mkoa",
    solarIrradiation: "Mionzi ya jua iliyokadiriwa:",
    belowMinimum: "Chini ya kiwango cha chini",
    contactName: "Jina la mtu wa kuwasiliana naye",
    contactNameSub: "Kwa ufuatiliaji wa muuzaji na utoaji wa ripoti",
    phone: "Simu",
    email: "Barua pepe",
    // Step 2
    step2Title: "Idadi ya Watu Wanaokula",
    step2Desc: "Hii inaamua ukubwa wa uwezo wa kupika unaohitajika.",
    numStudents: "Idadi ya wanafunzi",
    numStudentsSub: "Jumla ya wanafunzi walioandikishwa",
    staffCount: "Walimu / wafanyakazi wanaokula",
    staffCountSub: "Acha wazi ili kukadiria 5% ya wanafunzi",
    schoolType: "Aina ya shule",
    boarding: "Shule ya bweni",
    daySchool: "Shule ya kutwa",
    mixed: "Mchanganyiko (bweni + kutwa)",
    attendance: "Wastani wa mahudhurio ya kila siku (%)",
    attendanceSub: "Shule za bweni ni 100%, shule za kutwa ni 85%",
    // Step 3
    step3Title: "Ratiba ya Milo",
    step3Desc: "Shule ya bweni inayotoa milo mitatu ya moto ina mahitaji ya nishati mara 3 zaidi ya shule ya kutwa inayotoa chakula cha mchana pekee.",
    whichMeals: "Shule yako inatoa milo gani?",
    daysPerWeek: "Siku ngapi kwa wiki milo inatolewa",
    schoolWeeks: "Wiki za masomo kwa mwaka",
    schoolWeeksSub: "Kawaida ni wiki 38. Badilisha ikiwa ni tofauti.",
    // Step 4
    step4Title: "Menyu na Vyakula Vinavyopikwa",
    step4Desc: "Aina ya menyu ndiyo kichocheo kikubwa zaidi cha mahitaji ya nishati baada ya idadi ya watu. Ugali na maharage yanahitaji nishati zaidi kuliko wali au uji.",
    selectFoods: "Chagua vyakula vyote ambavyo shule yako inapika mara kwa mara",
    energyProfile: "Profaili ya nishati:",
    highEnergyMsg: "Menyu yako ina vyakula vya nishati nyingi. Scheffler ya joto ya jua inafaa kwa joto la muda mrefu.",
    lowEnergyMsg: "Menyu yako ni ya nishati ya kati hadi chini. Aina zote za suluhisho zinafaa.",
    // Step 5
    step5Title: "Eneo na Nafasi Inayopatikana",
    step5Desc: "Vioo vya Scheffler vinahitaji angalau 50m² ya nafasi ya nje isiyo na kivuli karibu na jiko. Suluhisho za PV ni rahisi zaidi.",
    outdoorSpace: "Nafasi ya nje inayopatikana (m²)",
    outdoorSpaceSub: "Uwanja wa mpira wa kikapu ni takriban 400m². Darasa kubwa ni takriban 50m².",
    belowSpaceMsg: "Chini ya {0}m² — Vioo vya Scheffler havitatathminiwa. Chaguzi za PV bado zinapatikana.",
    shading: "Je, nafasi ya nje haina kivuli?",
    shadingYes: "Ndiyo — hakuna kivuli kabisa",
    shadingPartial: "Kuna kivuli kwa sehemu",
    shadingNo: "Hapana — kuna kivuli zaidi",
    shadingWarning: "Scheffler itawekwa alama ya masharti — ziara ya mtaalamu inahitajika kuthibitisha.",
    kitchenType: "Aina ya jiko",
    kitchenIndoor: "Jiko la ndani",
    kitchenOutdoor: "Jiko la nje",
    kitchenBoth: "Vyote viwili ndani na nje",
    gridConnection: "Muunganisho wa umeme wa gridi?",
    yes: "Ndiyo",
    no: "Hapana",
    existingSolar: "Mfumo wa sasa wa jua uliopo?",
    // Electrical needs
    electricalNeeds: "Je, shule yako ina umeme wa kutosha (taa, kompyuta, pampu ya maji)?",
    electricalNeedsSub: "Hii inatusaidia kutathmini kama bajeti yako inapaswa kutumika kwa kupikia kwa jua au kukidhi mahitaji mengine ya umeme kwanza.",
    elecWellServed: "Vizuri — umeme wa gridi au jua kwa taa, kompyuta, maji",
    elecSome: "Kiasi — umeme wa gridi lakini hauegemei, au jua kwa taa tu",
    elecPoor: "Duni — umeme unakatika mara kwa mara, hakuna kompyuta, taa ndogo",
    elecNone: "Hakuna — hakuna muunganisho wa gridi, hakuna jua, hakuna umeme wa kuaminika",
    elecPoorWarning: "Shule yako ina mahitaji makubwa ya umeme ambayo hayajatimizwa. Umeme ni njia ya juu zaidi ya nishati kuliko joto — unawasha taa, kompyuta, na pampu za maji ambazo hakuna kitu kingine kinachoweza kufanya. Fikiria kama bajeti yako inapaswa kutanguliza mahitaji haya kabla ya kuwekeza katika kupikia kwa PV. Scheffler ya jua inapika kwa joto moja kwa moja na kuacha bajeti yako ya umeme huru kwa vipaumbele hivi.",
    // Opportunity cost
    opportunityCostTitle: "Kuzingatia Kipaumbele cha Nishati",
    opportunityCostIntro: "Umeme ni aina ya thamani ya juu zaidi ya nishati. Unawasha taa, kompyuta, pampu za maji, na vifaa vya afya — vitu ambavyo umeme pekee unaweza kufanya. Kupika kunahitaji joto, ambalo linaweza kutoka moja kwa moja kutoka kwa jua bila kubadilishwa kuwa umeme kwanza.",
    opportunityCostPV: "Mfumo huu wa kupikia kwa PV unatumia {0} kW ya uwezo wa jua kwa kupikia. Mtaji huo huo ({1}) ungeweza badala yake kufadhili:",
    opportunityCostAlt: "Mfumo wa kupikia kwa Scheffler ({0}) + mfumo wa PV wa {1} kW kwa taa, kompyuta na maji ({2}) — na {3} iliyobaki.",
    opportunityCostAdvice: "Ikiwa shule yako ina mahitaji ya umeme ambayo hayajatimizwa (taa, kompyuta, maji safi), kupikia kwa jua ya Scheffler kunaacha bajeti yako ya umeme huru kwa matumizi haya ya thamani zaidi.",
    opportunityCostNeutral: "Shule yako inaonekana kuhudumiwa vizuri kwa umeme, kwa hivyo kutumia uwezo wa PV kwa kupikia ni chaguo la busara.",
    // Step 6
    step6Title: "Mfumo wa Sasa wa Kupika na Gharama",
    step6Desc: "Bila kujua unalipa kiasi gani kwa mafuta sasa hivi, hatuwezi kukokotoa akiba au kipindi cha kurejesha uwekezaji.",
    fuelType: "Aina ya mafuta ya msingi",
    fuelLPG: "LPG (gesi)",
    fuelFirewood: "Kuni",
    fuelCharcoal: "Mkaa",
    fuelElectric: "Umeme",
    fuelMixed: "Mchanganyiko (LPG + kuni/mkaa)",
    lpgCylinders: "Mitungi ya LPG inayotumika kwa mwezi",
    lpgCylindersSub: "Mitungi ya kawaida ya kg 13",
    biomassKg: "Makadirio ya kg ya {0} kwa mwezi",
    monthlyFuelCost: "Matumizi ya mafuta kwa mwezi ({0})",
    monthlyFuelCostSub: "Ingiza jumla unayotumia kwa mafuta ya kupikia kila mwezi kwa {0}",
    cookingEquipment: "Vifaa vya kupikia vinavyotumika sasa",
    equipOpenFire: "Moto wazi / mafiga matatu",
    equipLPG: "Majiko ya LPG",
    equipElectric: "Sahani za umeme",
    equipImproved: "Jiko bora la kuni",
    equipMixed: "Mchanganyiko",
    equipAge: "Umri wa vifaa vya sasa",
    ageLt2: "Chini ya miaka 2",
    age2to5: "Miaka 2–5",
    age5to10: "Miaka 5–10",
    ageGt10: "Zaidi ya miaka 10",
    potMaterial: "Sufuria zako za sasa zimetengenezwa kwa nini?",
    potMaterialSub: "Suluhisho za PV zinahitaji vyombo vinavyofanya kazi na induction (magnetic). Sufuria za alumini hazifanyi kazi na induction.",
    potAluminum: "Alumini (ya kawaida zaidi)",
    potStainless: "Chuma cha pua (stainless steel)",
    potCastIron: "Chuma (cast iron)",
    potMixed: "Mchanganyiko / sijui",
    potWarning: "Ikiwa suluhisho la PV litapendekezwa, shule yako itahitaji sufuria mpya zinazofaa induction (chuma cha pua au cast iron). Gharama hii imejumuishwa katika makadirio ya PV. Scheffler ya jua inafanya kazi na sufuria zako za sasa.",
    // Results
    assessmentComplete: "Tathmini Imekamilika",
    yourBaseline: "Hali Yako ya Sasa",
    monthlyFuelCostLabel: "Gharama ya mafuta kwa mwezi",
    costPerMealLabel: "Gharama kwa mlo",
    co2PerYear: "CO₂ kwa mwaka",
    recommendation: "Pendekezo",
    solutionComparison: "Ulinganishi wa Suluhisho",
    solution: "Suluhisho",
    capex: "Gharama ya Awali",
    costPerMeal: "Gharama/mlo",
    payback: "Kurejesha",
    tco30yr: "TCO miaka 30",
    solarPct: "Jua %",
    co2Saved: "CO₂ iliyookolewa/mwaka",
    best: "BORA",
    conditional: "masharti",
    current: "Sasa",
    cookingTipsTitle: "Vidokezo vya Kupikia kwa Wapishi",
    scheduleNotes: "Maelezo ya Ratiba ya Kupikia",
    solarCompatible: "Inafaa na jua",
    backupNeeded: "Mafuta ya akiba yanahitajika",
    caveatsTitle: "Tahadhari Muhimu",
    vendorTitle: "Wauzaji wa Eneo",
    vendorDesc: "Wauzaji wamehakikiwa na EWB au washirika wa ISC. Wasiliana nao kwa bei maalum ya eneo.",
    vendorDisclaimer: "Wauzaji zaidi wataongezwa kadri orodha inavyojengwa. Hii si uthibitisho wa muuzaji yeyote.",
    startNew: "Anza Tathmini Mpya",
    inductionRequired: "Vifaa vya Induction Vinahitajika",
    inductionDesc: "Suluhisho hili linahitaji majiko ya kibiashara ya induction na sufuria zinazofaa induction (chuma cha pua au cast iron yenye sehemu za chini tambarare).",
    inductionCostIncluded: "Gharama ya vifaa vya induction ya {0} imejumuishwa katika CAPEX hapo juu.",
    inductionNewCookware: "Sufuria zako za sasa za alumini hazifai — gharama ya sufuria mpya imejumuishwa.",
    inductionExistingOk: "Sufuria zako za sasa zinafaa — thibitisha kwa jaribio la sumaku (sumaku ikishikamana = inafanya kazi).",
    inductionLifespan: "Majiko ya induction hudumu ~miaka 6 katika matumizi mazito ya kitaasisi. Gharama za kubadilisha zimejumuishwa katika TCO ya miaka 30. Scheffler ya jua HAIHITAJI sufuria mpya — inafanya kazi na sufuria zako za sasa.",
    // Export
    exportPDF: "Pakua Ripoti ya PDF",
    exportText: "Nakili Muhtasari kwa WhatsApp",
    copiedToClipboard: "Imenakiliwa!",
    // Meals
    mealBreakfast: "Kifungua kinywa",
    mealMorningTea: "Chai ya asubuhi",
    mealLunch: "Chakula cha mchana",
    mealAfternoonTea: "Chai ya alasiri",
    mealDinner: "Chakula cha jioni",
    // Foods
    foodUgali: "Ugali",
    foodBeans: "Maharage / kunde",
    foodMakande: "Makande (mahindi na maharage)",
    foodRice: "Wali",
    foodGreens: "Mboga za majani",
    foodStew: "Mchuzi / nyama",
    foodPorridge: "Uji",
    foodTea: "Chai",
    foodBread: "Mkate / chapati",
    foodEggs: "Mayai",
    foodCassava: "Muhogo",
    foodPotatoes: "Viazi",
    high: "juu",
    medium: "kati",
    low: "chini",
  },
};

function t(key, lang, ...args) {
  let str = T[lang]?.[key] || T.en[key] || key;
  args.forEach((arg, i) => {
    str = str.replace(`{${i}}`, arg);
  });
  return str;
}

// ---------- EXPORT UTILITIES ----------

function generateWhatsAppText(results, inputs, lang) {
  const curr = results.currency;
  const best = results.solutions[0];
  if (!best) return "";

  const schoolName = inputs.schoolName || "School";
  const lines = [
    `☀️ *${t("appTitle", lang)}*`,
    `📋 ${schoolName}`,
    `📍 ${inputs.region}, ${inputs.country === "kenya" ? "Kenya" : "Tanzania"}`,
    `👨‍🎓 ${results.totalDiners} ${lang === "sw" ? "wanakula/siku" : "diners/day"} · ${results.annualMeals.toLocaleString()} ${lang === "sw" ? "milo/mwaka" : "meals/yr"}`,
    "",
    `💰 ${lang === "sw" ? "Sasa hivi" : "Currently"}: ${curr.symbol} ${inputs.monthlyFuelCost?.toLocaleString()}/${lang === "sw" ? "mwezi" : "month"}`,
    "",
    `✅ *${lang === "sw" ? "Pendekezo" : "Recommendation"}: ${best.name}*`,
    `• ${lang === "sw" ? "Gharama ya awali" : "Upfront cost"}: ${curr.symbol} ${best.capex.toLocaleString()}`,
    `• ${lang === "sw" ? "Kurejesha" : "Payback"}: ~${best.paybackYears} ${lang === "sw" ? "miaka" : "years"}`,
    `• ${lang === "sw" ? "Akiba ya kila mwaka" : "Annual savings"}: ${curr.symbol} ${best.annualSavings.toLocaleString()}`,
    `• ${lang === "sw" ? "Nishati ya jua" : "Solar fraction"}: ${best.solarFraction}%`,
    "",
    `⚠️ ${lang === "sw" ? "Hizi ni makadirio. Ziara ya mtaalamu inahitajika kwa bei kamili." : "These are estimates. A vendor site visit is needed for a firm quote."}`,
  ];
  return lines.join("\n");
}

// ---------- STYLES ----------
const colors = {
  bg: "#FAFAF7",
  card: "#FFFFFF",
  primary: "#1B6B4A",
  primaryLight: "#E8F5EE",
  primaryDark: "#0F4A32",
  accent: "#E8890C",
  accentLight: "#FFF3E0",
  text: "#1A1A1A",
  textSecondary: "#5A5A5A",
  border: "#E2E0DB",
  danger: "#C62828",
  dangerLight: "#FFEBEE",
  warning: "#F57F17",
  warningLight: "#FFF8E1",
  success: "#2E7D32",
  successLight: "#E8F5E9",
};

// ---------- UI COMPONENTS ----------

function ProgressBar({ step, totalSteps }) {
  const pct = ((step) / totalSteps) * 100;
  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", marginBottom: 6,
        fontSize: 13, color: colors.textSecondary,
      }}>
        <span>Step {step} of {totalSteps}</span>
        <span>{Math.round(pct)}% complete</span>
      </div>
      <div style={{
        height: 6, borderRadius: 3, background: colors.border, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: colors.primary,
          borderRadius: 3, transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: colors.card, borderRadius: 12, border: `1px solid ${colors.border}`,
      padding: 24, marginBottom: 16, ...style,
    }}>
      {children}
    </div>
  );
}

function Label({ children, sub }) {
  return (
    <div style={{ marginBottom: sub ? 4 : 12 }}>
      <div style={{ fontWeight: 600, fontSize: 15, color: colors.text, marginBottom: 2 }}>{children}</div>
      {sub && <div style={{ fontSize: 13, color: colors.textSecondary }}>{sub}</div>}
    </div>
  );
}

function Input({ value, onChange, type = "number", placeholder, style, ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", padding: "10px 12px", borderRadius: 8,
        border: `1px solid ${colors.border}`, fontSize: 15,
        outline: "none", boxSizing: "border-box",
        transition: "border 0.2s", ...style,
      }}
      onFocus={e => e.target.style.borderColor = colors.primary}
      onBlur={e => e.target.style.borderColor = colors.border}
      {...rest}
    />
  );
}

function Select({ value, onChange, options, style }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", padding: "10px 12px", borderRadius: 8,
        border: `1px solid ${colors.border}`, fontSize: 15,
        background: colors.card, outline: "none", boxSizing: "border-box",
        cursor: "pointer", ...style,
      }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
      cursor: "pointer", fontSize: 14,
    }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ width: 18, height: 18, accentColor: colors.primary, cursor: "pointer" }} />
      {label}
    </label>
  );
}

function Button({ onClick, children, variant = "primary", disabled, style }) {
  const base = {
    padding: "12px 24px", borderRadius: 8, fontSize: 15, fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer", border: "none",
    opacity: disabled ? 0.5 : 1, transition: "all 0.2s",
  };
  const variants = {
    primary: { ...base, background: colors.primary, color: "#fff" },
    secondary: { ...base, background: "transparent", color: colors.primary, border: `1.5px solid ${colors.primary}` },
    accent: { ...base, background: colors.accent, color: "#fff" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function Alert({ type = "info", children }) {
  const cfg = {
    info: { bg: colors.primaryLight, border: colors.primary, icon: "ℹ️" },
    warning: { bg: colors.warningLight, border: colors.warning, icon: "⚠️" },
    danger: { bg: colors.dangerLight, border: colors.danger, icon: "🚫" },
    success: { bg: colors.successLight, border: colors.success, icon: "✅" },
  };
  const c = cfg[type];
  return (
    <div style={{
      padding: "12px 16px", borderRadius: 8, background: c.bg,
      borderLeft: `4px solid ${c.border}`, fontSize: 14, lineHeight: 1.5,
      marginBottom: 12,
    }}>
      {c.icon} {children}
    </div>
  );
}

// NavButtons moved below with translation support

function NavButtons({ onBack, onNext, nextLabel, nextDisabled = false, lang = "en" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
      {onBack ? <Button variant="secondary" onClick={onBack}>{t("back", lang)}</Button> : <div />}
      <Button onClick={onNext} disabled={nextDisabled}>{nextLabel || t("continueBtn", lang)}</Button>
    </div>
  );
}

// ---------- STEP COMPONENTS ----------

function StepLocation({ data, onChange, onNext, lang }) {
  const regions = data.country ? Object.keys(REGION_GHI[data.country]) : [];
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: colors.text }}>{t("step1Title", lang)}</h2>
      <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20 }}>{t("step1Desc", lang)}</p>
      <Card>
        <Label sub={t("schoolNameSub", lang)}>{t("schoolName", lang)}</Label>
        <Input type="text" value={data.schoolName || ""} onChange={v => onChange({ schoolName: v })} placeholder={t("schoolNamePlaceholder", lang)} />
      </Card>
      <Card>
        <Label>{t("country", lang)}</Label>
        <Select value={data.country || ""} onChange={v => onChange({ country: v, region: "" })}
          options={[{ value: "", label: t("selectCountry", lang) }, { value: "kenya", label: t("kenya", lang) }, { value: "tanzania", label: t("tanzania", lang) }]} />
      </Card>
      {data.country && (
        <Card>
          <Label sub={t("regionSub", lang)}>{t("region", lang)}</Label>
          <Select value={data.region || ""} onChange={v => {
            const ghi = REGION_GHI[data.country]?.[v] || 5.3;
            onChange({ region: v, ghi });
          }}
            options={[{ value: "", label: t("selectRegion", lang) }, ...regions.map(r => ({ value: r, label: r }))]} />
          {data.ghi && (
            <div style={{ marginTop: 12, padding: "8px 12px", background: colors.primaryLight, borderRadius: 6, fontSize: 13 }}>
              {t("solarIrradiation", lang)} <strong>{data.ghi} kWh/m²/day</strong>
              {data.ghi < ASSUMPTIONS.GHI_KNOCKOUT && (
                <span style={{ color: colors.danger, fontWeight: 600 }}> — {t("belowMinimum", lang)} ({ASSUMPTIONS.GHI_KNOCKOUT})</span>
              )}
            </div>
          )}
        </Card>
      )}
      <Card>
        <Label sub={t("contactNameSub", lang)}>{t("contactName", lang)}</Label>
        <Input type="text" value={data.contactName || ""} onChange={v => onChange({ contactName: v })} placeholder={lang === "sw" ? "Jina" : "Name"} />
        <div style={{ height: 12 }} />
        <Label>{t("phone", lang)}</Label>
        <Input type="text" value={data.contactPhone || ""} onChange={v => onChange({ contactPhone: v })} placeholder="+254 or +255..." />
        <div style={{ height: 12 }} />
        <Label>{t("email", lang)}</Label>
        <Input type="text" value={data.contactEmail || ""} onChange={v => onChange({ contactEmail: v })} placeholder="email@school.ac.tz" />
      </Card>
      <NavButtons onNext={onNext} nextDisabled={!data.country || !data.region} lang={lang} />
    </div>
  );
}

function StepHeadcount({ data, onChange, onNext, onBack, lang }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t("step2Title", lang)}</h2>
      <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20 }}>{t("step2Desc", lang)}</p>
      <Card>
        <Label sub={t("numStudentsSub", lang)}>{t("numStudents", lang)}</Label>
        <Input value={data.studentCount || ""} onChange={v => onChange({ studentCount: v })} placeholder="e.g. 400" />
      </Card>
      <Card>
        <Label sub={t("staffCountSub", lang)}>{t("staffCount", lang)}</Label>
        <Input value={data.staffCount || ""} onChange={v => onChange({ staffCount: v })} placeholder={lang === "sw" ? "mf. 20 (si lazima)" : "e.g. 20 (optional)"} />
      </Card>
      <Card>
        <Label>{t("schoolType", lang)}</Label>
        <Select value={data.schoolType || "boarding"} onChange={v => {
          const att = v === "boarding" ? 100 : v === "day" ? 85 : 90;
          onChange({ schoolType: v, attendanceRate: att });
        }}
          options={[
            { value: "boarding", label: t("boarding", lang) },
            { value: "day", label: t("daySchool", lang) },
            { value: "mixed", label: t("mixed", lang) },
          ]} />
      </Card>
      <Card>
        <Label sub={t("attendanceSub", lang)}>{t("attendance", lang)}</Label>
        <Input value={data.attendanceRate ?? 100} onChange={v => onChange({ attendanceRate: v })}
          min={50} max={100} placeholder="85" />
      </Card>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!data.studentCount || data.studentCount < 10} lang={lang} />
    </div>
  );
}

const MEAL_KEYS = {
  breakfast: "mealBreakfast",
  morningTea: "mealMorningTea",
  lunch: "mealLunch",
  afternoonTea: "mealAfternoonTea",
  dinner: "mealDinner",
};

function StepMeals({ data, onChange, onNext, onBack, lang }) {
  const meals = data.meals || [];
  const toggleMeal = (m) => {
    const next = meals.includes(m) ? meals.filter(x => x !== m) : [...meals, m];
    onChange({ meals: next });
  };
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t("step3Title", lang)}</h2>
      <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20 }}>{t("step3Desc", lang)}</p>
      <Card>
        <Label>{t("whichMeals", lang)}</Label>
        {Object.entries(MEAL_TIMES).map(([key, m]) => (
          <Checkbox key={key} checked={meals.includes(key)} onChange={() => toggleMeal(key)}
            label={`${t(MEAL_KEYS[key], lang)} (~${m.hour > 12 ? m.hour - 12 : m.hour}${m.hour >= 12 ? "pm" : "am"})`} />
        ))}
      </Card>
      <Card>
        <Label>{t("daysPerWeek", lang)}</Label>
        <Select value={data.daysPerWeek || 7} onChange={v => onChange({ daysPerWeek: Number(v) })}
          options={[5, 6, 7].map(d => ({ value: d, label: `${d} ${lang === "sw" ? "siku" : "days"}` }))} />
      </Card>
      <Card>
        <Label sub={t("schoolWeeksSub", lang)}>{t("schoolWeeks", lang)}</Label>
        <Input value={data.schoolWeeks || 38} onChange={v => onChange({ schoolWeeks: v })} min={20} max={52} />
      </Card>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={meals.length === 0} lang={lang} />
    </div>
  );
}

const FOOD_KEYS = {
  ugali: "foodUgali", beans: "foodBeans", makande: "foodMakande", rice: "foodRice",
  greens: "foodGreens", stew: "foodStew", porridge: "foodPorridge", tea: "foodTea",
  bread: "foodBread", eggs: "foodEggs", cassava: "foodCassava", potatoes: "foodPotatoes",
};

function StepMenu({ data, onChange, onNext, onBack, lang }) {
  const foods = data.foods || [];
  const toggleFood = (f) => {
    const next = foods.includes(f) ? foods.filter(x => x !== f) : [...foods, f];
    onChange({ foods: next });
  };
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t("step4Title", lang)}</h2>
      <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20 }}>{t("step4Desc", lang)}</p>
      <Card>
        <Label>{t("selectFoods", lang)}</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {Object.entries(FOOD_ENERGY).map(([key, f]) => (
            <Checkbox key={key} checked={foods.includes(key)} onChange={() => toggleFood(key)}
              label={<span>{t(FOOD_KEYS[key], lang)} <span style={{
                fontSize: 11, padding: "1px 6px", borderRadius: 4, marginLeft: 4,
                background: f.category === "high" ? "#FFCDD2" : f.category === "medium" ? "#FFF9C4" : "#C8E6C9",
                color: f.category === "high" ? "#B71C1C" : f.category === "medium" ? "#F57F17" : "#1B5E20",
              }}>{t(f.category, lang)}</span></span>} />
          ))}
        </div>
      </Card>
      {foods.length > 0 && (
        <Alert type="info">
          {t("energyProfile", lang)} {foods.filter(f => FOOD_ENERGY[f]?.category === "high").length > 0
            ? t("highEnergyMsg", lang)
            : t("lowEnergyMsg", lang)}
        </Alert>
      )}
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={foods.length === 0} lang={lang} />
    </div>
  );
}

function StepSite({ data, onChange, onNext, onBack, lang }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t("step5Title", lang)}</h2>
      <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20 }}>{t("step5Desc", lang)}</p>
      <Card>
        <Label sub={t("outdoorSpaceSub", lang)}>{t("outdoorSpace", lang)}</Label>
        <Input value={data.availableSpace || ""} onChange={v => onChange({ availableSpace: v })} placeholder="e.g. 200" />
        {data.availableSpace && data.availableSpace < ASSUMPTIONS.SCHEFFLER_MIN_SPACE_M2 && (
          <Alert type="warning">{t("belowSpaceMsg", lang, ASSUMPTIONS.SCHEFFLER_MIN_SPACE_M2)}</Alert>
        )}
      </Card>
      <Card>
        <Label>{t("shading", lang)}</Label>
        <Select value={data.shading || "yes"} onChange={v => onChange({ shading: v })}
          options={[
            { value: "yes", label: t("shadingYes", lang) },
            { value: "partial", label: t("shadingPartial", lang) },
            { value: "no", label: t("shadingNo", lang) },
          ]} />
        {data.shading === "partial" && <Alert type="warning">{t("shadingWarning", lang)}</Alert>}
      </Card>
      <Card>
        <Label>{t("kitchenType", lang)}</Label>
        <Select value={data.kitchenType || "indoor"} onChange={v => onChange({ kitchenType: v })}
          options={[
            { value: "indoor", label: t("kitchenIndoor", lang) },
            { value: "outdoor", label: t("kitchenOutdoor", lang) },
            { value: "both", label: t("kitchenBoth", lang) },
          ]} />
      </Card>
      <Card>
        <Label>{t("gridConnection", lang)}</Label>
        <Select value={data.gridConnection || "yes"} onChange={v => onChange({ gridConnection: v })}
          options={[{ value: "yes", label: t("yes", lang) }, { value: "no", label: t("no", lang) }]} />
      </Card>
      <Card>
        <Label>{t("existingSolar", lang)}</Label>
        <Select value={data.existingSolar || "no"} onChange={v => onChange({ existingSolar: v })}
          options={[{ value: "no", label: t("no", lang) }, { value: "yes", label: t("yes", lang) }]} />
      </Card>
      <Card>
        <Label sub={t("electricalNeedsSub", lang)}>{t("electricalNeeds", lang)}</Label>
        <Select value={data.electricalNeeds || "some"} onChange={v => onChange({ electricalNeeds: v })}
          options={[
            { value: "well_served", label: t("elecWellServed", lang) },
            { value: "some", label: t("elecSome", lang) },
            { value: "poor", label: t("elecPoor", lang) },
            { value: "none", label: t("elecNone", lang) },
          ]} />
        {(data.electricalNeeds === "poor" || data.electricalNeeds === "none") && (
          <Alert type="info">{t("elecPoorWarning", lang)}</Alert>
        )}
      </Card>
      <NavButtons onBack={onBack} onNext={onNext} nextDisabled={!data.availableSpace} lang={lang} />
    </div>
  );
}

function StepFuel({ data, onChange, onNext, onBack, lang }) {
  const curr = CURRENCY[data.country] || CURRENCY.kenya;
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{t("step6Title", lang)}</h2>
      <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20 }}>{t("step6Desc", lang)}</p>
      <Card>
        <Label>{t("fuelType", lang)}</Label>
        <Select value={data.fuelType || "lpg"} onChange={v => onChange({ fuelType: v })}
          options={[
            { value: "lpg", label: t("fuelLPG", lang) },
            { value: "firewood", label: t("fuelFirewood", lang) },
            { value: "charcoal", label: t("fuelCharcoal", lang) },
            { value: "electric", label: t("fuelElectric", lang) },
            { value: "mixed", label: t("fuelMixed", lang) },
          ]} />
      </Card>
      {(data.fuelType === "lpg" || data.fuelType === "mixed") && (
        <Card>
          <Label sub={t("lpgCylindersSub", lang)}>{t("lpgCylinders", lang)}</Label>
          <Input value={data.lpgCylinders || ""} onChange={v => onChange({ lpgCylinders: v })} placeholder="e.g. 8" />
        </Card>
      )}
      {(data.fuelType === "firewood" || data.fuelType === "charcoal" || data.fuelType === "mixed") && (
        <Card>
          <Label>{t("biomassKg", lang, data.fuelType === "mixed" ? (lang === "sw" ? "kuni/mkaa" : "firewood/charcoal") : t("fuel" + data.fuelType.charAt(0).toUpperCase() + data.fuelType.slice(1), lang))}</Label>
          <Input value={data.biomassKg || ""} onChange={v => onChange({ biomassKg: v })} placeholder="e.g. 2000" />
        </Card>
      )}
      <Card>
        <Label sub={t("monthlyFuelCostSub", lang, curr.symbol)}>{t("monthlyFuelCost", lang, curr.symbol)}</Label>
        <Input value={data.monthlyFuelCost || ""} onChange={v => onChange({ monthlyFuelCost: v })}
          placeholder={data.country === "kenya" ? "e.g. 48000" : "e.g. 800000"} />
      </Card>
      <Card>
        <Label>{t("cookingEquipment", lang)}</Label>
        <Select value={data.cookingEquipment || "lpg_burners"} onChange={v => onChange({ cookingEquipment: v })}
          options={[
            { value: "open_fire", label: t("equipOpenFire", lang) },
            { value: "lpg_burners", label: t("equipLPG", lang) },
            { value: "electric", label: t("equipElectric", lang) },
            { value: "improved_stove", label: t("equipImproved", lang) },
            { value: "mixed", label: t("equipMixed", lang) },
          ]} />
      </Card>
      <Card>
        <Label>{t("equipAge", lang)}</Label>
        <Select value={data.equipmentAge || "2-5"} onChange={v => onChange({ equipmentAge: v })}
          options={[
            { value: "<2", label: t("ageLt2", lang) },
            { value: "2-5", label: t("age2to5", lang) },
            { value: "5-10", label: t("age5to10", lang) },
            { value: ">10", label: t("ageGt10", lang) },
          ]} />
      </Card>
      <Card>
        <Label sub={t("potMaterialSub", lang)}>{t("potMaterial", lang)}</Label>
        <Select value={data.potMaterial || "aluminum"} onChange={v => onChange({ potMaterial: v })}
          options={[
            { value: "aluminum", label: t("potAluminum", lang) },
            { value: "stainless_steel", label: t("potStainless", lang) },
            { value: "cast_iron", label: t("potCastIron", lang) },
            { value: "mixed", label: t("potMixed", lang) },
          ]} />
        {(data.potMaterial === "aluminum" || data.potMaterial === "mixed") && (
          <Alert type="info">{t("potWarning", lang)}</Alert>
        )}
      </Card>
      <NavButtons onBack={onBack} onNext={onNext} nextLabel={t("calculateBtn", lang)} nextDisabled={!data.monthlyFuelCost} lang={lang} />
    </div>
  );
}

// ---------- RESULTS DISPLAY ----------

function formatMoney(amount, currency) {
  if (!amount && amount !== 0) return "—";
  return `${currency.symbol} ${Math.round(amount).toLocaleString()}`;
}

function formatUSD(amount, currency) {
  return `$${(amount / currency.rate).toFixed(2)}`;
}

function ResultsView({ results, inputs, onRestart, lang, copied, setCopied }) {
  const curr = results.currency;

  if (results.ghiKnockout) {
    return (
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: colors.danger }}>
          Assessment Result
        </h2>
        <Alert type="danger">
          <strong>Solar resource insufficient.</strong> Based on your location ({inputs.region}), solar energy levels
          ({results.ghi} kWh/m²/day) are below the minimum threshold of {ASSUMPTIONS.GHI_KNOCKOUT} kWh/m²/day.
          Solar cooking solutions are unlikely to be cost-effective at this site.
        </Alert>
        <Card>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: colors.textSecondary }}>
            We recommend speaking with a local energy advisor about LPG efficiency improvements or biogas options.
            You can still contact local vendors below for a professional assessment — they may identify site-specific
            factors that our screening tool cannot capture.
          </p>
        </Card>
        <Button onClick={onRestart} variant="secondary">Start New Assessment</Button>
      </div>
    );
  }

  const recommendation = generateRecommendation(results, inputs);
  const best = results.solutions[0];

  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`,
        borderRadius: 12, padding: 28, marginBottom: 20, color: "#fff",
      }}>
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.8, marginBottom: 8 }}>
          Assessment Complete
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4, color: "#fff" }}>
          {inputs.schoolName || "Your School"}
        </h2>
        <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>
          {results.totalDiners} diners · {results.annualMeals.toLocaleString()} meals/year · {results.ghi} kWh/m²/day solar
        </p>
      </div>

      {/* Current baseline */}
      <Card>
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: colors.textSecondary, marginBottom: 8 }}>
          Your Current Baseline
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>
              {formatMoney(inputs.monthlyFuelCost, curr)}
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>Monthly fuel cost</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>
              {formatMoney(results.currentCostPerMeal, curr)}
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>Cost per meal</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>
              {results.annualCO2Baseline.toLocaleString()} kg
            </div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>CO₂ per year</div>
          </div>
        </div>
      </Card>

      {/* Recommendation */}
      <Card style={{ borderLeft: `4px solid ${colors.primary}` }}>
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: colors.primary, marginBottom: 8, fontWeight: 600 }}>
          Recommendation
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: colors.text, margin: 0 }}>
          {recommendation}
        </p>
      </Card>

      {/* Comparison table */}
      <Card>
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1, color: colors.textSecondary, marginBottom: 16 }}>
          Solution Comparison
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, color: colors.textSecondary }}>Solution</th>
                <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, color: colors.textSecondary }}>CAPEX</th>
                <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, color: colors.textSecondary }}>Cost/meal</th>
                <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, color: colors.textSecondary }}>Payback</th>
                <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, color: colors.textSecondary }}>30yr TCO</th>
                <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, color: colors.textSecondary }}>Solar %</th>
                <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 600, color: colors.textSecondary }}>CO₂ saved/yr</th>
              </tr>
            </thead>
            <tbody>
              {results.solutions.map((s, i) => (
                <tr key={s.id} style={{
                  borderBottom: `1px solid ${colors.border}`,
                  background: i === 0 ? colors.primaryLight : "transparent",
                }}>
                  <td style={{ padding: "10px 12px", fontWeight: i === 0 ? 700 : 400 }}>
                    {i === 0 && <span style={{
                      fontSize: 10, background: colors.primary, color: "#fff",
                      padding: "2px 6px", borderRadius: 4, marginRight: 6, verticalAlign: "middle",
                    }}>BEST</span>}
                    {s.name}
                    {s.conditional && <span style={{ fontSize: 11, color: colors.warning }}> ⚠️ conditional</span>}
                  </td>
                  <td style={{ textAlign: "right", padding: "10px 12px" }}>{formatMoney(s.capex, curr)}</td>
                  <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 600 }}>
                    {formatMoney(s.costPerMeal, curr)}
                    <div style={{ fontSize: 11, color: colors.textSecondary }}>({formatUSD(s.costPerMeal, curr)})</div>
                  </td>
                  <td style={{ textAlign: "right", padding: "10px 12px" }}>{s.paybackYears} yrs</td>
                  <td style={{ textAlign: "right", padding: "10px 12px" }}>{formatMoney(s.tco30, curr)}</td>
                  <td style={{ textAlign: "right", padding: "10px 12px" }}>{s.solarFraction}%</td>
                  <td style={{ textAlign: "right", padding: "10px 12px" }}>{s.co2SavedPerYear.toLocaleString()} kg</td>
                </tr>
              ))}
              <tr style={{ background: colors.dangerLight }}>
                <td style={{ padding: "10px 12px", fontWeight: 600, color: colors.danger }}>Current ({inputs.fuelType})</td>
                <td style={{ textAlign: "right", padding: "10px 12px" }}>—</td>
                <td style={{ textAlign: "right", padding: "10px 12px", fontWeight: 600, color: colors.danger }}>
                  {formatMoney(results.currentCostPerMeal, curr)}
                </td>
                <td style={{ textAlign: "right", padding: "10px 12px" }}>—</td>
                <td style={{ textAlign: "right", padding: "10px 12px", color: colors.danger }}>
                  {formatMoney(results.annualFuelCost * 30, curr)}
                </td>
                <td style={{ textAlign: "right", padding: "10px 12px" }}>0%</td>
                <td style={{ textAlign: "right", padding: "10px 12px" }}>0 kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Energy Priority Context Section */}
      <Card style={{ borderLeft: `4px solid ${colors.accent}`, background: "#FFFBF5" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.accent, marginBottom: 8 }}>
          {t("opportunityCostTitle", lang)}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: colors.text, margin: "0 0 12px 0" }}>
          {t("opportunityCostIntro", lang)}
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: colors.text, margin: "0 0 12px 0", fontWeight: 500 }}>
          {(results.electricalNeeds === "poor" || results.electricalNeeds === "none")
            ? t("opportunityCostAdvice", lang)
            : t("opportunityCostNeutral", lang)}
        </p>

        {/* Show concrete opportunity cost for each PV solution */}
        {results.solutions.filter(s => s.opportunityCost && s.opportunityCost.schefflerCapex > 0).map(s => (
          <div key={s.id + "_opp"} style={{
            padding: "12px 16px", borderRadius: 8, background: "#fff",
            border: `1px solid ${colors.border}`, marginBottom: 8,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{s.name}:</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: colors.textSecondary }}>
              {t("opportunityCostPV", lang, s.details.pvSizeKW, formatMoney(s.capex, curr))}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: colors.text, marginTop: 4 }}>
              → {t("opportunityCostAlt", lang,
                formatMoney(s.opportunityCost.schefflerCapex, curr),
                s.opportunityCost.altPVSizeKW,
                formatMoney(s.opportunityCost.altPVCost, curr),
                formatMoney(s.opportunityCost.leftover, curr)
              )}
            </div>
          </div>
        ))}
      </Card>

      {/* Solution details with cooking tips */}
      {results.solutions.map((s) => (
        <Card key={s.id}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: colors.text }}>{s.name}</h3>
          <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.5, marginBottom: 16 }}>{s.description}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
            {s.id === "scheffler_lpg" && (
              <>
                <div style={{ fontSize: 13 }}>Scheffler dishes: <strong>{s.details.dishes}</strong></div>
                <div style={{ fontSize: 13 }}>Space required: <strong>{s.details.spaceRequired}m²</strong></div>
              </>
            )}
            {(s.id === "pv_battery" || s.id === "pv_lpg") && (
              <>
                <div style={{ fontSize: 13 }}>PV array: <strong>{s.details.pvSizeKW} kW</strong></div>
                <div style={{ fontSize: 13 }}>Battery: <strong>{s.details.batteryKWh} kWh</strong> (LFP)</div>
                <div style={{ fontSize: 13 }}>Inverter: <strong>{s.details.inverterKW} kW</strong></div>
                <div style={{ fontSize: 13 }}>Induction burners: <strong>{s.details.inductionBurners}</strong></div>
              </>
            )}
            <div style={{ fontSize: 13 }}>Annual backup fuel: <strong>{formatMoney(s.details.annualBackupFuel, curr)}</strong></div>
            <div style={{ fontSize: 13 }}>Annual maintenance: <strong>{formatMoney(s.details.annualOpex, curr)}</strong></div>
            <div style={{ fontSize: 13 }}>Annual savings: <strong style={{ color: colors.success }}>{formatMoney(s.annualSavings, curr)}</strong></div>
          </div>

          {/* Induction equipment notice for PV solutions */}
          {s.requiresInduction && (
            <div style={{
              padding: "12px 16px", borderRadius: 8, marginBottom: 16,
              background: "#FFF3E0", borderLeft: `4px solid ${colors.accent}`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.accent, marginBottom: 4 }}>
                Induction Equipment Required
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: colors.text }}>
                This solution requires commercial induction cookers and induction-compatible cookware
                (stainless steel or cast iron with flat bottoms). Induction equipment cost of{" "}
                <strong>{formatMoney(s.details.inductionCapex, curr)}</strong> is included in the CAPEX above.
                {s.needNewCookware && (
                  <span> Your current aluminum pots are not compatible — new cookware cost is included.</span>
                )}
                {!s.needNewCookware && (
                  <span> Your existing cookware should be compatible — verify with a magnet test (magnet sticks = works).</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 6 }}>
                Induction burners last ~6 years in heavy institutional use. Replacement costs are included in the 30-year TCO.
                Scheffler solar thermal does NOT require new cookware — it works with your existing pots.
              </div>
            </div>
          )}

          <div style={{ background: colors.accentLight, borderRadius: 8, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.accent, marginBottom: 8 }}>
              Cooking Tips for Kitchen Staff
            </div>
            {(COOKING_TIPS[s.id] || []).map((tip, i) => (
              <div key={i} style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 6, paddingLeft: 16, position: "relative" }}>
                <span style={{ position: "absolute", left: 0 }}>•</span> {tip}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Schedule compatibility flags */}
      {inputs.meals && (
        <Card>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>Cooking Schedule Notes</h3>
          {inputs.meals.map(m => {
            const mt = MEAL_TIMES[m];
            if (!mt) return null;
            const compatible = mt.solarCompatible;
            return (
              <div key={m} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
                fontSize: 14, borderBottom: `1px solid ${colors.border}`,
              }}>
                <span style={{ fontSize: 18 }}>{compatible ? "☀️" : "🔥"}</span>
                <span><strong>{mt.label}</strong> (~{mt.hour > 12 ? mt.hour - 12 : mt.hour}{mt.hour >= 12 ? "pm" : "am"})</span>
                <span style={{
                  fontSize: 12, padding: "2px 8px", borderRadius: 4, marginLeft: "auto",
                  background: compatible ? colors.successLight : colors.warningLight,
                  color: compatible ? colors.success : colors.warning,
                }}>
                  {compatible ? "Solar compatible" : "Backup fuel needed"}
                </span>
              </div>
            );
          })}
        </Card>
      )}

      {/* Caveats */}
      <Card style={{ background: "#F5F5F0" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: colors.textSecondary }}>
          Important Caveats
        </h3>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: colors.textSecondary }}>
          <p>These figures are estimates based on the information you provided. A vendor site visit is needed for a firm quote.</p>
          <p>Energy costs and fuel prices change over time. Savings figures assume 5% annual fuel price increase.</p>
          <p>Scheffler systems require a trained operator. Budget for operator training in your total cost.</p>
          <p>PV system component lifetimes: panels 30 years, LFP batteries 10 years, inverter 10 years, induction burners 6 years. All replacement costs are included in the 30-year TCO.</p>
          <p>PV solutions require induction cooking equipment. Schools currently using aluminum pots will need new stainless steel or cast iron cookware — this cost is included in PV estimates.</p>
          <p>CO₂ savings figures are indicative. Actual savings depend on fuel displacement achieved.</p>
          <p style={{ marginTop: 8, fontStyle: "italic" }}>
            Several key assumptions (MJ/meal by food type, CAPEX benchmarks, system efficiencies) are placeholders
            awaiting validation with ISC/EWB technical partners. Treat all numbers as directional, not definitive.
          </p>
        </div>
      </Card>

      {/* Vendor placeholder */}
      <Card>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Local Vendors</h3>
        <p style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 12 }}>
          Vendors are pre-vetted by EWB or ISC partners. Contact them for a site-specific quote.
        </p>
        <div style={{ padding: 16, background: colors.primaryLight, borderRadius: 8 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Thermofield Industrial</div>
          <div style={{ fontSize: 13, color: colors.textSecondary }}>
            Scheffler parabolic dishes · Nairobi, Kenya<br />
            +254 (0)721 727 830 · info@thermofield.co.ke · thermofield.co.ke
          </div>
        </div>
        <p style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8, fontStyle: "italic" }}>
          Additional vendors will be added as the database is built out. This is not an endorsement of any specific vendor.
        </p>
      </Card>

      <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
        <Button onClick={() => {
          const text = generateWhatsAppText(results, inputs, lang);
          navigator.clipboard?.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          }).catch(() => {
            // Fallback: create a temporary textarea
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          });
        }} variant="accent">
          {copied ? (lang === "sw" ? "Imenakiliwa! ✓" : "Copied! ✓") : (lang === "sw" ? "Nakili kwa WhatsApp" : "Copy Summary for WhatsApp")}
        </Button>
        <Button onClick={onRestart} variant="secondary">
          {lang === "sw" ? "Anza Tathmini Mpya" : "Start New Assessment"}
        </Button>
      </div>
    </div>
  );
}

// ---------- MAIN APP ----------

const TOTAL_STEPS = 6;

export default function SolutionFinder() {
  const [step, setStep] = useState(0); // 0 = welcome
  const [lang, setLang] = useState("en");
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState({
    country: "",
    region: "",
    ghi: null,
    schoolName: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    studentCount: "",
    staffCount: "",
    schoolType: "boarding",
    attendanceRate: 100,
    meals: ["breakfast", "lunch", "dinner"],
    daysPerWeek: 7,
    schoolWeeks: 38,
    foods: [],
    availableSpace: "",
    shading: "yes",
    kitchenType: "indoor",
    gridConnection: "yes",
    existingSolar: "no",
    electricalNeeds: "some",
    fuelType: "lpg",
    lpgCylinders: "",
    biomassKg: "",
    monthlyFuelCost: "",
    cookingEquipment: "lpg_burners",
    equipmentAge: "2-5",
    potMaterial: "aluminum",
  });
  const [results, setResults] = useState(null);

  const update = useCallback((partial) => {
    setData(prev => ({ ...prev, ...partial }));
  }, []);

  const handleCalculate = () => {
    const r = calculateResults(data);
    setResults(r);
    setStep(7);
  };

  const restart = () => {
    setStep(0);
    setResults(null);
    setData(prev => ({
      ...prev,
      // Keep contact and school info, reset the rest
      studentCount: "", staffCount: "", meals: ["breakfast", "lunch", "dinner"],
      foods: [], availableSpace: "", monthlyFuelCost: "", lpgCylinders: "", biomassKg: "",
    }));
  };

  return (
    <div style={{
      minHeight: "100vh", background: colors.bg,
      fontFamily: "'Source Sans 3', 'Source Sans Pro', -apple-system, sans-serif",
      color: colors.text,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: colors.primaryDark, color: "#fff", padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>☀️</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 0.3 }}>{t("appTitle", lang)}</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{t("appVersion", lang)} · {t("appSubtitle", lang)}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => setLang("en")} style={{
            padding: "4px 10px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)",
            background: lang === "en" ? "rgba(255,255,255,0.2)" : "transparent",
            color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: lang === "en" ? 700 : 400,
          }}>EN</button>
          <button onClick={() => setLang("sw")} style={{
            padding: "4px 10px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.3)",
            background: lang === "sw" ? "rgba(255,255,255,0.2)" : "transparent",
            color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: lang === "sw" ? 700 : 400,
          }}>SW</button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "16px 20px 60px" }}>

        {step === 0 && (
          <div>
            <div style={{ textAlign: "center", padding: "32px 0 24px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>☀️🍳</div>
              <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
                {t("welcomeHeading", lang)}
              </h1>
              <p style={{ fontSize: 15, color: colors.textSecondary, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>
                {t("welcomeBody", lang)}
              </p>
            </div>
            <Card>
              <div style={{ fontSize: 14, lineHeight: 1.7 }}>
                <strong>{t("whatItDoes", lang)}</strong><br />
                {t("whatItDoesBody", lang)}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.7, marginTop: 12 }}>
                <strong>{t("whatItDoesNot", lang)}</strong><br />
                {t("whatItDoesNotBody", lang)}
              </div>
            </Card>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Button onClick={() => setStep(1)} style={{ padding: "14px 40px", fontSize: 17 }}>
                {t("startBtn", lang)}
              </Button>
            </div>
          </div>
        )}

        {step >= 1 && step <= 6 && <ProgressBar step={step} totalSteps={TOTAL_STEPS} />}

        {step === 1 && <StepLocation data={data} onChange={update} onNext={() => setStep(2)} lang={lang} />}
        {step === 2 && <StepHeadcount data={data} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} lang={lang} />}
        {step === 3 && <StepMeals data={data} onChange={update} onNext={() => setStep(4)} onBack={() => setStep(2)} lang={lang} />}
        {step === 4 && <StepMenu data={data} onChange={update} onNext={() => setStep(5)} onBack={() => setStep(3)} lang={lang} />}
        {step === 5 && <StepSite data={data} onChange={update} onNext={() => setStep(6)} onBack={() => setStep(4)} lang={lang} />}
        {step === 6 && <StepFuel data={data} onChange={update} onNext={handleCalculate} onBack={() => setStep(5)} lang={lang} />}

        {step === 7 && results && <ResultsView results={results} inputs={data} onRestart={restart} lang={lang} copied={copied} setCopied={setCopied} />}
      </div>
    </div>
  );
}
