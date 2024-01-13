const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwtUtils = require("../utils/jwt");
const emailUtils = require("../utils/emailUtils");
const twofactorUtils = require("../utils/twofactorUtils");
const config = require("../config/config");
const passport = require("../utils/passportUtils");
const crypto = require("crypto");

async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const verificationToken = jwtUtils.generateVerificationToken(newUser);
    await emailUtils.sendVerificationEmail(newUser, verificationToken);

    res.status(201).json({
      message: "User registered successfully. Verification email sent.",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function verifyEmail(req, res) {
  try {
    const user = req.user;
    user.isVerified = true;
    await user.save();
    res.json({ message: "Email verification successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function login(req, res) {
  try {
    const { username, password, token } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Email not verified. Check your inbox." });
    }

    const accessToken = jwtUtils.generateAccessToken(user);
    const refreshToken = jwtUtils.generateRefreshToken(user);

    if (user.twofactorSecret && !token) {
      return res.json({
        message: "Two-factor authentication required",
        requiresTwoFactor: true,
      });
    }

    if (user.twofactorSecret && token) {
      const isValid = twofactorUtils.verifyTwoFactorToken(
        user.twofactorSecret,
        token
      );

      if (!isValid) {
        return res
          .status(401)
          .json({ message: "Invalid two-factor authentication token" });
      }
    }

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, config.secretKey, (err, user) => {
      if (err) return res.sendStatus(403);

      const accessToken = jwtUtils.generateAccessToken(user);
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    const resetLink = `http://localhost:3000/auth/reset-password/${resetToken}`;
    await emailUtils.sendResetPasswordEmail(user, resetLink);

    res.json({ message: "Password reset link sent to your email address" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  register,
  verifyEmail,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
};
