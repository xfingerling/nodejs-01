const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const uuid = require("uuid");
const userModel = require("../users/user.model");
const generateAvatar = require("../helpers/avatarGenerator");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class AuthController {
  async registrationUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const passwordHash = await bcrypt.hash(password, 10);

      // const staticAvatarURL = await generateAvatar();

      const user = await userModel.create({
        email,
        password: passwordHash,
        // avatarURL: staticAvatarURL,
      });

      const verificationToken = uuid.v4();

      await userModel.findByIdAndUpdate(
        user._id,
        { verificationToken },
        { new: true }
      );

      const msg = {
        to: user.email,
        from: "oleggenius@hotmail.com",
        subject: "Email Verification",
        text: "and easy to do anywhere, even with Node.js",
        html: `<a href='localhost:3000/auth/verify/${verificationToken}'>Click to verify</a>`,
      };
      console.log(verificationToken);
      sgMail.send(msg);

      return res.status(201).json({
        _id: user._id,
        email: user.email,
        // avatarURL: user.avatarURL,
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
      if (!user || user.status !== "Verified") {
        return res.status(401).send("Email or password is wrong");
      }

      const isPassValid = await bcrypt.compare(password, user.password);
      if (!isPassValid) {
        return res.status(401).send("Email or password is wrong");
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      await userModel.findByIdAndUpdate(user._id, { token });

      return res.json({
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
        return res.status(401).json({ message: "Not authorized" });
      }

      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const userToVerify = await userModel.findOne({ verificationToken });
      if (!userToVerify) {
        return res.status(404).json({ message: "User not found" });
      }

      await userModel.findByIdAndUpdate(
        userToVerify._id,
        { status: "Verified", verificationToken: null },
        { new: true }
      );

      return res.send("Successfully");
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

  async sendVerificationEmail(user) {
    const verificationToken = uuid.v4();

    await userModel.findByIdAndUpdate(
      used._id,
      { verificationToken },
      { new: true }
    );

    const msg = {
      to: user.email,
      from: "oleggenius@hotmail.com",
      subject: "Email Verification",
      text: "and easy to do anywhere, even with Node.js",
      html: `<a href='http://localhost:3000/auth/verify/${verificationToken}'>Click to verify</a>`,
    };

    sgMail.send(msg);
  }
}

module.exports = new AuthController();
