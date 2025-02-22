const express = require("express");

const router = express.Router();

const reportOfStudentAttendancesController = require("../controllers/reportOfStudentAttendance");
const authStudentController = require("../controllers/authControllerStudent");

router
  .route("/:courseID")
  .get(
    authStudentController.protect,
    reportOfStudentAttendancesController.attendanceReport
  );

module.exports = router;
