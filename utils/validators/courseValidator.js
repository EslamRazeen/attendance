const { check } = require("express-validator");

const validator = require("../../middlewares/validatorMiddleware");
const Course = require("../../models/coursesSchema");

const createCourseValidator = [
  check("courseName").notEmpty().withMessage("course name is required"),
  check("courseCode")
    .notEmpty()
    .withMessage("course code is required")
    .custom(async (val) => {
      const course = await Course.findOne({ courseCode: val });
      console.log(course);
      if (course) {
        throw new Error("Course code must be unique");
      }
      return true;
    }),
  check("department")
    .notEmpty()
    .withMessage("department is required, choose between [CS, IS, AI, BIO]"),
  check("semester")
    .notEmpty()
    .withMessage("Semester is required between 1 to 8"),
  check("level").notEmpty().withMessage("Level is required between 1 to 4"),
  validator,
];

const updateCourseValidator = [
  check("courseName").optional(),
  check("courseCode")
    .optional()
    .custom(async (val) => {
      const course = await Course.findOne({ courseCode: val });
      if (course) {
        throw new Error("Course code must be unique");
      }
    }),
  check("department").optional(),
  check("semester").optional(),
  check("level").optional(),
  validator,
];

const deleteCourseValidator = [
  check("id").isMongoId().withMessage("Invalid Course id format"),
  validator,
];

const getCourseValidator = [
  // 1) rules
  check("id").isMongoId().withMessage("Invalid Course id format"),
  // 2) middleWare
  validator,
];

module.exports = {
  createCourseValidator,
  updateCourseValidator,
  deleteCourseValidator,
  getCourseValidator,
};
