const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/contacts');
const { authenticate } = require('../../middlewares');

// get list of contacts
router.get('/', authenticate, ctrl.getAll);

// get contact by id
router.get('/:contactId', authenticate, ctrl.getById);

// add contact to the list
router.post('/', authenticate, ctrl.addContact);

// remove contact by id
router.delete('/:contactId', authenticate, ctrl.deleteById);

// update contact by id
router.put('/:contactId', authenticate, ctrl.updateById);

// update field "favorite" by contact's id
router.patch(
  '/:contactId/favorite',
  authenticate,
  ctrl.updateFavorite,
);

module.exports = router;
