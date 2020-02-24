const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/database');
//load env
dotenv.config({
  path: './config/config.env'
});

//connect database
connectDB();

//route
const blogs = require('./routes/client/blog.client');
// const advertises = require('./routes/client/advertise.client');
// const auth = require('./routes/client/auth');

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

//set  static folder
// app.use(express.static(path.join(__dirname, 'public')));

//mount router
app.use('/api/blogs', blogs);
// app.use('/api/advertise', advertises);
// app.use('/api/v1/auth', auth);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}!`.yellow
      .bold
  )
);

//handle rejecttions
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //close server and exit process
  server.close(() => process.exit(1));
});
