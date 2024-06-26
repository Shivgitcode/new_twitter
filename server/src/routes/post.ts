import express from "express"
import { getPost, tweet } from "../controllers/post";

const router = express.Router();

router.post("/post", tweet)
router.get("/post", getPost)

export { router as postRoutes }