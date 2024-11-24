import express from "express"
import { checkUser, getUser, login, logout, signup } from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/users", getUser)
router.get("/check",auth,checkUser)

export { router }