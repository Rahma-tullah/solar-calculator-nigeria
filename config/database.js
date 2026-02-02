const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

let pool;

// Use DATABASE_URL if available (Railway), otherwise use individual vars (local)
if (process.env.DATABASE_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

const promisePool = pool.promise();

module.exports = promisePool;
