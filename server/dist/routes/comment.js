"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const comment_js_1 = require("../controllers/comment.js");
const auth_js_1 = require("../middleware/auth.js");
const router = express_1.default.Router();
exports.commentRouter = router;
router.post("/comment/:id", auth_js_1.auth, comment_js_1.createComment);
router.get("/comment/:id", auth_js_1.auth, comment_js_1.getComments);
