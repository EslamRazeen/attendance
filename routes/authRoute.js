const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const validatorOfauth = require("../utils/validators/authValidator");

router.post("/signup", validatorOfauth.signupValidator, authController.signUp);
router.post("/login", validatorOfauth.loginValidator, authController.login);

module.exports = router;
