const argv = require("yargs").argv;
const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const Joi = require("@hapi/joi");
const uniqid = require("uniqid");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("./contacts");

const server = express();

server.use(morgan("dev"));
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server
  .route("/api/contacts")
  .get((req, res) => listContacts().then((contacts) => res.json(contacts)))
  .post(
    (req, res, next) => {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);

      if (error) {
        return res.status(400).json({ message: "missing required name field" });
      }

      req.body.id = uniqid();

      next();
    },
    (req, res) => {
      addContact(req.body).then((contacts) => res.status(201).json(req.body));
    }
  );

server
  .route("/api/contacts/:contactId")
  .get((req, res) => {
    getContactById(req.params.contactId).then((contact) => {
      contact
        ? res.json(contact)
        : res.status(404).json({ message: "Not found" });
    });
  })
  .delete((req, res) => {
    removeContact(req.params.contactId).then((contacts) => {
      return contacts
        ? res.status(200).json({ message: "contact deleted" })
        : res.status(404).json({ message: "Not found" });
    });
  })
  .patch((req, res) => {
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    }).required();

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "missing fields" });
    }

    updateContact(req.params.contactId, req.body).then((contact) => {
      contact
        ? res.status(200).json(contact)
        : res.status(404).json({ message: "Not found" });
    });
  });

server.listen(3000);
