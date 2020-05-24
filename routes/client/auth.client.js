const express = require('express');

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  loginWithGoogle,
  loginWithFacebook,
} = require('../../controllers/auth.controller');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 10 second
  max: 4,
});

const { protect } = require('../../middleware/auth');

router.post('/register', apiLimiter, register);
router.post('/login', login);

router.post('/google', apiLimiter, loginWithGoogle);
router.post('/facebook', apiLimiter, loginWithFacebook);

router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', apiLimiter, protect, updateDetails);
router.put('/updatepassword', apiLimiter, protect, updatePassword);
router.post('/forgotpassword', apiLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', apiLimiter, resetPassword);

module.exports = router;
