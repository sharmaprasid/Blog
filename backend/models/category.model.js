const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
