const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const jwtUtils = require("../utils/jwt");
const emailUtils = require("../utils/emailVerification");
const twofactorUtils = require("../utils/twofactor");
const passport = require("../utils/passport");
const crypto = require("crypto");

async function register(req, res) {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const verificationToken = jwtUtils.generateVerificationToken(newUser);
    const verificationLink = `http://localhost:3000/api/auth/user/verify/${verificationToken}`;
    await emailUtils.sendVerificationEmail(newUser, verificationLink);

    res.status(200).json({
      message: "User registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function verifyEmail(req, res) {
  try {
    const user = req.user;

    user.verified = true;

    await user.save();

    res.json({ message: "Email verification successful. You can now log in." });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function enableTwoFactor(req, res) {
  try {
    const { username } = req.user;
    console.log(username);
    const user = await User.findOne({ username });

    if (user.twofactorSecret) {
      return res
        .status(400)
        .json({ message: "Two-factor authentication is already enabled" });
    }

    const twofactorSecret = twofactorUtils.generateTwoFactorSecret();
    user.twofactorSecret = twofactorSecret;

    await user.save();
    const qrCodeImage = await twofactorUtils.generateQRCode(
      twofactorSecret,
      user.username,
      "BLOGPROJECT"
    );

    res.json({
      twofactorSecret,
      qrCodeImage,
      message: "Two-factor authentication enabled successfully",
    });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
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

    if (!user.verified) {
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
    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save();

    res.cookie("Authorization", accessToken, {
      httpOnly: true,
      secure: true,
    });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
async function logout(req, res) {
  try {
    res.cookie("Authorization", "", {
      expires: new Date(0),
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ message: "Cookie Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.secretKey, (err, user) => {
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
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `http://localhost:3000/api/user/auth/reset-password/${resetToken}`;
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
  enableTwoFactor,
  logout,
};
