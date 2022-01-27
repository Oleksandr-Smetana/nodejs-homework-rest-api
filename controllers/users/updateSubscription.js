const { BadRequest, NotFound } = require('http-errors');

const { User } = require('../../models');
const { updateSubscriptionJoiSchema } = require('../../models/user');

const updateSubscription = async (req, res, next) => {
  try {
    // validation of subscription field
    const { error } = updateSubscriptionJoiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    // updating subscription
    const { _id } = req.user;
    const { subscription } = req.body;
    const updateFieldSubscription = await User.findByIdAndUpdate(
      _id,
      { subscription },
      { new: true },
    );
    if (!updateFieldSubscription) {
      throw new NotFound();
    }
    res.json(updateFieldSubscription);
  } catch (error) {
    next(error);
  }
};

module.exports = updateSubscription;
