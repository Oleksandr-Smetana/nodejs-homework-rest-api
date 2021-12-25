const express = require('express');
const { BadRequest, NotFound } = require('http-errors');

const { Contact } = require('../../model');
const {
  postJoiSchema,
  updateFavoriteJoiSchema,
} = require('../../model/contact');

const router = express.Router();

// get list of contacts
router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

// get contact by id
router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new NotFound();
    }
    res.json(contact);
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      error.status = 404;
    }
    next(error);
  }
});

// add contact to the list
router.post('/', async (req, res, next) => {
  try {
    const { error } = postJoiSchema.validate(req.body);
    if (error) {
      throw new BadRequest('Missing required name field');
    }
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    if (error.message.includes('validation failed')) {
      error.status = 401;
    }
    next(error);
  }
});

// remove contact by id
router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deleteContact = await Contact.findByIdAndRemove(
      contactId,
    );
    if (!deleteContact) {
      throw new NotFound();
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      error.status = 404;
    }
    next(error);
  }
});

// update contact by id
router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true },
    );
    if (!updatedContact) {
      throw new NotFound();
    }
    res.json(updatedContact);
  } catch (error) {
    if (error.message.includes('validation failed')) {
      error.status = 401;
    }
    next(error);
  }
});

// update field "favorite" by contact's id
router.patch(
  '/:contactId/favorite',
  async (req, res, next) => {
    try {
      const { error } = updateFavoriteJoiSchema.validate(
        req.body,
      );
      if (error) {
        throw new BadRequest('Missing field favorite');
      }
      const { contactId } = req.params;
      const { favorite } = req.body;
      console.log({ favorite });
      const updateFieldFavorite =
        await Contact.findByIdAndUpdate(
          contactId,
          { favorite },
          { new: true },
        );
      if (!updateFieldFavorite) {
        throw new NotFound();
      }
      res.json(updateFieldFavorite);
    } catch (error) {
      if (error.message.includes('validation failed')) {
        error.status = 401;
      }
      next(error);
    }
  },
);

module.exports = router;
