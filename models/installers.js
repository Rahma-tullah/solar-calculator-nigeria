const db = require("../config/database");

const Installer = {
  // Get all installers (with optional state filter)
  getAll: async (state = null) => {
    try {
      let query = "SELECT * FROM installers";
      let params = [];

      if (state) {
        query += " WHERE state = ?";
        params.push(state);
      }

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get installer by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM installers WHERE installer_id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Create new installer
  create: async (installerData) => {
    try {
      const query = `
      INSERT INTO installers (
        user_id, installer_name, phone_number, email, 
        state, city, full_address, services_offered, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const values = [
        installerData.user_id || null,
        installerData.installer_name,
        installerData.phone_number,
        installerData.email,
        installerData.state,
        installerData.city,
        installerData.full_address || null,
        installerData.services_offered || null,
        installerData.description || null,
      ];

      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Installer;
