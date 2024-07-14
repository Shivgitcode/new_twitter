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
exports.getComments = exports.createComment = void 0;
const user_1 = require("./user");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const image = (_a = req.files) === null || _a === void 0 ? void 0 : _a.imgFile;
        const postId = req.params.id;
        let response = { secure_url: "" };
        if (typeof image !== "undefined") {
            response = yield cloudinary_1.v2.uploader.upload(image.tempFilePath, {
                folder: "commentImg"
            });
        }
        const myResponse = req.body;
        const token = req.cookies.jwt;
        const currUser = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const createComment = yield user_1.prisma.comment.create({
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
});
exports.createComment = createComment;
const getComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(id);
        const allComments = yield user_1.prisma.comment.findMany({
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
});
exports.getComments = getComments;
