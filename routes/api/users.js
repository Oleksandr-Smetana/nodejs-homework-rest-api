const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  BadRequest,
  Conflict,
  Unauthorized,
  NotFound,
} = require('http-errors');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router();
const { SECRET_KEY } = process.env;

const { User } = require('../../models');
const {
  signupJoiSchema,
  loginJoiSchema,
  updateSubscriptionJoiSchema,
} = require('../../models/user');

const { authenticate, upload } = require('../../middlewares');

// user registration
router.post('/signup', async (req, res, next) => {
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
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      email,
      password: hashPassword,
      subscription,
      avatarURL,
    });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
    console.log(newUser);
  } catch (error) {
    next(error);
  }
});

// user log in
router.post('/login', async (req, res, next) => {
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
      expiresIn: '1h',
    });
    await User.findByIdAndUpdate(_id, { token });
    res.json({ token, user: { email, subscription } });
  } catch (error) {
    next(error);
  }
});

// update user's field 'subscription'
router.patch('/', authenticate, async (req, res, next) => {
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
});

// get user data by token
router.get('/current', authenticate, async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    user: {
      email,
      subscription,
    },
  });
});

// user log out
router.get('/logout', authenticate, async (req, res) => {
  const _id = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

// avatar changing
router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  async (req, res) => {
    const { path: tempUpload, originalname } = req.file;
    const [extension] = originalname.split('.').reverse(); // getting extension
    const avatarsDir = path.join(
      __dirname,
      '../../',
      'public',
      'avatars',
    );
    const newFileName = `${req.user._id}.${extension}`;

    const fileUpload = path.join(avatarsDir, newFileName);
    await fs.rename(tempUpload, fileUpload);

    // avatar cropping
    Jimp.read(fileUpload)
      .then(avatar => {
        avatar.resize(250, 250).write(fileUpload);
      })
      .catch(error => {
        console.error(error);
      });

    const avatarURL = path.join('public', 'avatars', newFileName);
    await User.findByIdAndUpdate(
      req.user._id,
      { avatarURL },
      { new: true },
    );
    res.json({ avatarURL });
  },
);

module.exports = router;

// -------- training ---------
// const uploadDir = path.join(__dirname, '../', 'public/avatars');

// router.post(
//   '/avatars',
//   upload.single('avatar'),
//   async (req, res, next) => {
//     // console.log(req.body);
//     // console.log(req.file);
//     try {
//       const { path: tempUpload, filename } = req.file;
//       const fileUpload = path.join(uploadDir, filename);
//       await fs.rename(tempUpload, fileUpload);
//     } catch (error) {
//       // next(error);
//       await fs.unlink(tempUpload);
//     }
//   },
// );
