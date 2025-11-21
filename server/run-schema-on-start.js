// run-schema-on-start.js - execute the SQL file once from Node (optional)
// Usage: node run-schema-on-start.js
const fs = require('fs');
const path = require('path');
const pool = require('./db');
require('dotenv').config();

async function ensureSchema() {
  const file = path.join(__dirname, 'sql', 'create_schema_if_not_exists.sql');
  if (!fs.existsSync(file)) {
    console.error('Schema file not found:', file);
    process.exit(1);
  }
  const sql = fs.readFileSync(file, 'utf8');
  const conn = await pool.getConnection();
  try {
    console.log('Running schema SQL...');
    await conn.query(sql);
    console.log('Schema ensured.');
  } catch (err) {
    console.error('Error running schema:', err);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
}

ensureSchema();