const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

const User = mongoose.model("User");


router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(400).json({
          error: "User already exixts with this email",
        });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          name,
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "saved successfully" });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please provide all the details" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({
        error: "Invalid Email"
      });
    }
    bcrypt.compare(password, savedUser.password)
      .then(doMatch => {
        if (doMatch) {
          // res.json({ message: "successfully signed in" })
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const {_id, name, email} = savedUser
          res.json({token, user:{_id, name, email}})
        }
        else {
          return res.status(422).json({
            error: "Invalid password"
          })
        }
      })
      .catch(error => {
      console.log(error)
    })
  });
});

module.exports = router;
