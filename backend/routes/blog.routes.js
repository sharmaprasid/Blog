const express = require("express");
const router = express.Router();
const blogPostController = require("../controller/blogpost.controller");

// Create a new blog post
router.post("/blog-posts", blogPostController.createBlogPost);

// Get all blog posts
router.get("/blog-posts", blogPostController.getAllBlogPosts);

// Get a specific blog post by ID
router.get("/blog-posts/:id", blogPostController.getBlogPostById);

// Update a blog post by ID
router.put("/blog-posts/:id", blogPostController.updateBlogPostById);

// Delete a blog post by ID
router.delete("/blog-posts/:id", blogPostController.deleteBlogPostById);

module.exports = router;
