import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import expressFileupload from "express-fileupload"
import { router as userRouter } from "./routes/user"
import { cloudinaryConfig } from "./cloudinary/config"
import cookieParser from "cookie-parser"
import { postRoutes } from "./routes/post"
import { commentRouter } from "./routes/comment"

dotenv.config()

const app = express()
const port = process.env.PORT || 7000

cloudinaryConfig()

app.use(cors({
    methods: ["GET", "POST", "DELETE", "PUT", "DELETE"],
    credentials: true,
    origin: "http://localhost:5173"

}))
app.use(cookieParser())
app.use(express.json())
app.use(expressFileupload({
    tempFileDir: "/temp/",
    useTempFiles: true
}))
app.use("/api/v1", userRouter, postRoutes, commentRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello")
})



app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const { status = 500, message = "Internal server Error" } = err
    res.status(status).json({
        message: message
    })


})



app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

