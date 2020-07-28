const { Router } = require("express");
const ContactController = require("./contact.controller");

const contactRouter = Router();

contactRouter.post(
  "/",
  ContactController.validateCreateContact,
  ContactController.createContact
);
contactRouter.get("/", ContactController.getContacts);
contactRouter.get(
  "/:contactId",
  ContactController.validateId,
  ContactController.getContactById
);
contactRouter.delete(
  "/:contactId",
  ContactController.validateId,
  ContactController.removeContactById
);
contactRouter.put(
  "/:contactId",
  ContactController.validateId,
  ContactController.validateUpdateContact,
  ContactController.updateContactById
);

module.exports = contactRouter;
