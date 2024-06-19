import { NextFunction } from "express";
import { Request, Response } from "express";
import { prisma } from "./user.js";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import fileUpload, { UploadedFile } from "express-fileupload";
import { v2 as cloudinary } from "cloudinary"

dotenv.config()
type User = {
    id: string,
    title: string,
    postimg?: string,
    userId: string

}

export const tweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const image = req.files?.imgFile as UploadedFile
        let response = { secure_url: "" }
        if (typeof image !== "undefined") {
            response = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "postimages"
            })


        }
        console.log(image)


        const myRequest: User = req.body;
        const token = req.cookies.jwt as string
        const foundUser = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

        const newPost = await prisma.post.create({
            data: {
                title: myRequest.title,
                userId: foundUser.id as string,
                postimg: response.secure_url,


            }
        })

        res.status(200).json({
            data: newPost,
            message: "Post created successfully"
        })

    } catch (error) {
        next(error)

    }


}

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
    const allPost = await prisma.post.findMany({
        include: {
            user: true,
            comments: true
        }
    });
    res.status(200).json({
        data: allPost,
        message: "all post send"
    })
}