import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import expressFileupload from "express-fileupload";
import { router as userRouter } from "./routes/user.js";
import { cloudinaryConfig } from "./cloudinary/config";
import cookieParser from "cookie-parser";
import { postRoutes } from "./routes/post";
import { commentRouter } from "./routes/comment";

dotenv.config();

export const app = express();

cloudinaryConfig();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "PUT", "DELETE"],
    credentials: true,
    origin: "https://new-twitter-client-tau.vercel.app",
  })
);
app.use(
  expressFileupload({
    tempFileDir: "/tmp/",
    useTempFiles: true,
  })
);
app.use("/api/v1", userRouter, postRoutes, commentRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { status = 500, message = "Internal server Error" } = err;
  res.status(status).json({
    message: message,
    err: err.stack,
  });
});
