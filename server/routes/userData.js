const express = require("express");
const User = require("../models/userSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");

const authenticate = require("../middleware/authenticate.js");

router.get("/", (req, res) => {
  res.send("hello from user");
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, cpassword } = req.body;
    if (!username || !email || !password || !cpassword) {
      return res.status(422).json({ error: "Please fill the Data" });
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(404).json({ message: "Email is already registered" });
    }
    const user = new User({ username, email, password, cpassword });
    const userData = await user.save();
    if (userData) {
      return res.status(201).json({ message: "User Registered Successfully" });
    } else {
      return res.status(404).json({ error: "Failed to register" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please fill the data" });
    }
    const userLogin = await User.findOne({ email: email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        secure: false,
      });
      if (!isMatch) {
        res.status(400).json({ error: "Invalid credientials" });
      } else {
        res.json({ message: "User Login successfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid credientials" });
    }
  } catch (error) {
    console.log(error.message);
  }
});
//checking user login or not using authenticate middleware.
router.get("/fileupload", authenticate, (req, res) => {
  res.send(req.rootUser);
});

router.get('/logout',(req,res)=>{
   res.clearCookie('jwtoken', {
     path:'/'
   });
     res.status(201).send("User Logout")
})

module.exports = router;
