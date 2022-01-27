const Contact = require('../../models');
const { NotFound } = require('http-errors');

const getById = async (req, res, next) => {
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
};

module.exports = getById;
