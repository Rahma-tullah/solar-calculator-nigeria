const db = require("../config/database");

const Calculation = {
  // Create a new calculation
  create: async (calculationData) => {
    try {
      const query = `
        INSERT INTO calculations (
          user_id, state, city, monthly_nepa_bill, monthly_fuel_cost,
          equipment_list, system_type, budget, payment_preference, has_space,
          sunlight_quality, estimated_total_cost, budget_comparison,
          recommended_system_size_kw, total_power_requirement_watts,
          monthly_installment_amount, installment_duration_months,
          total_paid_for_solar, current_monthly_grid_fuel_cost,
          total_grid_fuel_cost_over_same_period
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        calculationData.user_id || null,
        calculationData.state,
        calculationData.city,
        calculationData.monthly_nepa_bill,
        calculationData.monthly_fuel_cost,
        calculationData.equipment_list,
        calculationData.system_type,
        calculationData.budget,
        calculationData.payment_preference,
        calculationData.has_space,
        calculationData.sunlight_quality,
        calculationData.estimated_total_cost,
        calculationData.budget_comparison,
        calculationData.recommended_system_size_kw,
        calculationData.total_power_requirement_watts,
        calculationData.monthly_installment_amount,
        calculationData.installment_duration_months,
        calculationData.total_paid_for_solar,
        calculationData.current_monthly_grid_fuel_cost,
        calculationData.total_grid_fuel_cost_over_same_period,
      ];

      const [result] = await db.query(query, values);
      return result.insertId; // Return the ID of newly created calculation
    } catch (error) {
      throw error;
    }
  },

  // Get calculation by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM calculations WHERE calculation_id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  // Get all calculations for a specific user
  getByUserId: async (userId) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM calculations WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Calculation;
