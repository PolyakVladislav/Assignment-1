import express from "express";
const router = express.Router();
import Post from "../controllers/posts_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.post("/", authMiddleware,(req, res) => {
  Post.createPost(req, res);
});
router.get("/", Post.getAllPosts);
router.get("/:id", (req, res) => {
  Post.getPostById(req, res);
});
router.get("/sender/:senderId", (req, res) => {
  Post.getPostsBySenderId(req, res);
});
router.put("/:id",authMiddleware ,(req, res) => {
  Post.updatePost(req, res);
});

export default router;
