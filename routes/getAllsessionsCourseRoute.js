const express = require("express");

const router = express.Router();

const sessionsCourse = require("../controllers/getAllsessionsOFSpecifcCourse");
const authController = require("../controllers/authController");

router
  .route("/:courseId")
  .get(authController.protect, sessionsCourse.sessionsCourse);

module.exports = router;
