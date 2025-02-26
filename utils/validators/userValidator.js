const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const validator = require("../../middlewares/validatorMiddleware");
const userSchema = require("../../models/usersSchema");
const studentSchema = require("../../models/studentInfoSchema");
const courseSchema = require("../../models/coursesSchema");

const getUserValidator = [
  // 1) rules
  check("id").isMongoId().withMessage("Invalid User id format"),
  // 2) middleWare
  validator,
];

const createUserVAlidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("length of name must between 3 and 20"),
  // .custom((val, { req }) => {
  //   req.body.slug = slugify(val);
  //   return true;
  // }),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (val) => {
      const user = await userSchema.findOne({ email: val });
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
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirm is required"),
  check("role").optional(),
  check("lecturerRole")
    .optional()
    .isIn(["instructor", "assistant"])
    .withMessage("Must choose [instructor or assistant]"),
  check("lecturerDepartment").optional(),
  check("lecturerCourses")
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

const updateUserValidator = [
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
      const user = await userSchema.findOne({ email: val });
      if (user) {
        throw new Error("This Email in use");
      }
    }),
  check("role").optional(),
  check("lecturerRole").optional(),
  check("lecturerDepartment").optional(),
  check("lecturerCourses")
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
      const user = await userSchema.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this ID");
      }
      const isCorrectPass = await bcrypt.compare(val, user.password);
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

const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validator,
];

const updateLoggedUserPassword = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required")
    .custom(async (val, { req }) => {
      const user = await userSchema.findById(req.user._id);
      const isCorrectPass = await bcrypt.compare(val, user.password);
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

const updateLoggedStudentPassword = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required")
    .custom(async (val, { req }) => {
      console.log(req.student);
      const user = await studentSchema.findById(req.student._id);
      const isCorrectPass = await bcrypt.compare(val, user.password);
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

const addCourseToLecturerValidator = [
  check("courseId")
    .isMongoId()
    .withMessage("Invalid course Id")
    .custom(async (val) => {
      const course = await courseSchema.findById(val);
      if (!course) {
        throw new Error(`There is no course with this id: ${val}`);
      }
      return true;
    }),
  check("userId")
    .isMongoId()
    .withMessage("Invalid user Id")
    .custom(async (val) => {
      const user = await userSchema.findById(val);
      if (!user) {
        throw new Error(`There is no user with this id: ${val}`);
      }
      return true;
    }),
  validator,
];

const removeCourseToLecturerValidator = [
  check("courseId")
    .isMongoId()
    .withMessage("Invalid course Id")
    .custom(async (val, { req }) => {
      const course = await courseSchema.findById(val);
      if (!course) {
        throw new Error(`There is no course with this id: ${val}`);
      }
      const user = await userSchema.findById(req.body.userId);
      const courseExists = user.lecturerCourses.map(
        (lecCourse) => lecCourse._id.toString() === val
      );
      if (!courseExists || !courseExists.length) {
        throw new Error(`This lecture doesn't has this course: ${val}`);
      }
    }),
  check("userId")
    .isMongoId()
    .withMessage("Invalid user Id")
    .custom(async (val) => {
      const user = await userSchema.findById(val);
      if (!user) {
        throw new Error(`There is no user with this id: ${val}`);
      }
      return true;
    }),
  validator,
];

module.exports = {
  getUserValidator,
  createUserVAlidator,
  updateUserValidator,
  deleteUserValidator,
  updatePassword,
  updateLoggedUserPassword,
  updateLoggedStudentPassword,
  addCourseToLecturerValidator,
  removeCourseToLecturerValidator,
};
