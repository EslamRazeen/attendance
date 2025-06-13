const express = require("express");

const router = express.Router();

const attendanceController = require("../controllers/attendanceContrller");
const authController = require("../controllers/authController");
const authStudentController = require("../controllers/authControllerStudent");
const userAndStuentProtect = require("../middlewares/accessUserAndStuentToCreateAttendance");
const validatorOfAttendance = require("../utils/validators/attendanceValidator");

router.post(
  "/",
  userAndStuentProtect.userAndStuentProtect,
  validatorOfAttendance.createAttendanceValidator,
  attendanceController.createAttendance
);
router.get("/", attendanceController.getAllAttendances);
router.get(
  "/:id",
  validatorOfAttendance.getAttendanceValidator,
  attendanceController.getOneAttendance
);
router.put(
  "/:id",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  validatorOfAttendance.updateAttendanceValidator,
  attendanceController.updateAttendance
);
router.delete(
  "/:id",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  validatorOfAttendance.deleteAttendanceValidator,
  attendanceController.deleteAttendance
);

module.exports = router;
