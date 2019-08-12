const express = require("express");

// database access using knex
const db = require("../data/db-config.js");

const router = express.Router();

router.get("/", (req, res) => {
  db.select("id", "title", "contents")
    .from("posts")
    //   db("posts") // returns a promise that resolves all records from the posts
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ error: "Error getting posts from database" });
    });
});

router.get("/:id", (req, res) => {
  db("posts")
    .where({ id: req.params.id })
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({ error: "Error getting the post from database" });
    });
});

router.post("/", (req, res) => {
  const post = req.body;
  // validate the the post data is correct before saving to the db
  db("posts")
    .insert(post, "id")
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      res.status(500).json({ message: "error saving the post to the db" });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;

  db("posts")
    .where("id", "=", req.params.id)
    .update(changes)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "error updating the post" });
    });
});

router.delete("/:id", (req, res) => {
  db("posts")
    .where("id", "=", req.params.id)
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "not found" });
      }
    })
    .catch(error => {
      res.status(500).json({ message: "error removing the post" });
    });
});

module.exports = router;
