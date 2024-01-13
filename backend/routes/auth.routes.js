const express = require("express");
const passport = require("../utils/passportUtils");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const twofactorMiddleware = require("../middleware/twofactorMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.get(
  "/verify/:verificationToken",
  authMiddleware.authenticateVerificationToken,
  authController.verifyEmail
);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/login/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/user/profile");
  }
);

router.post(
  "/refresh-token",
  authMiddleware.authenticateToken,
  authController.refreshToken
);

router.post(
  "/login/twofactor",
  twofactorMiddleware.authenticateTwoFactor,
  authController.login
);

module.exports = router;
