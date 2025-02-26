const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const validator = require("../../middlewares/validatorMiddleware");
const Student = require("../../models/studentInfoSchema");

const getStudentValidator = [
  // 1) rules
  check("id").isMongoId().withMessage("Invalid Student id format"),
  // 2) middleWare
  validator,
];

const createStudentValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("length of name must between 3 and 20"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await Student.findOne({ email: val });
      if (user) {
        throw new Error("This Email in use");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Too short password length")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirm incorrect");
      }
      return true;
    }),
  check("role").optional(),
  check("level")
    .notEmpty()
    .withMessage("Student level is required, choose between 1 to 4"),
  check("semester").optional(),
  check("studentID").optional(),
  check("department")
    .optional()
    .isIn(["CS", "IS", "AI", "BIO"])
    .withMessage("Department must be one from these [CS, IS, AI, BIO]"),
  check("courses")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Lecturer courses must be a non-empty array")
    .custom((value) => {
      if (!value.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Invalid course ID(s) provided");
      }
      return true;
    }),
  validator,
];

const updateStudentValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("name")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("length of name must between 3 and 20"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await Student.findOne({ email: val });
      if (user) {
        throw new Error("This Email in use");
      }
    }),
  check("role").optional(),
  check("level").optional(),
  check("semester").optional(),
  check("studentID").optional(),
  check("department").optional(),
  check("courses")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Lecturer courses must be a non-empty array")
    .custom((value) => {
      if (!value.every((id) => mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Invalid course ID(s) provided");
      }
      return true;
    }),
  validator,
];

const updatePassword = [
  check("id").isMongoId().withMessage("Invalid User ID"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required")
    .custom(async (val, { req }) => {
      const student = await Student.findById(req.params.id);
      if (!student) {
        throw new Error("There is no student for this ID");
      }
      const isCorrectPass = await bcrypt.compare(val, student.password);
      if (!isCorrectPass) {
        throw new Error("Current Password Incorrect");
      }
      return true;
    }),
  check("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirm Incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm is required"),
  validator,
];

const deleteStudentValidator = [
  check("id").isMongoId().withMessage("Invalid Student id format"),
  validator,
];

const updateLoggedStudentPassword = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required")
    .custom(async (val, { req }) => {
      const student = await studentSchema.findById(req.student._id);
      const isCorrectPass = await bcrypt.compare(val, student.password);
      if (!isCorrectPass) {
        throw new Error("Current Password Incorrect");
      }
      return true;
    }),
  check("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirm Incorrect");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm is required"),
  validator,
];

module.exports = {
  getStudentValidator,
  createStudentValidator,
  updateStudentValidator,
  deleteStudentValidator,
  updatePassword,
  updateLoggedStudentPassword,
};
