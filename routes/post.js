const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get("/allpost", requireLogin, (req, res) => {
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
    photo: url,
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

router.put("/like", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $push: {likes: req.user._id}
  }, {
    new: true
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json({erro: err})
    } else {
      // console.log(result)
      res.json(result)
    }
  })
})
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $pull: {likes: req.user._id}
  }, {
    new: true
  }).exec((err, result) => {
    if (err) {
      return res.status(422).json({erro: err})
    } else {
      res.json(result)
    }
  })
})


module.exports = router;
