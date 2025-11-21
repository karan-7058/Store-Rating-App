function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role_id !== 1) return res.status(403).json({ error: 'Forbidden' });
  next();
}
module.exports = requireAdmin;