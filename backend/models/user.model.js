const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  bio: String,
  avatar: String,
  role: { type: String, enum: ["admin", "author", "user"], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  verified: Boolean,
  lastLogin: Date,
  socialLinks: Object,
  preferences: Object,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
