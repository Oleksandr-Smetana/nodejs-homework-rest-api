const express = require('express');
const { BadRequest, NotFound } = require('http-errors');

const router = express.Router();

const { Contact } = require('../../models');
const {
  postJoiSchema,
  updateFavoriteJoiSchema,
} = require('../../models/contact');

const { authenticate } = require('../../middlewares');

// get list of contacts
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, favorite } = req.query; // query parameters
    const skip = (page - 1) * limit;
    const { _id } = req.user;
    const contacts = await Contact.find(
      { owner: _id },
      '-createdAt -updatedAt',
      { skip, limit: +limit },
    );

    // get contacts by field 'favorite'
    if (favorite) {
      const favoriteContacts = await Contact.find(
        { owner: _id, favorite },
        '-createdAt -updatedAt',
        { skip, limit: +limit },
      );
      res.json(favoriteContacts);
      return;
    }

    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

// get contact by id
router.get('/:contactId', authenticate, async (req, res, next) => {
  const { contactId } = req.params; // route parameter
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
router.post('/', authenticate, async (req, res, next) => {
  try {
    // validation of fields
    const { error } = postJoiSchema.validate(req.body);
    if (error) {
      throw new BadRequest('Missing required name field');
    }

    // adding new contact
    const { _id } = req.user;
    const contact = await Contact.create({
      ...req.body,
      owner: _id, // attaching owner's id from its request
    });
    res.status(201).json(contact);
  } catch (error) {
    if (error.message.includes('validation failed')) {
      error.status = 401;
    }
    next(error);
  }
});

// remove contact by id
router.delete('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params; // route parameter
    const { _id } = req.user;
    const deleteContact = await Contact.findOneAndRemove({
      contactId,
      owner: _id,
    });
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
router.put('/:contactId', authenticate, async (req, res, next) => {
  try {
    const { contactId } = req.params; // route parameter
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
  authenticate,
  async (req, res, next) => {
    try {
      // validation of field "favorite"
      const { error } = updateFavoriteJoiSchema.validate(req.body);
      if (error) {
        throw new BadRequest('Missing field favorite');
      }

      // updating field "favorite"
      const { contactId } = req.params; // route parameter
      const { favorite } = req.body;

      const updateFieldFavorite = await Contact.findByIdAndUpdate(
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
