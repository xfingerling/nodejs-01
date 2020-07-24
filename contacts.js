const fsPromises = require("fs").promises;
const path = require("path");

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
  return getArrFromJson(contactsPath);
}

function getContactById(contactId) {
  return getArrFromJson(contactsPath).then((contacts) => {
    const filteredArr = contacts.filter((contact) => contact.id === contactId);

    return filteredArr.length ? filteredArr[0] : false;
  });
}

function removeContact(contactId) {
  return getArrFromJson(contactsPath).then((contacts) => {
    const flag = contacts.find((contact) => contact.id === contactId);

    if (!flag) {
      return false;
    }

    const filteredContacts = contacts.filter(
      (contact) => contact.id !== contactId
    );

    writeToFile(filteredContacts);
    return filteredContacts;
  });
}

function addContact(newContact) {
  return getArrFromJson(contactsPath)
    .then((contacts) => [...contacts, newContact])
    .then(writeToFile);
}

function updateContact(contactId, reqBody) {
  return getArrFromJson(contactsPath).then((contacts) => {
    const flag = contacts.find((contact) => contact.id === contactId);

    if (!flag) {
      return false;
    }

    const updateContacts = contacts.map((contact) =>
      contact.id === contactId ? { ...contact, ...reqBody } : contact
    );

    writeToFile(updateContacts);
    return updateContacts.filter((contact) => contact.id === contactId);
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
