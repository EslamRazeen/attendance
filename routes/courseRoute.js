const express = require("express");

const router = express.Router();

const courseController = require("../controllers/courseController");
const authController = require("../controllers/authController");
// const validatorOfCourse = require("../utils/validators/");

router.post(
  "/",
  authController.protect,
  authController.allowedTo("staff"),
  // validatorOfCourse.createBrandVAlidator,
  courseController.createCourse
);
router.get("/", courseController.getAllCourses);
router.get(
  "/:id",
  // validatorOfCourse.getBrandValidator,
  courseController.getOneCourse
);
router.put(
  "/:id",
  authController.protect,
  authController.allowedTo("staff"),
  // validatorOfCourse.updateBrandValidator,
  courseController.updateCourse
);
router.delete(
  "/:id",
  authController.protect,
  authController.allowedTo("staff"),
  // validatorOfCourse.deleteBrandValidator,
  courseController.deleteCourse
);

module.exports = router;
