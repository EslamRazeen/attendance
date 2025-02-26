const { check } = require("express-validator");

const validator = require("../../middlewares/validatorMiddleware");

const createAttendanceValidator = [
  check("sessionID")
    .notEmpty()
    .withMessage("SessionId is required")
    .isMongoId()
    .withMessage("Invalid Session ID"),
  check("attendanceStatus")
    .notEmpty()
    .withMessage(
      "attendanceStatus is required, choose between [present, absent] only"
    ),
  check("scanDate").optional().isDate().withMessage("scan date must be Date"),
  check("student")
    .notEmpty()
    .withMessage("Student id is required")
    .isMongoId()
    .withMessage("Invalid Student ID"),
  //   check("courseId")
  //     .notEmpty()
  //     .withMessage("Course id is required")
  //     .isMongoId()
  //     .withMessage("Invalid Course ID"),
  check("sessionType")
    .notEmpty()
    .withMessage("Session type is required")
    .isIn(["lecture", "section"])
    .withMessage("Must choose [lecture or section]"),
  validator,
];

const updateAttendanceValidator = [
  check("id").isMongoId().withMessage("Invalid ID"),
  check("sessionID").optional().isMongoId().withMessage("Invalid Session ID"),
  check("attendanceStatus").optional(),
  check("scanDate").optional().isDate().withMessage("scan date must be Date"),
  check("student").optional().isMongoId().withMessage("Invalid Student ID"),
  check("courseId").optional().isMongoId().withMessage("Invalid Course ID"),
  check("sessionType").optional(),
  validator,
];

const deleteAttendanceValidator = [
  check("id").isMongoId().withMessage("Invalid Attendance id format"),
  validator,
];

const getAttendanceValidator = [
  // 1) rules
  check("id").isMongoId().withMessage("Invalid User id format"),
  // 2) middleWare
  validator,
];

module.exports = {
  createAttendanceValidator,
  updateAttendanceValidator,
  deleteAttendanceValidator,
  getAttendanceValidator,
};
