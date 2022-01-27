const express = require('express');
const router = express.Router();

const { authenticate, upload } = require('../../middlewares');
const ctrl = require('../../controllers/users');

// user registration
router.post('/signup', ctrl.signUp);

// user log in
router.post('/login', ctrl.logIn);

// update user's field 'subscription'
router.patch('/', authenticate, ctrl.updateSubscription);

// get user data by token
router.get('/current', authenticate, ctrl.getUserByToken);

// user log out
router.get('/logout', authenticate, ctrl.logOut);

// avatar changing
router.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  ctrl.updateAvatar,
);

// resend email with verification link
router.post('/verify', ctrl.resendVerifyMail);

// verification check
router.get('verify/:verificationToken', ctrl.verifyToken);

module.exports = router;
