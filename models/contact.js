const { Schema, model } = require('mongoose');
const Joi = require('joi');

const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId, // user's id
      ref: 'user', // from what collection
    },
  },
  { versionKey: false, timestamps: true },
);

const postJoiSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().min(2).required(),
  phone: Joi.string().min(2).required(),
  favorite: Joi.boolean(),
});

const updateFavoriteJoiSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model('contact', contactSchema); // categories => category (1st argument in the singular)

module.exports = {
  Contact,
  postJoiSchema,
  updateFavoriteJoiSchema,
};
