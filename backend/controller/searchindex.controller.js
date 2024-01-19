const SearchIndex = require("../models/searchIndex.model"); // Adjust the path accordingly

// Add a keyword-post pair to the search index
const addToSearchIndex = async (req, res) => {
  try {
    const { keyword, post } = req.body;
    const newSearchEntry = await SearchIndex.create({ keyword, post });
    res.status(201).json(newSearchEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Search for posts based on a keyword
const searchPostsByKeyword = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const searchResults = await SearchIndex.find({ keyword }).populate("post");
    res.status(200).json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove entries from the search index based on post ID
const removeFromSearchIndex = async (req, res) => {
  try {
    const removedEntry = await SearchIndex.findOneAndRemove({
      post: req.params.postId,
    });
    if (!removedEntry) {
      return res
        .status(404)
        .json({ error: "Entry not found in the search index" });
    }
    res.status(204).end(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addToSearchIndex,
  searchPostsByKeyword,
  removeFromSearchIndex,
};
