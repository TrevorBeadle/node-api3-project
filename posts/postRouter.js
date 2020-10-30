const express = require("express");
const Posts = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
  Posts.remove(req.post.id)
    .then(() => {
      res.status(200).json({ message: "post has been removed" });
    })
    .catch(err => {
      res.status(500).json({ message: err.message });
    });
});

router.put("/:id", validatePostId, validatePostUpdate, (req, res) => {
  Posts.update(req.params.id, req.body)
    .then(() => {
      res.status(200).json({ message: "user updated" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  Posts.getById(id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        next({ code: 400, message: "there are no posts with the given ID" });
      }
    })
    .catch(error => {
      next({ code: 500, message: error.message });
    });
}

function validatePostUpdate(req, res, next) {
  if (!req.body) {
    next({ code: 400, message: "missing post information" });
  } else if (!req.body.text || typeof req.body.text !== "string") {
    next({ code: 400, message: "please provide post text as a string" });
  } else if (!req.body.user_id || typeof req.body.user_id !== "number") {
    next({ code: 400, message: "please provide user_id as a number" });
  } else if (req.body.user_id !== req.post.user_id) {
    next({ code: 400, message: "cannot change original poster" });
  }
}

router.use((err, req, res, next) => {
  res.status(err.code).json({ message: err.message });
});

module.exports = router;
