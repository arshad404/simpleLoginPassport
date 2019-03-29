const express = require("express");
const router = express.Router();
const Course = require("../models/Courses");
const User = require("../models/User");

// router.get("/", (req, res) => {
//     res.send("Coures page");
// })

router.get("/form", (req, res) => {
  res.render("courseform", { data: "" });
});

router.post("/form", (req, res) => {
  // console.log(req.body);
  var NewCourse = {
    name: req.body.name,
    category: req.body.category,
    imageUrl: req.body.imageUrl,
    instructor: req.body.instructor
  };
  Course.create(NewCourse, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/users/admin");
    }
  });
});

router.get("/:id/delete", (req, res) => {
  Course.findByIdAndDelete(req.params.id, err => {
    if (err) {
      res.redirect("/");
    } else {
      res.redirect("/users/admin");
    }
  });
});

router.get("/:id/edit", (req, res) => {
  Course.findById(req.params.id, (err, data) => {
    if (err) {
      res.redirect("/users/admin");
    } else {
      res.render("courseform", { data });
    }
  });
});

router.post("/:id/edit", (req, res) => {
  var course = {
    name: req.body.name,
    category: req.body.category,
    imageUrl: req.body.imageUrl,
    instructor: req.body.instructor
  };
  //     Course.create(NewCourse, (err, data) => {
  //         if (err) {
  //             console.log(err);
  //         } else {
  //             res.redirect('/users/admin');
  //         }
  //     })
  // })
  Course.updateOne({ _id: req.params.id }, course, err => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/users/admin");
    }
  });
});
// Course.updateOne({_id: req.params.id}, {}, ())

module.exports = router;
