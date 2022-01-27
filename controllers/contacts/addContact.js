const { BadRequest } = require('http-errors');
const { Contact } = require('../../models');
const { postJoiSchema } = require('../../models/contact');

const addContact = async (req, res, next) => {
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
};

module.exports = addContact;
