"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.getPost = exports.tweet = void 0;
const user_1 = require("./user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
const redis_1 = require("../redis");
dotenv_1.default.config();
const tweet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const image = (_a = req.files) === null || _a === void 0 ? void 0 : _a.imgFile;
        let response = { secure_url: "" };
        if (typeof image !== "undefined") {
            response = yield cloudinary_1.v2.uploader.upload(image.tempFilePath, {
                folder: "postimages"
            });
        }
        console.log(image);
        const myRequest = req.body;
        const token = req.cookies.jwt;
        const foundUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(foundUser);
        const newPost = yield user_1.prisma.post.create({
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
        yield redis_1.client.del("posts");
    }
    catch (error) {
        next(error);
    }
});
exports.tweet = tweet;
const getPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheValue = yield redis_1.client.get("posts");
    if (cacheValue) {
        return res.status(200).json({
            data: JSON.parse(cacheValue),
            message: "all post send"
        });
    }
    const allPost = yield user_1.prisma.post.findMany({
        include: {
            user: true,
            comments: true
        }
    });
    yield redis_1.client.set("posts", JSON.stringify(allPost));
    res.status(200).json({
        data: allPost,
        message: "all post send"
    });
});
exports.getPost = getPost;
const likePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, postId } = req.params;
        const { likes: userLike } = req.body;
        const post = yield user_1.prisma.post.findFirst({
            where: {
                id: postId
            }
        });
        const user = yield user_1.prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        let likes = post === null || post === void 0 ? void 0 : post.likedBy;
        const totalLikes = likes === null || likes === void 0 ? void 0 : likes.length;
        const postsLikedByUser = user === null || user === void 0 ? void 0 : user.likedPost;
        const isLiked = likes === null || likes === void 0 ? void 0 : likes.find((el) => el === userId);
        console.log(isLiked);
        if (!isLiked) {
            likes === null || likes === void 0 ? void 0 : likes.push(userId);
            const updatedPost = yield user_1.prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    likedBy: likes,
                    likes: userLike
                }
            });
            yield user_1.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    likedPost: [...postsLikedByUser, postId]
                }
            });
            res.status(200).json({
                message: "post updated",
                data: updatedPost
            });
        }
        else {
            likes = likes === null || likes === void 0 ? void 0 : likes.filter(el => el !== userId);
            const updatedPost = yield user_1.prisma.post.update({
                where: {
                    id: postId
                },
                data: {
                    likedBy: likes
                }
            });
            yield user_1.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    likedPost: postsLikedByUser === null || postsLikedByUser === void 0 ? void 0 : postsLikedByUser.filter(el => el !== postId)
                }
            });
            res.status(200).json({
                message: "post unliked",
                data: updatedPost
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.likePost = likePost;
