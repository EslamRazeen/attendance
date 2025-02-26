const express = require("express");

const router = express.Router();

const courseController = require("../controllers/courseController");
const authController = require("../controllers/authController");
const validatorOfCourse = require("../utils/validators/courseValidator");

router.post(
  "/",
  authController.protect,
  authController.allowedTo("staff"),
  validatorOfCourse.createCourseValidator,
  courseController.createCourse
);
router.get("/", courseController.getAllCourses);
router.get(
  "/:id",
  validatorOfCourse.getCourseValidator,
  courseController.getOneCourse
);
router.put(
  "/:id",
  authController.protect,
  authController.allowedTo("staff"),
  validatorOfCourse.updateCourseValidator,
  courseController.updateCourse
);
router.delete(
  "/:id",
  authController.protect,
  authController.allowedTo("staff"),
  validatorOfCourse.deleteCourseValidator,
  courseController.deleteCourse
);

module.exports = router;
