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
            return res.status(422).json({ error: error });
          }
          res.json({ user, posts });
        });
    })
    .catch((error) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", requireLogin, (req, res) => {
  User.findById(req.body.followId, (error, toBeFollowedUser) => {
    if (toBeFollowedUser.followers.includes(req.user._id)) {
      return res.status(422).json({ message: "You already following him/her" });
    } else if (error) {
      return res.status(422).json({ error: error });
    } else if (req.body.followId == req.user._id) {
      return res.status(422).json({ message: "You can't follow yourself" });
    } else {
      User.findByIdAndUpdate(
        req.body.followId,
        {
          $push: { followers: req.user._id },
        },
        {
          new: true,
        }
      )
        .select("-password")
        .exec((error, result) => {
          if (error) {
            return res.status(422).json({ error: error });
          } else {
            User.findByIdAndUpdate(req.user._id, {
              $push: { following: req.body.followId },
            }).exec((error, result) => {
              if (error) {
                return res.status(422).json({ error: error });
              }
            });
            res.json(result);
          }
        });
    }
  });
});
router.put("/unfollow", requireLogin, (req, res) => {
  // console.log("in unfollow route")
  User.findById(req.body.followId, (error, toBeUnfollowedUser) => {
    if (toBeUnfollowedUser.followers.includes(req.user._id)) {
      User.findByIdAndUpdate(
        req.body.followId,
        {
          $pull: { followers: req.user._id },
        },
        { 
          new: true,
        }
      )
      .select("-password")
      .exec((error, result) => {
        if (error) {
          return res.status(422).json({ error: error });
        } else {
          User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.followId },
          }).exec((error, result) => {
            if (error) {
              return res.status(422).json({ error: error });
            }
          });
          res.json(result);
          // console.log(result)
        }
      });
    } else if (error) {
      return res.status(422).json({ error: error });
    } else if (req.body.followId == req.user._id) {
      return res.status(422).json({ message: "You can'nt unfollow yourself" });
    }
  });
});

module.exports = router;
