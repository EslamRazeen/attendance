const express = require("express");

const router = express.Router();

const reportStaff = require("../controllers/reportSfaffController");
const authController = require("../controllers/authController");

router.route("/").get(authController.protect, reportStaff.getAttendanceByDay);

module.exports = router;
