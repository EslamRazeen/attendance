const express = require("express");
const multer = require("multer");

const router = express.Router();

const studentController = require("../controllers/studentController");
const authController = require("../controllers/authController");

const excelParser = require("../middlewares/excelParser");
const upload = multer({ storage: multer.memoryStorage() });
// const validatorOfCourse = require("../utils/validators/");

router.post(
  "/excel",
  // validatorOfUser.createUserVAlidator,
  upload.single("file"),
  excelParser,
  studentController.createUser_student
);

router.post(
  "/",
  authController.protect,
  //   authController.allowedTo("staff", "lecturer"),
  // validatorOfCourse.createBrandVAlidator,
  studentController.createStudent
);
router.get("/", studentController.getAllStudents);
router.get(
  "/:id",
  // validatorOfCourse.getBrandValidator,
  studentController.getOneStudent
);
router.put(
  "/:id",
  authController.protect,
  //   authController.allowedTo("staff", "lecturer"),
  // validatorOfCourse.updateBrandValidator,
  studentController.updateStudent
);
router.delete(
  "/:id",
  authController.protect,
  //   authController.allowedTo("staff", "lecturer"),
  // validatorOfCourse.deleteBrandValidator,
  studentController.deleteStudent
);

module.exports = router;
