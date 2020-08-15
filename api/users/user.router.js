const { Router } = require("express");
const AuthController = require("../auth/auth.controller");
const UserController = require("./user.controller");
const path = require("path");
const uniqid = require("uniqid");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqid() + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

const userRouter = Router();

userRouter.get("/", UserController.getUsers);
userRouter.get("/current", AuthController.auth, UserController.getCurrentUser);
userRouter.patch(
  "/",
  UserController.validateId,
  UserController.validateSub,
  UserController.updateUserSub
);
userRouter.patch(
  "/avatars",
  AuthController.auth,
  upload.single("avatar"),
  UserController.updateAvatar
);

module.exports = userRouter;
