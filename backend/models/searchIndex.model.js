const mongoose = require("mongoose");

const searchIndexSchema = new mongoose.Schema({
  keyword: String,
  post: { type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" },
  createdAt: { type: Date, default: Date.now },
});

const SearchIndex = mongoose.model("SearchIndex", searchIndexSchema);

module.exports = SearchIndex;
