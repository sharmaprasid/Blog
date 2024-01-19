const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile", authMiddleware.authenticateToken, (req, res) => {
  const { username } = req.user;
  res.json({ message: `Welcome, ${username}! This is your profile.` });
});

router.get("/admin-profile", authMiddleware.authenticateToken, (req, res) => {
  const { username } = req.user;
  res.json({ message: `welcome, to admin dashboard ${username}` });
});
module.exports = router;
