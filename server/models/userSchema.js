const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fs = require('fs');
dotenv.config({ path: "./config.env" });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//hashin the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 12);
    this.cpassword = bcrypt.hashSync(this.cpassword, 12);
  }
  next();
});
// we are generating token
userSchema.methods.generateAuthToken = async function () {
  try {
    const SECRET_KEY = fs.readFileSync('private.key');
    let token = jwt.sign({ _id: this._id },SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error.message);
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
