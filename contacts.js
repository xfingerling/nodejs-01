const fsPromises = require("fs").promises;
const path = require("path");
var uniqid = require("uniqid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

// TODO: задокументировать каждую функцию
async function getArrFromJson(path) {
  const data = await fsPromises.readFile(path, "utf-8");
  return JSON.parse(data);
}

function writeToFile(array) {
  fsPromises.writeFile(contactsPath, JSON.stringify(array), "utf-8");
}

function listContacts() {
  return getArrFromJson(contactsPath).then(console.table);
}

function getContactById(contactId) {
  return getArrFromJson(contactsPath)
    .then((contacts) => contacts.filter((contact) => contact.id === contactId))
    .then(console.table);
}

function removeContact(contactId) {
  return getArrFromJson(contactsPath)
    .then((contacts) => contacts.filter((contact) => contact.id !== contactId))
    .then(writeToFile);
}

function addContact(name, email, phone) {
  return getArrFromJson(contactsPath)
    .then((contacts) => [...contacts, { id: uniqid(), name, email, phone }])
    .then(writeToFile);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
