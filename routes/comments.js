const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// new comment
router.post("/", async (req, res) => {
  try {
    const { postId, content, author } = req.body;

    const comment = new Comment({ postId, content, author });
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.json({ message: "Error creating comment", error: err.message });
  }
});

// get all posts
router.get("/:id", async (req, res) => {
  try {
    const  postId = req.params.id; 
    const comments = await Comment.find({ postId }); 
    res.json(comments);
  } catch (err) {
    res.json({ message: "Error getting all comments", error: err.message });
  }
});

// get comment by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      res.status({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (err) {
    res.json({ message: "Id not existed", error: err.message });
  }
});


// update comment
router.put("/:id", async (req, res) => {
  try {
    const { content } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    if (!updatedComment) {
      return res.status({ message: "Comment not found" });
    }
    res.json(updatedComment);
  } catch (err) {
    res.json({ message: "Error update", error: err.message });
  }
});

//delete comment
router.delete("/:id", async (req, res) => {
    try {
      const id  = req.params.id;
      const deleteComment = await Comment.findOneAndDelete({_id:id});
      if (!deleteComment) {
        return res.status({ message: "Comment not found" });
      }
      res.json(deleteComment);
    } catch (err) {
      res.json({ message: "Error delete", error: err.message });
    }
  });
module.exports = router;