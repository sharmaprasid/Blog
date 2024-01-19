const TrendingPost = require("../models/trendingPost.model"); // Adjust the path accordingly

// Add a post to the trending posts
const addTrendingPost = async (req, res) => {
  try {
    const { post, score } = req.body;
    const newTrendingPost = await TrendingPost.create({ post, score });
    res.status(201).json(newTrendingPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all trending posts
const getAllTrendingPosts = async (req, res) => {
  try {
    const trendingPosts = await TrendingPost.find().populate("post");
    res.status(200).json(trendingPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update the score of a trending post
const updateTrendingPostScore = async (req, res) => {
  try {
    const { score } = req.body;
    const updatedTrendingPost = await TrendingPost.findByIdAndUpdate(
      req.params.id,
      { score },
      { new: true }
    ).populate("post");
    if (!updatedTrendingPost) {
      return res.status(404).json({ error: "Trending post not found" });
    }
    res.status(200).json(updatedTrendingPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove a post from the trending posts
const removeTrendingPost = async (req, res) => {
  try {
    const removedTrendingPost = await TrendingPost.findByIdAndRemove(
      req.params.id
    ).populate("post");
    if (!removedTrendingPost) {
      return res.status(404).json({ error: "Trending post not found" });
    }
    res.status(204).end(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addTrendingPost,
  getAllTrendingPosts,
  updateTrendingPostScore,
  removeTrendingPost,
};
