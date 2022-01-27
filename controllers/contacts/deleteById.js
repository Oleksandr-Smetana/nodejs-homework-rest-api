const { NotFound } = require('http-errors');
const { Contact } = require('../../models');

const deleteById = async (req, res, next) => {
  try {
    const { contactId } = req.params; // route parameter
    const { _id } = req.user;
    const deleteContact = await Contact.findOneAndRemove({
      _id: contactId,
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
};

module.exports = deleteById;
