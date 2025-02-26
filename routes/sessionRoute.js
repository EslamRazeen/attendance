const express = require("express");

const router = express.Router();

const sessionController = require("../controllers/sessionContrller");
const authController = require("../controllers/authController");
const generateQRCodeController = require("../controllers/generateQRcode");
const validatorOfSession = require("../utils/validators/sessionValidator");

router.post(
  "/",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  validatorOfSession.createSessionValidator,
  sessionController.createSession
);
router.get("/", sessionController.getAllSessions);
router.get(
  "/:id",
  validatorOfSession.getSessionValidator,
  sessionController.getOneSession
);
router.put(
  "/:id",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  validatorOfSession.updateSessionValidator,
  sessionController.updateSession
);
router.delete(
  "/:id",
  authController.protect,
  authController.allowedTo("staff", "lecturer"),
  validatorOfSession.deleteSessionValidator,
  sessionController.deleteSession
);

router.get("/:sessionId/qrcode", generateQRCodeController.updateQRCode);

module.exports = router;
