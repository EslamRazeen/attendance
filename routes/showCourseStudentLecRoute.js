const express = require("express");

const router = express.Router();

const showStudents = require("../controllers/showCourseStudents_Lecturer");
const authController = require("../controllers/authController");

router
  .route("/:courseID")
  .get(authController.protect, showStudents.showStudent);

module.exports = router;
