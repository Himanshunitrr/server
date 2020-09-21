const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get("/allpost", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .then(posts => {
      res.json({ posts });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/createpost", requireLogin, (req, res) => {
  const { title, body, url } = req.body;
  if (!title || !body || !url) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  // console.log(req.user)
  // const {name, _id} = req.user
  req.user.password = undefined
  const post = new Post({
    title,
    body,
    url,
    postedBy: req.user
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((error) => {
      console / log(error);
    });
});

router.get("/mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then(mypost => {
      res.json({mypost})
    })
    .catch(error => {
    console.log(error)
  })
})

module.exports = router;
