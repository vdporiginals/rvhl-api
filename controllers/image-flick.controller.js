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
let signature;
exports.authFlickr = asyncHandler(async (req, res, next) => {
  // const gallery = req.body;
  oauth
    .request('https://api.reviewhalong.vn/api/image/oauth')
    .then(function (data) {
      // console.log(data.request.params);
      const token = data.body.oauth_token;
      const secret = data.body.oauth_token_secret;
      signature = data.request.params.oauth_signature;
      const url = oauth.authorizeUrl(token, 'write');
      // const verify = 'ba3c906c9ad30537';
      return res.status(200).json({
        success: true,
        data: {
          url,
          signature,
        },
      });
    })
    .catch(function (err) {});
  // const url =
  //   `https://www.flickr.com/services/oauth/request_token` +
  //   `?oauth_nonce=89601180` +
  //   `&oauth_timestamp=1305583298` +
  //   `&oauth_consumer_key=${process.env.FLICKR_KEY}` +
  //   `&oauth_signature_method=HMAC-SHA1` +
  //   `&oauth_version=1.0` +
  //   `&``&oauth_callback=https%3A%2F%2Fwww.api.reviewhalong.vn/api/image/oauth`;
  // request.get(url, function (err, res, body) {
  //   console.log(body);
  // });

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
    `https://www.flickr.com/services/oauth/access_token?oauth_nonce=37026218&oauth_timestamp=1305586309` +
    `&oauth_verifier=${req.query.oauth_verifier}` +
    `&oauth_consumer_key=${process.env.FLICKR_KEY}` +
    `&oauth_signature_method=HMAC-SHA1` +
    `&oauth_signature=${signature}` +
    `&oauth_version=1.0` +
    `&oauth_token=${req.query.oauth_token}`;
  // request.get(verifyUrl);
  request.get(verifyUrl, async function (err, res, body) {
    //nếu có lỗi
    if (err) throw err;
    // let data = JSON.parse(body);
    // isValid = await body.data.is_valid;
    console.log(body);
    // if (body) {
    //   return next(
    //     new ErrorResponse('Not authorized to access this route', 401)
    //   );
    // }

    // return res.status(200).json({
    //   success: true,
    //   // data: isValid,
    // });
  });
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
