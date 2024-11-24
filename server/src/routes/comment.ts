import express from "express"
import { createComment, getComments } from "../controllers/comment.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/comment/:id",auth, createComment);
router.get("/comment/:id",auth, getComments)


export { router as commentRouter }