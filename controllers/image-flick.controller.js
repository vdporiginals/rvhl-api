const Flickr = require('flickr-sdk');
const path = require('path');
const fs = require('fs');
const request = require('request');
const ErrorResponse = require('../middleware/utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const slug = require('../config/slug');

const auth = Flickr.OAuth.createPlugin(
  process.env.FLICKR_KEY,
  process.env.FLICKR_SECRET,
  process.env.FLICKR_OAUTH_TOKEN,
  process.env.FLICKR_OAUTH_SECRET
);

const flickr = new Flickr(auth);
const oauth = new Flickr.OAuth(
  process.env.FLICKR_KEY,
  process.env.FLICKR_SECRET
);
let secret;
//@route        GET  /api/image/auth
//@access       Admin
exports.authFlickr = asyncHandler(async (req, res, next) => {
  //
  oauth
    .request('https://localhost:5001/api/image/oauth')
    .then(function (data) {
      // console.log(data.request.params);
      const token = data.body.oauth_token;
      secret = data.body.oauth_token_secret;
      console.log(data);
      signature = data.request.params.oauth_signature;
      const url = oauth.authorizeUrl(token, 'delete');
      // const verify = 'ba3c906c9ad30537';
      res.setHeader('location', url);
      res.statusCode = 302;
      res.end();

      return res.status(200).json({
        success: true,
        data: {
          url,
          // signature,
        },
      });
    })
    .catch(function (err) {});
});

//@route        GET  /api/image/oauth
//@access       Private
exports.verifyToken = asyncHandler(async (req, res, next) => {
  const tokenSecret = secret;
  oauth
    .verify(req.query.oauth_token, req.query.oauth_verifier, tokenSecret)
    .then(function (data) {
      console.log('oauth token:', data.body.oauth_token);
      console.log('oauth token secret:', data.body.oauth_token_secret);
      return res.status(200).json({
        success: true,
        data: data.body,
      });
    })
    .catch(function (err) {
      console.log('bonk', err);
    });
});

//@route        POST  /api/image/gallery
//@access       Private
exports.createGallery = asyncHandler(async (req, res, next) => {
  const gallery = req.body;
  flickConf.galleries
    .create({
      title: gallery.title,
      description: gallery.description,
    })
    .then((data) => {
      return res.status(200).json({
        success: true,
        data,
      });
    })
    .catch((err) => {
      // console.log(err.message);
      return next(new ErrorResponse(err.message, err.code));
    });
});

//@route        POST  /api/image/photos
//@access       private
exports.uploadPhotos = asyncHandler(async (req, res, next) => {
  // console.log(req);
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const image = req.files.image;

  if (!req.files.image.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload image file', 400));
  }

  if (image.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`Please upload an image less than 10mb`, 400)
    );
  }

  image.name = `photo_${slug(path.parse(image.name).name, '_')}${
    path.parse(image.name).ext
  }`;
  image.mv(`${process.env.FILE_UPLOAD_PATH}/${image.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    // const data = req.files.image;
    const photo = new Flickr.Upload(
      auth,
      `${process.env.FILE_UPLOAD_PATH}/${image.name}`
    );

    photo
      .then(function (data) {
        fs.unlink(`${process.env.FILE_UPLOAD_PATH}/${image.name}`, function () {
          return res.status(200).json({
            success: true,
            data: image.name,
          });
        });
      })
      .catch(function (err) {
        console.log(err);
        return next(new ErrorResponse(err.message, err.statusCode));
      });
  });
  // console.log(req.file.buffer);
});

//@route        GET  /api/image/photos
//@access       Private
exports.getListPhoto = asyncHandler(async (req, res, next) => {
  const query = req.query;
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 25;
  flickr.photos
    .search({ user_id: process.env.UID_FLICK, per_page: limit, page })
    .then(function (data) {
      const photoLists = data.body.photos.photo;
      let results = [];
      photoLists.forEach((val) => {
        let imgLink = `https://farm${val.farm}.staticflickr.com/${val.server}/${val.id}_${val.secret}_b.jpg`;
        if (query.size) {
          imgLink = `https://farm${val.farm}.staticflickr.com/${val.server}/${val.id}_${val.secret}_${query.size}.jpg`;
        }
        results.push({
          link: imgLink,
          id: val.id,
          secret: val.secret,
        });
      });

      return res.status(200).json({
        success: true,
        data: {
          count: data.body.photos.total,
          pageNum: data.body.photos.page,
          pageSize: data.body.photos.perpage,
          totalPages: data.body.photos.pages,
          imageList: results,
        },
      });
    })
    .catch(function (err) {
      return next(new ErrorResponse(err.message, err.statusCode));

      // console.error('bonk', err);
    });
});

