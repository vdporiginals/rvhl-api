const passport = require('passport'),
  FacebookTokenStrategy = require('passport-facebook-token'),
  User = require('../models/user.model');

module.exports = function () {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
      },
      function (accessToken, refreshToken, profile, done) {
        User.upsertFbUser(accessToken, refreshToken, profile, function (
          err,
          user
        ) {
          return done(err, user);
        });
      }
    )
  );
};
