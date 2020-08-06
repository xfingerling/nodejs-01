const Joi = require("@hapi/joi");
const {
  Types: { ObjectId },
} = require("mongoose");
const userModel = require("./user.model");

class UserController {
  async getUsers(req, res, next) {
    try {
      const users = await userModel.find();

      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const { email, subscription } = req.user;

      res.json({ email, subscription });
    } catch (err) {
      next(err);
    }
  }

  async updateUserSub(req, res, next) {
    try {
      const { id, subscription } = req.body;

      const updateUser = await userModel.findByIdAndUpdate(
        id,
        {
          $set: { subscription },
        },
        { new: true }
      );

      res.json(updateUser);
    } catch (err) {
      next(err);
    }
  }

  validateSub(req, res, next) {
    const schema = Joi.object({
      subscription: Joi.string().valid("free", "pro", "premium"),
      id: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json(error);
    }

    next();
  }

  validateUser(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json(error);
    }

    next();
  }

  validateId(req, res, next) {
    try {
      const { id } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send();
      }

      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
