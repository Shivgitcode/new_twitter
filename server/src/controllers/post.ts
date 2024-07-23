import { NextFunction } from "express";
import { Request, Response } from "express";
import { prisma } from "./user";
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import fileUpload, { UploadedFile } from "express-fileupload";
import { v2 as cloudinary } from "cloudinary"
import { client } from "../redis";

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
        console.log(foundUser)

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
        await client.del("posts")

    } catch (error) {
        next(error)

    }


}

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
    const cacheValue = await client.get("posts")


    if (cacheValue) {
        return res.status(200).json({
            data: JSON.parse(cacheValue),
            message: "all post send"
        })
    }
    const allPost = await prisma.post.findMany({
        include: {
            user: true,
            comments: true

        }

    });

    await client.set("posts", JSON.stringify(allPost))
    res.status(200).json({
        data: allPost,
        message: "all post send"
    })
}

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, postId } = req.params;
        const { likes: userLike } = req.body
        const post = await prisma.post.findFirst({
            where: {
                id: postId

            }
        })
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        })

        let likes = post?.likedBy
        const totalLikes = likes?.length
        const postsLikedByUser = user?.likedPost
        const isLiked = likes?.find((el) => el === userId)
        console.log(isLiked)
        if (!isLiked) {
            likes?.push(userId);
            const updatedPost = await prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    likedBy: likes,
                    likes: userLike


                }
            })
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    likedPost: [...postsLikedByUser as string[], postId]
                }
            })
            res.status(200).json({
                message: "post updated",
                data: updatedPost
            })

        }
        else {
            likes = likes?.filter(el => el !== userId)
            const updatedPost = await prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    likedBy: likes
                }

            })
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    likedPost: postsLikedByUser?.filter(el => el !== postId)
                }
            })
            res.status(200).json({
                message: "post unliked",
                data: updatedPost
            })
        }
    }
    catch (error) {
        next(error)
    }

}