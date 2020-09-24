const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");
const Post = mongoose.model("Post");

router.get("/user/:id", requireLogin, (req, res) => {
  // console.log(req.params.id)
  User.findOne({ _id: req.params.id })
  .select("-password")
  .then((user) => {
    Post.find({ postedBy: req.params.id })
    .populate("postedBy", "_id name")
    .exec((error, posts) => {
      if (error) {
        return res.status(422).json({error: error})
      }
      res.json({user, posts})
    })
  })
  .catch((error) => {
    return res.status(404).json({ error: "User not found" });
  });
});

module.exports = router;
