const { check } = require("express-validator");
// const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const validator = require("../../middlewares/validatorMiddleware");
const userSchema = require("../../models/usersSchema");

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

// const updateLoggedUserValidator = [
//   check("name")
//     .optional()
//     .notEmpty()
//     .withMessage("User name is required")
//     .isLength({ min: 3, max: 20 })
//     .withMessage("length of name must between 3 and 20")
//     .custom((val, { req }) => {
//       req.body.slug = slugify(val);
//       return true;
//     }),
//   check("email")
//     .optional()
//     .notEmpty()
//     .withMessage("Email is required")
//     .isEmail()
//     .withMessage("Invalid email address")
//     .custom(async (val) => {
//       const user = await userSchema.findOne({ email: val });
//       if (user) {
//         throw new Error("This Email in use");
//       }
//     }),
//   check("phone")
//     .optional()
//     .isMobilePhone(["ar-EG", "ar-SA"])
//     .withMessage("Invalid phone number, Only EGY or SA phone numbers"),
//   check("profileImage").optional(),
//   check("role").optional(),
//   validator,
// ];

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

module.exports = {
  getUserValidator,
  createUserVAlidator,
  updateUserValidator,
  deleteUserValidator,
  updatePassword,
  updateLoggedUserPassword,
  // updateLoggedUserValidator,
};
