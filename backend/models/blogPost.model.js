const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [String],
  featuredImage: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  published: Boolean,
  excerpt: String,
  readTime: Number,
  views: Number,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  reactions: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  featured: Boolean,
  trendingScore: Number,
  sentimentAnalysis: Object,
  keyPhrases: [String],
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = BlogPost;
