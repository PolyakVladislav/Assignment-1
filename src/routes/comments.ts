import express from "express";
const router = express.Router();
import comments from "../controllers/comments_controller";

router.post("/", (req, res) => {
  comments.createComment(req, res);
});
router.get("/:postId", (req, res) => {
  comments.getCommentsByPostId(req, res);
});
router.get("/:comment/:id", (req, res) => {
  comments.getCommentById(req, res);
});
router.put("/:id", (req, res) => {
  comments.updateComment(req, res);
});
router.delete("/:id", (req, res) => {
  comments.deleteComment(req, res);
});

export default router;
