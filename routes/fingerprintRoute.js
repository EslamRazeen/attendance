const express = require("express");

const router = express.Router();

const fingerprintController = require("../controllers/fingerprintController");
const authController = require("../controllers/authController");
const userAndStuentProtect = require("../middlewares/accessUserAndStuentToCreateAttendance");

// Enrollment Routes
router.post(
  "/enroll/fingerprintFirstRegister",
  authController.protect,
  fingerprintController.fingerprintFirstRegister
);
router.get(
  "/enroll/getFingerprintRegister",
  authController.protect,
  fingerprintController.getFingerprintRegister
);
router.post(
  "/enroll/fingerprintConfirmRegister",
  authController.protect,
  fingerprintController.fingerprintConfirmRegister
);

// Verification Routes
router.post(
  "/verify/fingerprintFirstVerify",
  userAndStuentProtect.userAndStuentProtect,
  fingerprintController.fingerprintVerify
);
router.get(
  "/getAllFingerprints",
  userAndStuentProtect.userAndStuentProtect,
  fingerprintController.getAllFingerprints
);

router.get(
  "/verify/getPendingFingerprintVerify",
  userAndStuentProtect.userAndStuentProtect,
  fingerprintController.getPendingFingerprintVerify
);
router.post(
  "/verify/fingerprintConfirmVerify",
  userAndStuentProtect.userAndStuentProtect,
  fingerprintController.fingerprintConfirmVerify
);

router.get(
  "/:id",
  userAndStuentProtect.userAndStuentProtect,
  fingerprintController.getOneFingerprint
);
router.delete(
  "/:id",
  userAndStuentProtect.userAndStuentProtect,
  fingerprintController.deleteFingerprint
);
router.delete(
  "/",
  userAndStuentProtect.userAndStuentProtect,
  fingerprintController.deleteAllFingerprints
);

module.exports = router;
