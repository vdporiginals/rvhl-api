const path = require('path');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/async');
const Image = require('../models/image.model');

//@desciption   Upload photo
//@route        POST  /api/images
//@access       Private
exports.imageUpload = asyncHandler(async (req, res, next) => {
  const image = req.files.file;

  //make sure that image is a photo
  if (!image.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  //check file sizes
  if (image.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //create custom filename
  let imageUrl = `localhost:${process.env.PORT}/blogImage`;
  let imageName = path.parse(image.name).name;
  image.name = `photo_${imageName}_${image.md5}${path.parse(image.name).ext}`;
  image.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Image.create({
      name: imageName,
      imageUrl: `${imageUrl}/${image.name}`
    });

    res.status(200).json({
      success: true,
      data: `${imageUrl}/${image.name}`
    });
  });
});
