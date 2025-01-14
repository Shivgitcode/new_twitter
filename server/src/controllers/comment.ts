import { NextFunction, Response, Request } from "express";
import { prisma } from "../db";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UploadedFile } from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const image = req.files?.imgFile as UploadedFile;
    const postId = req.params.id;
    let response = { secure_url: "" };
    if (typeof image !== "undefined") {
      response = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "commentImg",
      });
    }
    const myResponse = req.body;
    const token = req.cookies.jwt;
    const currUser = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const createComment = await prisma.comment.create({
      data: {
        title: myResponse.title,
        commentimg: response.secure_url,
        postId: postId,
        userId: currUser.id,
      },
    });

    res.status(200).json({
      data: createComment,
      message: "comment created",
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log(id);

    const allComments = await prisma.comment.findMany({
      include: {
        post: true,
        user: true,
      },
      where: {
        postId: id,
      },
    });

    res.status(200).send({
      message: "all comments sent",
      data: allComments,
    });
  } catch (error) {
    next(error);
  }
};
