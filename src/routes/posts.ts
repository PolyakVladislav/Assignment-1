import express from "express";
const router = express.Router();
import Post from "../controllers/posts_controller";

router.post("/", (req, res) => {
  Post.createPost(req, res);
});
router.get("/", Post.getAllPosts);
router.get("/:id", (req, res) => {
  Post.getPostById(req, res);
});
router.get("/sender/:senderId", (req, res) => {
  Post.getPostsBySenderId(req, res);
});
router.put("/:id", (req, res) => {
  Post.updatePost(req, res);
});

export default router;
