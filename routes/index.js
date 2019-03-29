const express = require("express");
const router = express.Router();

//indexPage
router.get("/", (req, res) => res.redirect("/users/admin"));

module.exports = router;
