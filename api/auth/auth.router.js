const { Router } = require("express");
const AuthController = require("./auth.controller");
const UserController = require("../users/user.controller");

const authRouter = Router();

authRouter.post(
  "/register",
  UserController.validateUser,
  AuthController.validateUniqueEmail,
  AuthController.registrationUser
);
authRouter.post(
  "/login",
  UserController.validateUser,
  AuthController.loginUser
);
authRouter.post("/logout", AuthController.auth, AuthController.logout);
authRouter.get("/verify/:verificationToken", AuthController.verifyEmail);

module.exports = authRouter;
