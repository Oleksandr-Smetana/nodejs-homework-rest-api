const express = require('express');
const Joi = require('joi');
const { BadRequest, NotFound } = require('http-errors');

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../model/index');

const router = express.Router();
const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

// get a list of contacts
router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

// get a contact by id
router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      throw new NotFound();
      // return res.status(404).json({ message: 'Not found' });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

// add a contact to the list
router.post('/', async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest('Missing required name field');
      // error.status = 400;
      // error.message = 'missing required name field';
      // throw error;
    }
    const contact = await addContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

// remove a contact by id
router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteContact = await removeContact(contactId);
    if (!deleteContact) {
      throw new NotFound();
      // return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});

// update a contact by id
router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest('Missing fields');
      // error.status = 400;
      // error.message = 'missing fields';
      // throw error;
    }

    const { contactId } = req.params;
    const updatedContact = await updateContact(
      contactId,
      req.body,
    );
    if (!updatedContact) {
      throw new NotFound();
      // return res.status(404).json({ message: 'Not found' });
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
