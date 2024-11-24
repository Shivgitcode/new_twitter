import express from "express"
import { getPost, likePost, tweet } from "../controllers/post.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/post",auth, tweet)
router.get("/post",auth, getPost)
router.post("/likes/:postId",auth, likePost)

export { router as postRoutes }
