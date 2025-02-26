const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const validatorOfUser = require("../utils/validators/userValidator");
const authController = require("../controllers/authController");

router.use(authController.protect);
// Logged user
router.get("/getMe", userController.getLoggedUser, userController.getOneUser);

router.put(
  "/updateMyPassword",
  validatorOfUser.updateLoggedUserPassword,
  userController.updateLoggedUserPassword
);

// Admin
router.use(authController.allowedTo("staff"));
router
  .route("/:id/updatePassword")
  .put(validatorOfUser.updatePassword, userController.updatUserPassword);

router
  .route("/")
  .post(validatorOfUser.createUserVAlidator, userController.createUser)
  .get(userController.getAllUsers);

router
  .route("/:id")
  .get(validatorOfUser.getUserValidator, userController.getOneUser)
  .put(validatorOfUser.updateUserValidator, userController.updateUser)
  .delete(validatorOfUser.deleteUserValidator, userController.deleteUser);

router.post(
  "/addCourses",
  validatorOfUser.addCourseToLecturerValidator,
  userController.addCourseToLecturer
);
router.delete(
  "/deleteCourses/:courseId",
  validatorOfUser.removeCourseToLecturerValidator,
  userController.removeCourseFromLecturer
);

module.exports = router;
