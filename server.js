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
  path: './config/config.env'
});

//connect database
connectDB();

//route
const blogs = require('./routes/client/blog.client');
const advertises = require('./routes/client/advertise.client');
const auth = require('./routes/client/auth.client');
const users = require('./routes/client/user.client');

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

//Santize data
app.use(mongoSanitize());

//set security header
app.use(helmet());

//Prevent xss attack
app.use(xss());

//rate limiting
const litmiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 minute
  max: 200
});

app.use(litmiter);

//prevent http param pollution
app.use(hpp());

// Enable cors
app.use(cors);

//set  static folder
// app.use(express.static(path.join(__dirname, 'public')));

//mount router
app.use('/api/blogs', blogs);
app.use('/api/advertises', advertises);
app.use('/api/auth', auth);
app.use('/api/users', users);
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
