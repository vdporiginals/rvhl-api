const Flickr = require('flickr-sdk');
const request = require('request');
const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const flickConf = new Flickr(
  Flickr.OAuth.createPlugin(
    process.env.FLICKR_KEY,
    process.env.FLICKR_SECRET,
    process.env.FLICKR_OAUTH_TOKEN,
    process.env.FLICKR_OAUTH_SECRET
  )
);
const oauth = new Flickr.OAuth(
  process.env.FLICKR_KEY,
  process.env.FLICKR_SECRET
);
exports.authFlickr = asyncHandler(async (req, res, next) => {
  // const gallery = req.body;
  oauth
    .request('https://admin.reviewhalong.vn/image')
    .then(function (data) {
      const token = data.body.oauth_token;
      const secret = data.body.oauth_token_secret;
      const url = oauth.authorizeUrl(token, 'write');
      // const verify = 'ba3c906c9ad30537';
      return res.status(200).json({
        success: true,
        data: url,
      });
    })
    .catch(function (err) {});

  // flickConf.galleries
  //   .create({
  //     title: gallery.title,
  //     description: gallery.description,
  //   })
  //   .then((data) => {
  //     return res.status(200).json({
  //       success: true,
  //       data,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //     return next(new ErrorResponse(err.message, err.code));
  //   });
});

exports.verifyToken = asyncHandler(async (req, res, next) => {
  const { oauthToken, oauthVerifier } = req.body;
  const tokenSecret = process.env.FLICKR_SECRET;
  const verifyUrl =
    `https://www.flickr.com/services/oauth/access_token` +
    `?oauth_nonce=37026218` +
    `&oauth_timestamp=1305586309` +
    `&oauth_verifier=${oauthToken}` +
    `&oauth_consumer_key=${process.env.FLICKR_KEY}` +
    `&oauth_signature_method=HMAC-SHA1` +
    `&oauth_version=1.0` +
    `&oauth_token=${oauthVerifier}`;
  request.get(verifyUrl);
  // oauth
  //   .verify(oauthToken, oauthVerifier, tokenSecret)
  //   .then(function (res) {
  //     console.log('oauth token:', res.body.oauth_token);
  //     console.log('oauth token secret:', res.body.oauth_token_secret);
  //     return res.status(200).json({
  //       success: true,
  //       flickrToken: res.body.oauth_token,
  //     });
  //   })
  //   .catch(function (err) {
  //     console.log('bonk', err);
  //   });
});
