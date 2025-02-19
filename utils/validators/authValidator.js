const { check } = require("express-validator");

const validator = require("../../middlewares/validatorMiddleware");
const userSchema = require("../../models/usersSchema");

const signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Too short name"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (val) => {
      const user = await userSchema.findOne({ email: val });
      if (user) {
        throw new Error("This email already in use");
      }
      return true;
    }),
  check("password").notEmpty().withMessage("Password is required"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),
  validator,
];

const loginValidator = [
  check("username").notEmpty().withMessage("Username is required"),
  // .isEmail()
  // .withMessage("Invalid email"),
  check("password").notEmpty().withMessage("Password is required"),
  validator,
];

module.exports = {
  signupValidator,
  loginValidator,
};
