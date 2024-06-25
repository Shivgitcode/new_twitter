import { prisma } from "./user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
export const tweet = async (req, res, next) => {
    try {
        const image = req.files?.imgFile;
        let response = { secure_url: "" };
        if (typeof image !== "undefined") {
            response = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "postimages"
            });
        }
        console.log(image);
        const myRequest = req.body;
        const token = req.cookies.jwt;
        const foundUser = jwt.verify(token, process.env.JWT_SECRET);
        const newPost = await prisma.post.create({
            data: {
                title: myRequest.title,
                userId: foundUser.id,
                postimg: response.secure_url,
            }
        });
        res.status(200).json({
            data: newPost,
            message: "Post created successfully"
        });
    }
    catch (error) {
        next(error);
    }
};
export const getPost = async (req, res, next) => {
    const allPost = await prisma.post.findMany({
        include: {
            user: true,
            comments: true
        }
    });
    res.status(200).json({
        data: allPost,
        message: "all post send"
    });
};
