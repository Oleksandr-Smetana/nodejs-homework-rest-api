const { NotFound } = require('http-errors');
const { Contact } = require('../../models');

const updateById = async (req, res, next) => {
  try {
    const { contactId } = req.params; // route parameter
    const { _id } = req.user;
    const updatedContact = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        owner: _id,
      },
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
};

module.exports = updateById;
