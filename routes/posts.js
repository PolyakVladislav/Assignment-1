const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Create a new post
router.post("/", async (req, res) => {
  try {
    const { title, content, senderId } = req.body;

    if (!title || !content || !senderId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const post = new Post({ title, content, senderId });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error creating post", error: err.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error getting all posts", error: err.message });
  }
});

// Get a post by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Error getting post by ID", error: err.message });
  }
});

// Get posts by sender ID
router.get("/sender/:senderId", async (req, res) => {
  try {
    const posts = await Post.find({ senderId: req.params.senderId });

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this sender" });
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error getting posts by sender ID", error: err.message });
  }
});

// Update a post
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Error updating post", error: err.message });
  }
});

module.exports = router;
