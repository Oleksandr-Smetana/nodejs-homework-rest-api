const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BadRequest, Unauthorized } = require('http-errors');
require('dotenv').config();

const { SECRET_KEY } = process.env;

const { User } = require('../../models');
const { loginJoiSchema } = require('../../models/user');

const logIn = async (req, res, next) => {
  try {
    // validation of fields
    const { error } = loginJoiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }

    // validation of email
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Unauthorized('Email or password is wrong');
    }

    // verification status checking
    if (!user.verify) {
      throw new Unauthorized('Email not verified');
    }

    // validation of password
    const passwordCompare = await bcrypt.compare(
      password,
      user.password,
    );
    if (!passwordCompare) {
      throw new Unauthorized('Email or password is wrong');
    }
    const { subscription, _id } = user;

    // getting the token and saving it to the base
    const payload = {
      id: _id,
    };
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: '3h',
    });
    await User.findByIdAndUpdate(_id, { token });
    res.json({ token, user: { email, subscription } });
  } catch (error) {
    next(error);
  }
};

module.exports = logIn;
