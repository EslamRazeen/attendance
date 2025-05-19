const express = require("express");

const router = express.Router();

const dashboardAdmin = require("../controllers/dashboardAdminController");
const authController = require("../controllers/authController");

router.route("/").get(authController.protect, dashboardAdmin.getWeeklySummary);

module.exports = router;
