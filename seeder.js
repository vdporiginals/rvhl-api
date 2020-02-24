//? cai dat seeder(import data JSON file) data tu CLI
const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env vars
dotenv.config({ path: './config/config.env' });

//load models
const Blog = require('./models/blog.model');
// const Advertise = require('./models/course.model');
// const User = require('./models/user.model');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

//read JSON file
const blogs = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/blog.json`, 'utf-8')
);
// const courses = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/advertise.json`, 'utf-8')
// );
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/user.json`, 'utf-8')
// );

//import into DB
const importData = async () => {
  try {
    await Blog.create(blogs);
    // await Course.create(advertises);
    // await User.create(users);
    console.log('Data imported'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//delete data
const deleteData = async () => {
  try {
    await Blog.deleteMany();
    // await Course.deleteMany();
    // await User.deleteMany();
    console.log('Data delete...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
