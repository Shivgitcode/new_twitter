import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../db";
import dotenv from "dotenv";
import fileUpload, { UploadedFile } from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import { client } from "../redis";

dotenv.config();
type User = {
  id: string;
  title: string;
  postimg?: string;
  userId: string;
};

export const tweet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const image = req.files?.imgFile as UploadedFile;
    let response = { secure_url: "" };
    if (typeof image !== "undefined") {
      response = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "postimages",
      });
    }
    console.log(image);

    const myRequest: User = req.body;
    const token = req.cookies.jwt as string;

    const foundUser = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    console.log(foundUser);

    const newPost = await prisma.post.create({
      data: {
        title: myRequest.title,
        userId: foundUser.id as string,
        postimg: response.secure_url,
      },
    });

    await client.del("posts");
    res.status(200).json({
      data: newPost,
      message: "Post created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cacheValue = await client.get("posts");

  if (cacheValue) {
    return res.status(200).json({
      data: JSON.parse(cacheValue),
      message: "all post send",
    });
  }
  const allPost = await prisma.post.findMany({
    include: {
      user: true,
      comments: true,
    },
  });

  await client.set("posts", JSON.stringify(allPost));
  res.status(200).json({
    data: allPost,
    message: "all post send",
  });
};

export const likePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId } = req.params;
    const { like } = req.body;
    const token = req.cookies.jwt;
    const verifyToken = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as JwtPayload;
    const findPost = await prisma.post.findFirst({
      where: {
        id: postId,
      },
    });
    let updatedPost;
    const islikedBy = findPost?.likedBy as string[];
    console.log(islikedBy);
    const isliked = islikedBy?.includes(verifyToken?.id);
    if (!isliked) {
      islikedBy?.push(verifyToken?.id);
      updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: like,
          likedBy: [...islikedBy],
        },
      });
    } else {
      const arr1 = islikedBy.filter((el) => el !== verifyToken.id);
      updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: like,
          likedBy: [...arr1],
        },
      });
    }

    const allPosts = await prisma.post.findMany({
      include: {
        user: true,
        comments: true,
      },
    });

    await client.set("posts", JSON.stringify(allPosts));

    res.status(200).json({
      message: "done",
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};
