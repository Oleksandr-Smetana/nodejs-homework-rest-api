const { NotFound } = require('http-errors');
const { User } = require('../../models');

const verifyToken = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    // checking user in database by "verificationToken"
    if (!user) {
      throw new NotFound('User not found');
    }

    // rewrite "verificationToken" and "verify" fields
    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    res.json({ message: 'Verification successful' });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
