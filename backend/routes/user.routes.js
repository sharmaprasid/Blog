const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile", authMiddleware.authenticateToken, (req, res) => {
  const { username } = req.user;
  res.json({ message: `Welcome, ${username}! This is your profile.` });
});

module.exports = router;
