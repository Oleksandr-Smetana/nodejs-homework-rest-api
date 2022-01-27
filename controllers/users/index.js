const signUp = require('./signUp');
const logIn = require('./logIn');
const updateSubscription = require('./updateSubscription');
const getUserByToken = require('./getUserByToken');
const logOut = require('./logOut');
const updateAvatar = require('./updateAvatar');
const resendVerifyMail = require('./resendVerifyMail');
const verifyToken = require('./verifyToken');

module.exports = {
  signUp,
  logIn,
  updateSubscription,
  getUserByToken,
  logOut,
  updateAvatar,
  resendVerifyMail,
  verifyToken,
};
