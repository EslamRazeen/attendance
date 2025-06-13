const express = require("express");
const multer = require("multer");

const router = express.Router();

const studentController = require("../controllers/studentController");
const authController = require("../controllers/authController");
const authStudentController = require("../controllers/authControllerStudent");
const validatorOfStudent = require("../utils/validators/studentValidator");

const excelParser = require("../middlewares/excelParser");
const upload = multer({ storage: multer.memoryStorage() });
// const validatorOfCourse = require("../utils/validators/");

router.put(
  "/updateMyPassword",
  authStudentController.protect,
  validatorOfStudent.updateLoggedStudentPassword,
  studentController.updateLoggedStudentPassword
);

router.post(
  "/excel",
  validatorOfStudent.createStudentValidator,
  upload.single("file"),
  excelParser,
  studentController.createUser_student
);

router.post(
  "/",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  validatorOfStudent.createStudentValidator,
  studentController.createStudent
);
router.get("/", studentController.getAllStudents);
router.get(
  "/:id",
  validatorOfStudent.getStudentValidator,
  studentController.getOneStudent
);
router.put(
  "/:id",
  authController.protect,
  //   authController.allowedTo("staff", "lecturer"),
  validatorOfStudent.updateStudentValidator,
  studentController.updateStudent
);
router.delete(
  "/:id",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  validatorOfStudent.deleteStudentValidator,
  studentController.deleteStudent
);

// Add and Remove course from studnets
router.post(
  "/addCourse",
  authController.protect,
  studentController.addCourseToStudent
);
router.delete(
  "/removeCourse/:courseId",
  authController.protect,
  studentController.removeCourseFromStudent
);
router.post(
  "/fingerprintRegister",
  authController.protect,
  studentController.fingerprintRegister
);

module.exports = router;
