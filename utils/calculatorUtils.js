// Placeholder pricing constants
// Realistic Nigerian solar pricing (2025)
// Based on market research: ₦600k-₦1.2M per kW for complete systems
const PRICE_PER_KW = 950000; // ₦950,000 per kW (mid-range estimate)
const HYBRID_SYSTEM_MULTIPLIER = 1.5; // 50% more for hybrid (batteries account for 40-60% of cost)
const INSTALLMENT_DURATION_MONTHS = 24; // Standard 2-year payment plan
const INSTALLMENT_INTEREST_RATE = 0.15; // 15% total interest over period
const WATTS_TO_KW_SAFETY_FACTOR = 1.25; // 25% safety buffer for inefficiencies

// Northern states (good sunlight)
const NORTHERN_STATES = [
  "Kano",
  "Kaduna",
  "Katsina",
  "Sokoto",
  "Kebbi",
  "Zamfara",
  "Jigawa",
  "Yobe",
  "Borno",
  "Adamawa",
  "Gombe",
  "Bauchi",
  "Plateau",
  "Nasarawa",
  "Niger",
  "Kwara",
  "Kogi",
  "Benue",
  "FCT",
];

const calculatorUtils = {
  // Determine sunlight quality based on state
  getSunlightQuality: (state) => {
    return NORTHERN_STATES.includes(state) ? "good" : "fair";
  },

  // Calculate recommended system size from power requirement
  calculateSystemSize: (powerRequirementWatts) => {
    const kwNeeded = (powerRequirementWatts / 1000) * WATTS_TO_KW_SAFETY_FACTOR;
    return Math.round(kwNeeded * 100) / 100; // Round to 2 decimal places
  },

  // Calculate total system cost
  calculateTotalCost: (systemSizeKw, systemType) => {
    let cost = systemSizeKw * PRICE_PER_KW;

    if (systemType === "hybrid") {
      cost *= HYBRID_SYSTEM_MULTIPLIER;
    }

    return Math.round(cost);
  },

  // Compare cost to budget
  compareToBudget: (totalCost, budget) => {
    const difference = totalCost - budget;

    if (Math.abs(difference) < 50000) {
      return "Within budget";
    } else if (difference > 0) {
      return `₦${difference.toLocaleString()} over budget`;
    } else {
      return `₦${Math.abs(difference).toLocaleString()} under budget`;
    }
  },

  // Calculate installment details
  calculateInstallments: (totalCost) => {
    const totalWithInterest = totalCost * (1 + INSTALLMENT_INTEREST_RATE);
    const monthlyAmount = totalWithInterest / INSTALLMENT_DURATION_MONTHS;

    return {
      monthlyAmount: Math.round(monthlyAmount),
      duration: INSTALLMENT_DURATION_MONTHS,
      totalPaid: Math.round(totalWithInterest),
    };
  },

  // Calculate grid+fuel comparison
  calculateGridFuelComparison: (
    monthlyNepaBill,
    monthlyFuelCost,
    installmentDuration,
  ) => {
    const monthlyGridFuel = monthlyNepaBill + monthlyFuelCost;
    const totalOverPeriod = monthlyGridFuel * installmentDuration;

    return {
      monthlyGridFuel,
      totalOverPeriod: Math.round(totalOverPeriod),
    };
  },
};

module.exports = calculatorUtils;
