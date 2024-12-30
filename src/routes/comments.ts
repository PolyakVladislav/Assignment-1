import express from "express";
const router = express.Router();
import comments from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/auth_controller";

router.post("/", authMiddleware,(req, res) => {
  comments.createComment(req, res);
});
router.get("/",(req, res) => {
  comments.getAll(req, res);
});

router.get("/:id", (req, res) => {
  comments.getCommentById(req, res);
});
router.put("/:id", (req, res) => {
  comments.updateComment(req, res);
});
router.delete("/:id", authMiddleware,(req, res) => {
  comments.deleteComment(req, res);
});



export default router;
