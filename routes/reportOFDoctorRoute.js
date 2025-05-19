const express = require("express");

const router = express.Router();

const reportOFDoctorAttendancesController = require("../controllers/reportOFDoctorAttendances");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(
    authController.protect,
    reportOFDoctorAttendancesController.attendanceReport
  );

module.exports = router;
