"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = __importDefault(require("express"));
const post_js_1 = require("../controllers/post.js");
const router = express_1.default.Router();
exports.postRoutes = router;
router.post("/post", post_js_1.tweet);
router.get("/post", post_js_1.getPost);
router.post("/likes/:userId/:postId", post_js_1.likePost);
