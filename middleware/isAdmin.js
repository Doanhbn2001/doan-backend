module.exports = (req, res, next) => {
  if (!req.session.adminId) {
    return res.json({ error: true });
  }
  next();
};
