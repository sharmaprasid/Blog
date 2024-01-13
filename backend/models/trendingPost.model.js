const mongoose = require("mongoose");

const trendingPostSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" },
  score: Number,
  calculatedAt: { type: Date, default: Date.now },
});

const TrendingPost = mongoose.model("TrendingPost", trendingPostSchema);

module.exports = TrendingPost;
