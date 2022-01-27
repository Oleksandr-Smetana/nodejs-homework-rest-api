const { BadRequest, NotFound } = require('http-errors');
require('dotenv').config();

const { SITE_NAME } = process.env;

const { User } = require('../../models');
const { sendMail } = require('../../helpers');

const resendVerifyMail = async (req, res, next) => {
  try {
    // checking if request contains an email
    const { email } = req.body;
    if (!email) {
      throw new BadRequest('Missing required field: email');
    }

    // checking user in database by request email
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound('User not found');
    }

    // checking user's verification status
    if (user.verify) {
      throw new BadRequest('Verification has already been passed');
    }

    // email verification
    const { verificationToken } = user;
    const data = {
      to: email,
      subject: 'Email confirmation',
      html: `<a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}">Confirm email</a>`,
    };
    await sendMail(data);

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};

module.exports = resendVerifyMail;
