const bcrypt = require('bcrypt');
const { BadRequest, Conflict } = require('http-errors');
const gravatar = require('gravatar');
const { v4 } = require('uuid');
require('dotenv').config();

const { SITE_NAME } = process.env;

const { User } = require('../../models');
const { signupJoiSchema } = require('../../models/user');
const { sendMail } = require('../../helpers');

const signUp = async (req, res, next) => {
  try {
    // validation of fields
    const { error } = signupJoiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    // checking email availability
    const { email, password, subscription } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict('Email in use');
    }

    // password hashing
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const verificationToken = v4();
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      email,
      password: hashPassword,
      verificationToken,
      subscription,
      avatarURL,
    });

    // email verification
    const data = {
      to: email,
      subject: 'Email confirmation',
      html: `<a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}">Please confirm your email.</a>`,
    };
    await sendMail(data);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = signUp;
