const FeaturedPost = require("../models/featuredPost.model"); // Adjust the path accordingly

// Add a blog post to the featured posts
const addFeaturedPost = async (req, res) => {
  try {
    const { post, priority } = req.body;
    const newFeaturedPost = await FeaturedPost.create({ post, priority });
    res.status(201).json(newFeaturedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all featured posts
const getAllFeaturedPosts = async (req, res) => {
  try {
    const featuredPosts = await FeaturedPost.find().populate("post");
    res.status(200).json(featuredPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update the priority of a featured post
const updateFeaturedPostPriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const updatedFeaturedPost = await FeaturedPost.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    ).populate("post");
    if (!updatedFeaturedPost) {
      return res.status(404).json({ error: "Featured post not found" });
    }
    res.status(200).json(updatedFeaturedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove a blog post from the featured posts
const removeFeaturedPost = async (req, res) => {
  try {
    const removedFeaturedPost = await FeaturedPost.findByIdAndRemove(
      req.params.id
    ).populate("post");
    if (!removedFeaturedPost) {
      return res.status(404).json({ error: "Featured post not found" });
    }
    res.status(204).end(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addFeaturedPost,
  getAllFeaturedPosts,
  updateFeaturedPostPriority,
  removeFeaturedPost,
};
