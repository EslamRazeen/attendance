const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const authStudnetController = require("../controllers/authControllerStudent");
const validatorOfauth = require("../utils/validators/authValidator");

router.post("/signup", validatorOfauth.signupValidator, authController.signUp);
router.post("/login", validatorOfauth.loginValidator, authController.login);

router.post(
  "/student/signup",
  validatorOfauth.signupValidator,
  authStudnetController.signUp
);
router.post(
  "/student/login",
  validatorOfauth.loginValidator,
  authStudnetController.login
);

module.exports = router;
