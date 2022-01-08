const jwt = require('jsonwebtoken');
const { Unauthorized } = require('http-errors');

const { User } = require('../models');
const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    // checking token availability in headers
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Unauthorized('Not authorized');
    }

    // checking availability keyword 'Bearer' in token
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer') {
      throw new Unauthorized('Not authorized');
    }

    // verifying token using SECRET_KEY
    jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ token });
    if (!user) {
      throw new Unauthorized('Not authorized');
    }

    // adding property 'user' to request object
    req.user = user;
    next();
  } catch (error) {
    if (!error.status) {
      error.status = 401;
      error.message = 'Not authorized';
    }
    next(error);
  }
};

module.exports = authenticate;
