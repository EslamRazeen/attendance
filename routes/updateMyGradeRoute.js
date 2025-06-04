const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const updateMyGrade = require("../controllers/updateMyGradeController");

router.put("/", authController.protect, updateMyGrade.updateMyGrade);

module.exports = router;
