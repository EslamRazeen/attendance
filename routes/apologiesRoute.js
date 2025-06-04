const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadImage2");
const apologyController = require("../controllers/apologiesController");
const authController = require("../controllers/authController");
const authStudentController = require("../controllers/authControllerStudent");

router.post(
  "/",
  authStudentController.protect,
  //   allowedTo("student"),
  upload.single("image"),
  apologyController.createApology
);
router.put(
  "/:id",
  authController.protect,
  authController.allowedTo("lecturer", "staff"),
  apologyController.reviewApology
);
router.get(
  "/",
  authController.protect,
  authController.allowedTo("lecturer", "staff"),
  apologyController.getAcceptedApologies
);

module.exports = router;
