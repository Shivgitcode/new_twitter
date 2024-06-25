import { prisma } from "./user.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
export const createComment = async (req, res, next) => {
    try {
        const image = req.files?.imgFile;
        const postId = req.params.id;
        let response = { secure_url: "" };
        if (typeof image !== "undefined") {
            response = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "commentImg"
            });
        }
        const myResponse = req.body;
        const token = req.cookies.jwt;
        const currUser = jwt.verify(token, process.env.JWT_SECRET);
        const createComment = await prisma.comment.create({
            data: {
                title: myResponse.title,
                commentimg: response.secure_url,
                postId: postId,
                userId: currUser.id
            }
        });
        res.status(200).json({
            data: createComment,
            message: "comment created"
        });
    }
    catch (error) {
        next(error);
    }
};
export const getComments = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id);
        const allComments = await prisma.comment.findMany({
            include: {
                post: true,
                user: true,
            },
            where: {
                postId: id
            }
        });
        res.status(200).send({
            message: "all comments sent",
            data: allComments
        });
    }
    catch (error) {
        next(error);
    }
};
