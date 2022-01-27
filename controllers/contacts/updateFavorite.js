const { BadRequest, NotFound } = require('http-errors');
const { Contact } = require('../../models');
const { updateFavoriteJoiSchema } = require('../../models/contact');

const updateFavorite = async (req, res, next) => {
  try {
    // validation of field "favorite"
    const { error } = updateFavoriteJoiSchema.validate(req.body);
    if (error) {
      throw new BadRequest('Missing field favorite');
    }

    // updating field "favorite"
    const { contactId } = req.params; // route parameter
    const { favorite } = req.body;
    const { _id } = req.user;
    const updateFieldFavorite = await Contact.findOneAndUpdate(
      {
        _id: contactId,
        owner: _id,
      },
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
};

module.exports = updateFavorite;