//@route        GET  /api/image/photos/:id
//@access       private
//@description  Get Single
exports.getPhotos = asyncHandler(async (req, res, next) => {
  const size = req.query.size;
  flickr.photos
    .getInfo({ photo_id: req.params.id })
    .then(function (data) {
      const photo = data.body.photo;
      let imgLink = '';
      if (size === 'o') {
        imgLink = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.originalsecret}_o.${photo.originalformat}`;
      } else {
        imgLink = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${
          photo.id
        }_${photo.secret}_${size || 'b'}.${photo.originalformat}`;
      }

      let results = {
        link: imgLink,
        id: photo.id,
      };

      return res.status(200).json({
        success: true,
        data: results,
      });
    })
    .catch(function (err) {
      return next(new ErrorResponse(err.message, err.statusCode));
      // console.error('bonk', err);
    });
});

//@route        GET  /api/image/gallery
//@access       private
exports.getListGallery = asyncHandler(async (req, res, next) => {
  const query = req.query;
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 25;
  flickr.galleries
    .getList({ user_id: process.env.UID_FLICK, per_page: limit, page })
    .then(function (data) {
      const galleryList = data.body.galleries.gallery;
      let results = [];
      galleryList.forEach((val) => {
        results.push({
          galleryId: val.gallery_id,
          title: val.title._content,
          // id: val.id,
        });
      });
      
      return res.status(200).json({
        success: true,
        data: {
          count: data.body.galleries.total,
          pageNum: data.body.galleries.page,
          pageSize: data.body.galleries.per_page,
          totalPages: data.body.galleries.pages,
          galleryList: results,
        },
      });
    })
    .catch(function (err) {
      return next(new ErrorResponse(err.message, err.statusCode));

      // console.error('bonk', err);
    });
});

//@route        GET  /api/image/gallery/:id
//@access       private
exports.getPhotoByGallery = asyncHandler(async (req, res, next) => {
  const query = req.query;
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 25;
  flickr.galleries
    .getPhotos({ gallery_id: req.params.id, per_page: limit, page })
    .then(function (data) {
      const galleryList = data.body.galleries.gallery;
      let results = [];
      galleryList.forEach((val) => {
        results.push({
          galleryId: val.gallery_id,
          title: val.title._content,
          // id: val.id,
        });
      });

      return res.status(200).json({
        success: true,
        data: {
          count: data.body.galleries.total,
          pageNum: data.body.galleries.page,
          pageSize: data.body.galleries.per_page,
          totalPages: data.body.galleries.pages,
          galleryList: results,
        },
      });
    })
    .catch(function (err) {
      return next(new ErrorResponse(err.message, err.statusCode));

      // console.error('bonk', err);
    });
});

//@route        DELETE  /api/image/photos/:id
//@access       private
exports.deletePhotos = asyncHandler(async (req, res, next) => {
  flickr.photos
    .delete({ photo_id: req.params.id })
    .then(function (data) {
      return res.status(200).json({
        success: true,
        data: {},
      });
    })
    .catch(function (err) {
      return next(new ErrorResponse(err.message, err.statusCode));

      // console.error('bonk', err);
    });
});
