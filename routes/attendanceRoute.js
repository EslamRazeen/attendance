const express = require("express");

const router = express.Router();

const attendanceController = require("../controllers/attendanceContrller");
const authController = require("../controllers/authController");
// const validatorOfCourse = require("../utils/validators/");

router.post(
  "/",
  // authController.protect,
  //   authController.allowedTo("staff", "lecturer"),
  // validatorOfCourse.createBrandVAlidator,
  attendanceController.createAttendance
);
router.get("/", attendanceController.getAllAttendances);
router.get(
  "/:id",
  // validatorOfCourse.getBrandValidator,
  attendanceController.getOneAttendance
);
router.put(
  "/:id",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  // validatorOfCourse.updateBrandValidator,
  attendanceController.updateAttendance
);
router.delete(
  "/:id",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  // validatorOfCourse.deleteBrandValidator,
  attendanceController.deleteAttendance
);

module.exports = router;
