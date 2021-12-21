const fs = require('fs/promises');
const path = require('path');
const { v4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');

// get a list of contacts
async function listContacts() {
  const data = await fs.readFile(contactsPath);
  const result = JSON.parse(data);
  return result;
}

// get a contact by id
async function getContactById(contactId) {
  const data = await listContacts();
  const result = data.find(
    contact => contact.id === contactId,
  );
  if (!result) {
    return null;
  }
  return result;
}

// add a contact to the list
async function addContact({ name, email, phone }) {
  const data = await listContacts();
  const newContact = { id: v4(), name, email, phone };
  data.push(newContact);
  await fs.writeFile(
    contactsPath,
    JSON.stringify(data, null, 2),
  );
  return newContact;
}

// remove a contact by id
async function removeContact(contactId) {
  const data = await listContacts();
  const idx = data.findIndex(
    contact => contact.id === contactId,
  );
  if (idx === -1) {
    return null;
  }
  const newList = data.filter((_, index) => index !== idx);
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newList, null, 2),
  );
  return data[idx];
}

// update a contact by id
async function updateContact(contactId, body) {
  const data = await listContacts();
  const idx = data.findIndex(
    contact => contact.id === contactId,
  );
  if (idx === -1) {
    return null;
  }
  data[idx] = { contactId, ...body };
  await fs.writeFile(
    contactsPath,
    JSON.stringify(data, null, 2),
  );
  return data[idx];
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
