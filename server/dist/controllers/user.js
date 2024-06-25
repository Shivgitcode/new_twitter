import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../errors/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const prisma = new PrismaClient();
export const signup = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        console.log(email);
        const foundUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        console.log(foundUser);
        if (foundUser) {
            return next(new AppError("this user already exist", 401));
        }
        const img = req.files?.imgFile;
        console.log(img);
        const response = await cloudinary.uploader.upload(img?.tempFilePath, { folder: "userimages" });
        const hashPass = await bcrypt.hash(password, 12);
        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: hashPass,
                userimg: response.secure_url,
                email: email
            }
        });
        res.status(200).json({
            data: newUser,
            message: "user created",
        });
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    const foundUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    });
    if (!foundUser) {
        return next(new AppError("user not found", 404));
    }
    const hash = foundUser?.password;
    const isLog = await bcrypt.compare(password, hash);
    if (isLog) {
        const token = jwt.sign({ ...foundUser }, process.env.JWT_SECRET);
        res.cookie("jwt", token);
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({
            message: "logged in successfully",
            data: verifyToken
        });
    }
    else {
        res.status(401).json({
            message: "wrong username or password"
        });
    }
};
export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 1
        });
        res.status(200).json({
            message: "successfully logged out"
        });
    }
    catch (error) {
        next(error);
    }
};
export const getUser = async (req, res, next) => {
    try {
        const allUsers = await prisma.user.findMany({});
        res.status(200).json({
            message: "all users sent",
            data: allUsers
        });
    }
    catch (error) {
        next(error);
    }
};
