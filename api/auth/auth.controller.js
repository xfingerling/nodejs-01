const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../users/user.model");

class AuthController {
  async registrationUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await userModel.create({ email, password: passwordHash });

      return res.status(201).json({
        _id: user._id,
        email: user.email,
        subscription: user.subscription,
        __v: user.__v,
      });
    } catch (err) {
      next(err);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).send("Email or password is wrong");
      }

      const isPassValid = await bcrypt.compare(password, user.password);
      if (!isPassValid) {
        return res.status(401).send("Email or password is wrong");
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      await userModel.findByIdAndUpdate(user._id, { token });

      return res.status(200).json({
        token,
        user: { email: user.email, subscription: user.subscription },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.findByIdAndUpdate(user._id, { token: null });

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async auth(req, res, next) {
    try {
      const authHeader = req.get("Authorization");
      const token = authHeader.replace("Bearer ", "");

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        res.status(401).json({ message: "Not authorized" });
      }

      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        res.status(401).json({ message: "Not authorized" });
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  async validateUniqueEmail(req, res, next) {
    const isUniqueUserEmail = await userModel.findOne({
      email: req.body.email,
    });

    if (isUniqueUserEmail) {
      return res.status(409).json({ message: "Email in use" });
    }

    next();
  }
}

module.exports = new AuthController();
