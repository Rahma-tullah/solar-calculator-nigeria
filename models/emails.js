const db = require("../config/database");

const Email = {
  // Create a new email record
  create: async (emailData) => {
    try {
      const query = `
        INSERT INTO email_results (
          calculation_id, recipient_email, recipient_name, email_status, sent_at
        ) VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        emailData.calculation_id,
        emailData.recipient_email,
        emailData.recipient_name || null,
        emailData.email_status,
        emailData.sent_at || null,
      ];

      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Update email status
  updateStatus: async (emailId, status, sentAt = null) => {
    try {
      const query = `
        UPDATE email_results 
        SET email_status = ?, sent_at = ?
        WHERE email_id = ?
      `;

      await db.query(query, [status, sentAt, emailId]);
    } catch (error) {
      throw error;
    }
  },

  // Get emails for a calculation
  getByCalculationId: async (calculationId) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM email_results WHERE calculation_id = ?",
        [calculationId]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Email;
