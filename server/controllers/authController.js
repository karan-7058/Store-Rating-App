const bcrypt = require('bcrypt');
const pool = require('../db');


exports.signup = async (req, res, next) => {
  const { email, password, name, role_id } = req.body;

  if (!email || !password || !role_id)
    return res.status(400).json({ error: "Missing required fields" });

  // 🚫 block admin registration
  if (![2, 3].includes(Number(role_id)))
    return res.status(400).json({ error: "Invalid role" });

  const conn = await pool.getConnection();

  try {
    const [existing] = await conn.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length)
      return res.status(400).json({ error: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 10);

    // 👇 role_id is NOW saved
    const [result] = await conn.query(
      "INSERT INTO users (email, password_hash, name, role_id) VALUES (?, ?, ?, ?)",
      [email, password_hash, name || null, Number(role_id)]
    );

     res.json({
      message: "Signup successful. Please login."
    });

  

  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
};



exports.login=async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT id, email, password_hash, name, role_id FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    req.session.user = { id: user.id, email: user.email, name: user.name, role_id: user.role_id };
    res.json({ user: req.session.user });
  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
};




exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }

    res.clearCookie("connect.sid"); // IMPORTANT
    res.json({ ok: true });
  });
};



exports.getMe = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ user: null });
  }

  res.json({ user: req.session.user });
};
