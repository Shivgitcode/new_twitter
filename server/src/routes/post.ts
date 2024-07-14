import express from "express"
import { getPost, likePost, tweet } from "../controllers/post";

const router = express.Router();

router.post("/post", tweet)
router.get("/post", getPost)
router.post("/likes/:userId/:postId", likePost)

export { router as postRoutes }
