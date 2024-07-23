import express from "express";
import { createComment, getComments } from "../../controllers/comment.js";
const router = express.Router();
router.post("/comment/:id", createComment);
router.get("/comment/:id", getComments);
export { router as commentRouter };
