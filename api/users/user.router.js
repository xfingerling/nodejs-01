const { Router } = require("express");
const AuthController = require("../auth/auth.controller");
const UserController = require("./user.controller");

const userRouter = Router();

userRouter.get("/", UserController.getUsers);
userRouter.get("/current", AuthController.auth, UserController.getCurrentUser);
userRouter.patch(
  "/",
  UserController.validateId,
  UserController.validateSub,
  UserController.updateUserSub
);

module.exports = userRouter;
