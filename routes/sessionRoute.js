const express = require("express");

const router = express.Router();

const sessionController = require("../controllers/sessionContrller");
const authController = require("../controllers/authController");
const generateQRCodeController = require("../controllers/generateQRcode");
// const validatorOfCourse = require("../utils/validators/");

router.post(
  "/",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  // validatorOfCourse.createBrandVAlidator,
  sessionController.createSession
);
router.get("/", sessionController.getAllSessions);
router.get(
  "/:id",
  // validatorOfCourse.getBrandValidator,
  sessionController.getOneSession
);
router.put(
  "/:id",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  // validatorOfCourse.updateBrandValidator,
  sessionController.updateSession
);
router.delete(
  "/:id",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  // validatorOfCourse.deleteBrandValidator,
  sessionController.deleteSession
);

router.get("/:sessionId/qrcode", generateQRCodeController.updateQRCode);

module.exports = router;
