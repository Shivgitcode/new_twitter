"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = __importDefault(require("express"));
const post_1 = require("../controllers/post");
const router = express_1.default.Router();
exports.postRoutes = router;
router.post("/post", post_1.tweet);
router.get("/post", post_1.getPost);
router.post("/likes/:userId/:postId", post_1.likePost);
