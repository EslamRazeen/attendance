const express = require("express");

const router = express.Router();

const reportOFStaffDoctorAttendancesController = require("../controllers/reportOFStaffDoctorAttendances");
const authController = require("../controllers/authController");

router
  .route("/:courseId")
  .get(
    authController.protect,
    reportOFStaffDoctorAttendancesController.attendanceReport
  );

module.exports = router;
