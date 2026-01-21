const aiService = require("../services/aiService");
const Calculation = require("../models/calculations");
const calculatorUtils = require("../utils/calculatorUtils");

const calculationController = {
  // Create new calculation
  createCalculation: async (req, res) => {
    try {
      // Get user inputs from request body
      const {
        state,
        city,
        monthly_nepa_bill,
        monthly_fuel_cost,
        equipment_list,
        system_type,
        budget,
        payment_preference,
        has_space,
      } = req.body;

      // Validate required fields
      if (
        !state ||
        !city ||
        !monthly_nepa_bill ||
        !monthly_fuel_cost ||
        !equipment_list ||
        !system_type ||
        !budget ||
        !payment_preference ||
        has_space === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // TODO: Call AI API to analyze equipment_list
      // Call AI to analyze equipment list
      const aiAnalysis = await aiService.analyzeEquipment(equipment_list);
      const total_power_requirement_watts = aiAnalysis.totalWatts;

      // Perform calculations using utility functions
      const sunlight_quality = calculatorUtils.getSunlightQuality(state);
      const recommended_system_size_kw = calculatorUtils.calculateSystemSize(
        total_power_requirement_watts
      );
      const estimated_total_cost = calculatorUtils.calculateTotalCost(
        recommended_system_size_kw,
        system_type
      );
      const budget_comparison = calculatorUtils.compareToBudget(
        estimated_total_cost,
        budget
      );

      // Calculate installment details (if applicable)
      let monthly_installment_amount = null;
      let installment_duration_months = null;
      let total_paid_for_solar = null;
      let total_grid_fuel_cost_over_same_period = null;

      if (payment_preference === "installment") {
        const installmentDetails =
          calculatorUtils.calculateInstallments(estimated_total_cost);
        monthly_installment_amount = installmentDetails.monthlyAmount;
        installment_duration_months = installmentDetails.duration;
        total_paid_for_solar = installmentDetails.totalPaid;

        // Calculate grid+fuel cost over same period
        const gridFuelComparison = calculatorUtils.calculateGridFuelComparison(
          monthly_nepa_bill,
          monthly_fuel_cost,
          installment_duration_months
        );
        total_grid_fuel_cost_over_same_period =
          gridFuelComparison.totalOverPeriod;
      }

      // Calculate current monthly grid+fuel cost
      const current_monthly_grid_fuel_cost =
        monthly_nepa_bill + monthly_fuel_cost;

      // Prepare data for database
      const calculationData = {
        user_id: req.user ? req.user.user_id : null, // Use user_id if logged in
        state,
        city,
        monthly_nepa_bill,
        monthly_fuel_cost,
        equipment_list,
        system_type,
        budget,
        payment_preference,
        has_space,
        sunlight_quality,
        estimated_total_cost,
        budget_comparison,
        recommended_system_size_kw,
        total_power_requirement_watts,
        monthly_installment_amount,
        installment_duration_months,
        total_paid_for_solar,
        current_monthly_grid_fuel_cost,
        total_grid_fuel_cost_over_same_period,
      };

      // Save to database
      const calculation_id = await Calculation.create(calculationData);

      // Fetch the saved calculation to return
      const savedCalculation = await Calculation.getById(calculation_id);

      // Return response
      res.status(201).json({
        success: true,
        message: "Calculation completed successfully",
        data: savedCalculation,
      });
    } catch (error) {
      console.error("Calculation error:", error);
      res.status(500).json({
        success: false,
        message: "Error processing calculation",
        error: error.message,
      });
    }
  },

  // Get calculation by ID
  getCalculationById: async (req, res) => {
    try {
      const { id } = req.params;

      const calculation = await Calculation.getById(id);

      if (!calculation) {
        return res.status(404).json({
          success: false,
          message: "Calculation not found",
        });
      }

      res.status(200).json({
        success: true,
        data: calculation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching calculation",
        error: error.message,
      });
    }
  },
  // Get all calculations for current user
  getUserCalculations: async (req, res) => {
    try {
      // req.user is set by auth middleware
      const calculations = await Calculation.getByUserId(req.user.user_id);

      res.status(200).json({
        success: true,
        count: calculations.length,
        data: calculations,
      });
    } catch (error) {
      console.error("Get user calculations error:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching calculations",
        error: error.message,
      });
    }
  },
};

module.exports = calculationController;
