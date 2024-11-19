const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// new post
router.post("/", async (req, res) => {
  try {
    const { title, content, senderId } = req.body;

    const post = new Post({ title, content, senderId });
    await post.save();
    res.json(post);
  } catch (err) {
    res.json({ message: "Error creating post", error: err.message });
  }
});

// get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.json({ message: "Error getting all posts", error: err.message });
  }
});

// get post by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      res.status({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.json({ message: "Id not existed", error: err.message });
  }
});

// get post by sender id
router.get("/sender/:senderId", async (req, res) => {
  try {
    const posts = await Post.find({ senderId: req.params.senderId });

    if (!posts.length) {
      res.status({ message: "Mo posts by this sender" });
    }
    res.json(posts);
  } catch (err) {
    res.json({
      message: "Error getting posts by this sender",
      error: err.message,
    });
  }
});

// update post
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedPost) {
      return res.status({ message: "Post not found" });
    }
    res.json(updatedPost);
  } catch (err) {
    res.json({ message: "Error update", error: err.message });
  }
});
