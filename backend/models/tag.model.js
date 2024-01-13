const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: String,
  slug: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
