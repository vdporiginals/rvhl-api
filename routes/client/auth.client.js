const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  loginFb,
} = require('../../controllers/auth.controller');

const router = express.Router();

const { protect } = require('../../middleware/auth');
const passportConfig = require('../../middleware/fbLogin');

passportConfig();

router.post('/register', register);
router.post('/login', login);
router.post(
  '/facebook',
  passport.authenticate('facebook-token', { session: false }),
  loginFb
);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
