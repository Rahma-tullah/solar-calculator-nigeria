const db = require("../config/database");

const User = {
  // Create a new user
  create: async (userData) => {
    try {
      const query = `
  INSERT INTO users (email, password_hash, full_name, phone_number, role)
  VALUES (?, ?, ?, ?, ?)
`;

      const values = [
        userData.email,
        userData.password_hash,
        userData.full_name || null,
        userData.phone_number || null,
        userData.role || "customer",
      ];

      const [result] = await db.query(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Find user by email
  findByEmail: async (email) => {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows[0]; // Returns undefined if not found
    } catch (error) {
      throw error;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const [rows] = await db.query(
        "SELECT user_id, email, full_name, phone_number, created_at FROM users WHERE user_id = ?",
        [id]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  update: async (userId, userData) => {
    try {
      const query = `
        UPDATE users 
        SET full_name = ?, phone_number = ?
        WHERE user_id = ?
      `;

      await db.query(query, [
        userData.full_name,
        userData.phone_number,
        userId,
      ]);

      return true;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = User;
