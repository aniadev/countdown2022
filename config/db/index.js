const mongoose = require("mongoose");
require("dotenv").config();
const mongodb_uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const mongodb_uri = 'mongodb://localhost:27017/appjs_dev';
// const uri = process.env.MONGODB_URI //Config from heroku var
async function connect() {
  try {
    await mongoose.connect(mongodb_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    });
    console.log("Connect MongoDB Successfully");
  } catch (err) {
    console.log("Connect Fail");
    console.log(err);
  }
}

module.exports = { connect };
