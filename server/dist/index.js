import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import expressFileupload from "express-fileupload";
import { router as userRouter } from "./routes/user.js";
import { cloudinaryConfig } from "./cloudinary/config.js";
import cookieParser from "cookie-parser";
import { postRoutes } from "./routes/post.js";
import { commentRouter } from "./routes/comment.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
cloudinaryConfig();
app.use(cors({
    methods: ["GET", "POST", "DELETE", "PUT", "DELETE"],
    credentials: true,
    origin: "https://new-twitter-client-six.vercel.app"
}));
app.use(cookieParser());
app.use(express.json());
app.use(expressFileupload({
    tempFileDir: "/temp/",
    useTempFiles: true
}));
app.use("/api/v1", userRouter, postRoutes, commentRouter);
app.get("/", (req, res) => {
    res.send("Hello");
});
app.use((err, req, res, next) => {
    const { status = 500, message = "Internal server Error" } = err;
    res.status(status).json({
        message: message
    });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
