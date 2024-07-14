"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRouter = void 0;
const express_1 = __importDefault(require("express"));
const comment_1 = require("../controllers/comment");
const router = express_1.default.Router();
exports.commentRouter = router;
router.post("/comment/:id", comment_1.createComment);
router.get("/comment/:id", comment_1.getComments);
