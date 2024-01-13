const mongoose = require("mongoose");

const featuredPostSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" },
  priority: Number,
  createdAt: { type: Date, default: Date.now },
});

const FeaturedPost = mongoose.model("FeaturedPost", featuredPostSchema);

module.exports = FeaturedPost;
