import express from "express"
import { getPost, likePost, tweet } from "../controllers/post.js";

const router = express.Router();

router.post("/post", tweet)
router.get("/post", getPost)
router.post("/likes/:postId", likePost)

export { router as postRoutes }
