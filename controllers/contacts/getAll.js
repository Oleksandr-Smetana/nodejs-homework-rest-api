const Contact = require('../../models');

const getAll = async (req, res, next) => {
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
};

module.exports = getAll;
