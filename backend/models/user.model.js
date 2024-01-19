const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  firstName: String,
  lastName: String,
  bio: String,
  avatar: String,
  role: {
    type: String,
    enum: ["admin", "author", "user"],
    required: true,
    default: "user", // Default role for email/password users
  },
  refreshToken: String,
  twofactorSecret: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,

  verified: {
    type: Boolean,
    default: false,
  },
  lastLogin: Date,
  socialLinks: Object,
  preferences: Object,

  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  googleAccessToken: String,
  googleRefreshToken: String,
  googleProfile: Object,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
