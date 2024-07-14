"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
exports.router = router;
router.post("/signup", user_1.signup);
router.post("/login", user_1.login);
router.post("/logout", user_1.logout);
router.get("/users", user_1.getUser);
