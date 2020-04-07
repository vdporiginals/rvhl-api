const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  loginStrategy,
  fbStrategy,
  googleStrategy,
} = require('../../controllers/auth.controller');
const User = require('../../models/user.model');

const router = express.Router();

const { protect } = require('../../middleware/auth');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails', 'picture.type(large)'],
    },
    function (accessToken, refreshToken, profile, done) {
      fbStrategy(accessToken, refreshToken, profile, done);
    }
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_APP_ID,
      clientSecret: process.env.GOOGLE_APP_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      googleStrategy(accessToken, refreshToken, profile, done);
    }
  )
);

router.post('/register', register);
router.post('/login', login);

router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);
router.get(
  '/facebook/callback',
  passport.authenticate('facebook'),
  loginStrategy
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
router.get('/google/callback', passport.authenticate('google'), loginStrategy);

router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
