const express = require("express");

const router = express.Router();

const showStudents = require("../controllers/showCourseStudents_Lecturer");
const authController = require("../controllers/authController");

router
  .route("/:courseID")
  .post(authController.protect, showStudents.showStudent);

module.exports = router;
