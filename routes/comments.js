const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");


// new comment
router.post("/", async (req, res) => {
  try {
    const { postId, content, author } = req.body;

    if (!postId || !content || !author) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const comment = new Comment({ postId, content, author });
    await comment.save();
    res.status(201).json(comment); 
  } catch (err) {
    res.status(500).json({ message: "Error creating comment", error: err.message });
  }
});


// get all posts
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const comments = await Comment.find({ postId });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error getting all comments", error: err.message });
  }
});



// get comment by id
router.get("/comment/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Comment ID is required" });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Error getting comment by ID", error: err.message });
  }
});


// update comment
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!id || !content) {
      return res.status(400).json({ message: "Comment ID and content are required" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: "Error updating comment", error: err.message });
  }
});


//delete comment
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Comment ID is required" });
    }

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully", deletedComment });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
});

module.exports = router;
