const Joi = require("@hapi/joi");
const {
  Types: { ObjectId },
} = require("mongoose");
const contactModel = require("./contact.model");

class ContactController {
  async createContact(req, res, next) {
    try {
      const contact = await contactModel.create(req.body);

      return res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async getContacts(req, res, next) {
    try {
      const { sub, page, limit } = req.query;

      const optionsPaginate = {
        page: page || 1,
        limit: limit || 10,
      };

      let contacts;
      if (sub) {
        contacts = await contactModel.paginate(
          { subscription: sub },
          optionsPaginate
        );
      } else {
        contacts = await contactModel.paginate({}, optionsPaginate);
      }

      return res.json(contacts.docs);
    } catch (err) {
      next(err);
    }
  }

  async getContactById(req, res, next) {
    try {
      const { contactId } = req.params;

      const contact = await contactModel.findById(contactId);

      if (!contact) {
        return res.status(404).send();
      }

      return res.json(contact);
    } catch (err) {
      next(err);
    }
  }

  async removeContactById(req, res, next) {
    try {
      const { contactId } = req.params;

      const deletedContact = await contactModel.findByIdAndDelete(contactId);

      if (!deletedContact) {
        return res.status(404).send();
      }

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async updateContactById(req, res, next) {
    try {
      const { contactId } = req.params;

      const updateContact = await contactModel.findByIdAndUpdate(
        contactId,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (!updateContact) {
        return res.status(404).send();
      }

      return res.json(updateContact);
    } catch (err) {
      next(err);
    }
  }

  validateId(req, res, next) {
    const id = req.params.contactId;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send();
    }

    next();
  }

  validateCreateContact(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "missing required name field" });
    }

    next();
  }

  validateUpdateContact(req, res, next) {
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    }).required();

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "missing fields" });
    }

    next();
  }
}

module.exports = new ContactController();
