const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  likes: Number,
  dislikes: Number,
  reported: Boolean,
  moderated: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
