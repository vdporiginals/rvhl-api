const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const randomstring = require('randomstring');
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
      profileFields: ['id', 'email', 'displayName'],
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ 'facebook.id': profile.id }, function (err, user) {
        if (err) return done(err);
        if (user) return done(null, user);
        else {
          // if there is no user found with that facebook id, create them
          let newUser = new User();
          const randomPassword = randomstring.generate({
            length: 12,
            charset: 'alphabetic',
          });
          newUser.name = profile.displayName;
          // set all of the facebook information in our user model
          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.facebook.name = profile.displayName;
          newUser.randomPassword = randomPassword;
          newUser.password = randomPassword;
          if (typeof profile.emails != 'undefined' && profile.emails.length > 0)
            newUser.facebook.email = profile.emails[0].value;
          newUser.email = profile.emails[0].value;
          // save our user to the database
          newUser.save(function (err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    }
  )
);

router.post('/register', register);
router.post('/login', login);

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook'), loginFb);

router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
