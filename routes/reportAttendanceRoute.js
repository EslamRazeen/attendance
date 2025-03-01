const express = require("express");

const router = express.Router();

const reportOFAttendancesController = require("../controllers/reportOFAttendances");
const authController = require("../controllers/authController");

router
  .route("/:courseID")
  .get(authController.protect, reportOFAttendancesController.attendanceReport);

module.exports = router;
