const express = require("express");

const router = express.Router();

const dashboardStaff = require("../controllers/dashboardDoctorController");
const authController = require("../controllers/authController");

router
  .route("/:courseId")
  .post(authController.protect, dashboardStaff.getAttendanceSummary);

module.exports = router;
