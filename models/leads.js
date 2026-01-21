const db = require("../config/database");

const Lead = {
  // Create a new lead
  create: async (leadData) => {
    try {
      const query = `
        INSERT INTO leads (user_id, installer_id, calculation_id, message, status)
        VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        leadData.user_id,
        leadData.installer_id,
        leadData.calculation_id || null,
        leadData.message || null,
        "pending",
      ];

      const [result] = await db.query(query, values);
      return result.insertId;
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
  // Get lead by ID
  getById: async (id) => {
    try {
      const query = `
        SELECT 
          l.*,
          u.full_name as user_name,
          u.email as user_email,
          u.phone_number as user_phone,
          i.installer_name,
          i.email as installer_email
        FROM leads l
        JOIN users u ON l.user_id = u.user_id
        JOIN installers i ON l.installer_id = i.installer_id
        WHERE l.lead_id = ?
      `;

      const [rows] = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Get all leads for a user
  getByUserId: async (userId) => {
    try {
      const query = `
        SELECT 
          l.*,
          i.installer_name,
          i.phone_number as installer_phone,
          i.email as installer_email
        FROM leads l
        JOIN installers i ON l.installer_id = i.installer_id
        WHERE l.user_id = ?
        ORDER BY l.created_at DESC
      `;

      const [rows] = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get all leads for an installer
  getByInstallerId: async (installerId) => {
    try {
      const query = `
        SELECT 
          l.*,
          u.full_name as user_name,
          u.email as user_email,
          u.phone_number as user_phone,
          c.state,
          c.city,
          c.equipment_list,
          c.recommended_system_size_kw
        FROM leads l
        JOIN users u ON l.user_id = u.user_id
        LEFT JOIN calculations c ON l.calculation_id = c.calculation_id
        WHERE l.installer_id = ?
        ORDER BY l.created_at DESC
      `;

      const [rows] = await db.query(query, [installerId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Update lead status
  updateStatus: async (leadId, status) => {
    try {
      await db.query("UPDATE leads SET status = ? WHERE lead_id = ?", [
        status,
        leadId,
      ]);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Lead;
