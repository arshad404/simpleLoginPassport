const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");
const Courses = require("../models/Courses");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

router.get("/", isLoggedIn, (req, res) => {
  res.send("logged in");
});

router.get("/admin", isLoggedIn, (req, res) => {
  // console.log(req);
  Courses.find({}, (err, courses) => {
    if (err) throw err;
    // console.log(courses)
    res.render("adminview", { user: req.user, courses: courses });
  });
});

//login
router.get("/login", (req, res) => {
  res.render("login");
});

//signup
router.get("/signup", (req, res) => res.render("signup"));

router.post("/signup", (req, res) => {
  // console.log(req.body);
  const { name, email, password, password2, position, role } = req.body;
  let errors = [];

  //check all fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "please fill all fields" });
  }

  //check password match
  if (password != password2) {
    errors.push({ msg: "password do not match" });
  }

  //check password length
  if (password.length < 6) {
    errors.push({ msg: "password is too short" });
  }

  if (errors.length > 0) {
    res.render("signup", {
      errors,
      name,
      email,
      password,
      password2,
      role
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        //user exists
        errors.push({ msg: "Email already registered" });
        res.render("signup", {
          errors,
          name,
          email,
          password,
          password2,
          role
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          role
        });

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            console.log(hash);
            //set new password
            newUser.password = hash;
            console.log(newUser);
            //save user
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  // console.log(req);
  User.findOne({ email: req.body.email }).then(data => {
    // console.log(data);
    if (data.role == "Student") {
      passport.authenticate("local", {
        successRedirect: "/users/admin",
        failureRedirect: "/users/signin",
        failureFlash: true
      })(req, res, next);
    } else if (data.role == "Admin") {
      passport.authenticate("local", {
        successRedirect: "/users/admin",
        failureRedirect: "/users/signin",
        failureFlash: true
      })(req, res, next);
    } else {
      res.redirect("/users/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
