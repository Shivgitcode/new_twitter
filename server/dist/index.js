"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const user_1 = require("./routes/user");
const config_1 = require("./cloudinary/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const post_1 = require("./routes/post");
const comment_1 = require("./routes/comment");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 7000;
(0, config_1.cloudinaryConfig)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    methods: ["GET", "POST", "DELETE", "PUT", "DELETE"],
    credentials: true,
    origin: "http://localhost:5173"
}));
app.use((0, express_fileupload_1.default)({
    tempFileDir: "/tmp/",
    useTempFiles: true
}));
app.use("/api/v1", user_1.router, post_1.postRoutes, comment_1.commentRouter);
app.get("/", (req, res) => {
    res.send("Hello");
});
app.use((err, req, res, next) => {
    const { status = 500, message = "Internal server Error" } = err;
    res.status(status).json({
        message: message
    });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
