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
exports.getUser = exports.logout = exports.login = exports.signup = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const cloudinary_1 = require("cloudinary");
const index_1 = require("../errors/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.prisma = new client_1.PrismaClient();
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { username, password, email } = req.body;
        console.log(email);
        const foundUser = yield exports.prisma.user.findFirst({
            where: {
                email: email
            }
        });
        console.log(foundUser);
        if (foundUser) {
            return next(new index_1.AppError("this user already exist", 401));
        }
        const img = (_a = req.files) === null || _a === void 0 ? void 0 : _a.imgFile;
        console.log(img);
        const response = yield cloudinary_1.v2.uploader.upload(img === null || img === void 0 ? void 0 : img.tempFilePath, { folder: "userimages" });
        const hashPass = yield bcrypt_1.default.hash(password, 12);
        const newUser = yield exports.prisma.user.create({
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
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email, password);
    const foundUser = yield exports.prisma.user.findFirst({
        where: {
            email: email
        }
    });
    if (!foundUser) {
        return next(new index_1.AppError("user not found", 404));
    }
    const hash = foundUser === null || foundUser === void 0 ? void 0 : foundUser.password;
    const isLog = yield bcrypt_1.default.compare(password, hash);
    if (isLog) {
        const token = jsonwebtoken_1.default.sign(Object.assign({}, foundUser), process.env.JWT_SECRET);
        res.cookie("jwt", token);
        const verifyToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
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
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.logout = logout;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield exports.prisma.user.findMany({});
        res.status(200).json({
            message: "all users sent",
            data: allUsers
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
