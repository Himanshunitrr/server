const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

router.get("/allpost", requireLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
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
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: url,
    postedBy: req.user,
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
    .then((mypost) => {
      res.json({ mypost });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.put("/like", requireLogin, (req, res) => {
  Post.findById(req.body.postId, (error, post) => {
    // console.log(post.likes)
    if (post.likes.includes(req.user._id)) {
      // console.log("done")
      return res.status(422).json({ message: "You have already like it" });
    } else if (error) {
      return res.status(422).json({ error: error });
    } else {
      // console.log("push")
      post.likes.push(req.user._id);
      Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { likes: req.user._id },
        },
        {
          new: true,
        }
      ).exec((error, result) => {
        if (error) {
          return res.status(422).json({ error: error });
        } else {
          // console.log(result)
          res.json(result);
        }
      });
    }
  });
});
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((error, result) => {
    if (error) {
      return res.status(422).json({ error: error });
    } else {
      res.json(result);
    }
  });
});

router.put("/comment", requireLogin, (req, res) => {
  // console.log(req.body)
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .exec((error, result) => {
      if (error) {
        // console.log(error)
        return res.status(422).json({ error: error });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId",requireLogin, (req, res) => {
  Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((error, post) => {
      if (error || !post) {
      return res.status(422).json({error: error})
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post.remove()
          .then(result => {
          res.json(result)
          }).catch(error => {
          console.log(error)
        })
      }
  })
})
module.exports = router;
