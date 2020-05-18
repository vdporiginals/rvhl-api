const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/database');
//load env
dotenv.config({
  path: './config/config.env',
});

//connect database
connectDB();

//route
const authApp = require('./routes/admin/auth-app.admin');
const webConfig = require('./routes/admin/web-config.admin');
const blogs = require('./routes/client/blog.client');
const advertises = require('./routes/client/advertise.client');
const auth = require('./routes/client/auth.client');
const users = require('./routes/client/user.client');
const tours = require('./routes/client/tour.client');
const transfers = require('./routes/client/transfer.client');
const homepage = require('./routes/client/homepage.client');
const comment = require('./routes/client/comment.client');
const commentControl = require('./routes/admin/comment.admin');
const estates = require('./routes/client/estate.client');
const app = express();
//Body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//file uploading
// app.use(fileUpload());

// Enable cors
app.use(cors());

//Santize data
app.use(mongoSanitize());

//set security header
app.use(helmet());

//Prevent xss attack
app.use(xss());

//prevent http param pollution
app.use(hpp());

//rate limiting
const litmiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 minute
  max: 400,
});

app.use(litmiter);

//set  static folder
app.use(express.static(path.join(__dirname, 'public')));

//mount router
app.use('/api', authApp);
app.use('/api/homepage', homepage);
app.use('/api/blogs', blogs);
app.use('/api/tours', tours);
app.use('/api/transfers', transfers);
app.use('/api/advertises', advertises);
app.use('/api/auth', auth);
app.use('/api/comments', comment);
app.use('/api/estates', estates);
app.use('/api/users', users);
app.use('/api/web-config', webConfig);
app.use('/api/admin', commentControl);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}!`.yellow
      .bold
  )
);
loadModels = function () {
  // loop through all files in models directory ignoring hidden files and this file
  fs.readdirSync(config.modelsDirMongo)
    .filter(function (file) {
      return file.indexOf('.') !== 0 && file !== 'index.js';
    })
    // import model files and save model names
    .forEach(function (file) {
      winston.info('Loading mongoose model file ' + file);
      require(path.join(config.modelsDirMongo, file));
    });
};
//handle rejecttions
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //close server and exit process
  server.close(() => process.exit(1));
});

// module.exports = server
