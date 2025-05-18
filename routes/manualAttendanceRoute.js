const express = require("express");

const router = express.Router();

const manualAttendace = require("../controllers/manualAttendanceController");
const authController = require("../controllers/authController");

router
  .route("/:sessionId")
  .get(authController.protect, manualAttendace.manualStudent);

module.exports = router;
