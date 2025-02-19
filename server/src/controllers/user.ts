import { Response, Request, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import fileUpload, { UploadedFile } from "express-fileupload";
import { AppError } from "../errors/index";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { prisma } from "../db";

dotenv.config();

type File = fileUpload.UploadedFile | fileUpload.UploadedFile[] | undefined;

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = req.body;
    let img: File | "" = "";
    let response: UploadApiResponse | "" = "";
    const foundUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (foundUser) {
      return next(new AppError("this user already exist", 401));
    }

    if (req.files?.imgFile) {
      img = req.files?.imgFile as UploadedFile;
      response = await cloudinary.uploader.upload(img?.tempFilePath, {
        folder: "userimages",
      });
    }

    const hashPass = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashPass,
        userimg: (response as UploadApiResponse).secure_url,
        email: email,
      },
    });

    res.status(200).json({
      data: newUser,
      message: "user created",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  console.log(req.body);
  console.log(email, password);
  const foundUser = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!foundUser) {
    return next(new AppError("user not found", 404));
  }

  console.log(foundUser);

  const hash = foundUser?.password;
  console.log(hash);

  const isLog = await bcrypt.compare(password, hash as string);
  if (isLog) {
    const token = jwt.sign({ ...foundUser }, process.env.JWT_SECRET as string);
    res.cookie("jwt", token, {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      domain: "new-twitter-api.vercel.app",
    });
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET as string);
    res.status(200).json({
      message: "logged in successfully",
      data: verifyToken,
    });
  } else {
    res.status(401).json({
      message: "wrong username or password",
    });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 1,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      message: "successfully logged out",
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsers = await prisma.user.findMany({});
    res.status(200).json({
      message: "all users sent",
      data: allUsers,
    });
  } catch (error) {
    next(error);
  }
};
export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    console.log(userId);
    const findUser = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!findUser) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    res.status(200).json({
      message: "user found",
      data: findUser,
    });
  } catch (error) {
    next(error);
  }
};
