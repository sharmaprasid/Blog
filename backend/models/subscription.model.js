const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  frequency: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
