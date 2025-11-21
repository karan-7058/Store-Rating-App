function requireStoreOwner(req, res, next) {
  if (!req.session.user || req.session.user.role_id !== 3) 
    return res.status(403).json({ error: "Forbidden: Store owner only" });
  next();
  
};

module.exports = requireStoreOwner;
