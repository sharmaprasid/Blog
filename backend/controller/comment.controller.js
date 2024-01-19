const Comment = require("./path-to-your-Comment-model"); // Adjust the path accordingly

// Create a new comment
const createComment = async (req, res) => {
  try {
    const newComment = await Comment.create(req.body);
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all comments for a specific blog post
const getAllCommentsForPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId }).populate("author");
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a comment by ID
const updateCommentById = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("author");

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a comment by ID
const deleteCommentById = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndRemove(
      req.params.id
    ).populate("author");

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(204).end(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a reply to a comment
const createReply = async (req, res) => {
  try {
    const newReply = await Comment.create(req.body);
    res.status(201).json(newReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all replies for a specific comment
const getAllRepliesForComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const replies = await Comment.find({ replyTo: commentId }).populate(
      "author"
    );
    res.status(200).json(replies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a reply by ID
const updateReplyById = async (req, res) => {
  try {
    const updatedReply = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("author");

    if (!updatedReply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    res.status(200).json(updatedReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a reply by ID
const deleteReplyById = async (req, res) => {
  try {
    const deletedReply = await Comment.findByIdAndRemove(
      req.params.id
    ).populate("author");

    if (!deletedReply) {
      return res.status(404).json({ error: "Reply not found" });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createComment,
  getAllCommentsForPost,
  updateCommentById,
  deleteCommentById,
  createReply,
  getAllRepliesForComment,
  updateReplyById,
  deleteReplyById,
};
