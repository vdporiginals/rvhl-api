//? cai dat seeder(import data JSON file) data tu CLI
const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env vars
dotenv.config({ path: './config/config.env' });

//load models
const BlogCategory = require('./models/blog/blogCategory.model');
const AdvertiseCategory = require('./models/advertise/advertiseCategory.model');
const TourCategory = require('./models/tour/tourCategory.model');
const TransferCategory = require('./models/transfer/transferCategory.model');
const Webconfig = require('./models/web-config.model');
const User = require('./models/user.model');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//read JSON file
const blogCategories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/blogCat.json`, 'utf-8')
);
const advertiseCategories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/advertiseCat.json`, 'utf-8')
);
const tourCategories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/tourCat.json`, 'utf-8')
);
const transferCategories = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/transferCat.json`, 'utf-8')
);
const webConfig = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/webConfig.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/user.json`, 'utf-8')
);

//import into DB
const importData = async () => {
  try {
    // await BlogCategory.create(blogCategories);
    // await AdvertiseCategory.create(advertiseCategories);
    // await TourCategory.create(tourCategories);
    // await TransferCategory.create(transferCategories);
    // await User.create(users);
    await Webconfig.create(webConfig);
    console.log('Data imported'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

//delete data
const deleteData = async () => {
  try {
    await BlogCategory.deleteMany();
    await AdvertiseCategory.deleteMany();
    await TourCategory.deleteMany();
    await TransferCategory.deleteMany();
    await User.deleteMany();
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
