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
router.get(
  "/enroll/getAllEnrollFingerprints",
  authController.protect,
  fingerprintController.getAllEnrollFingerprints
);

// Verification Routes
router.post(
  "/verify/fingerprintFirstVerify",
  userAndStuentProtect.userAndStuentProtect,
  fingerprintController.fingerprintVerify
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
  "/verify/getAllVerifyFingerprints",
  userAndStuentProtect.userAndStuentProtect,
  fingerprintController.getAllVerifyFingerprints
);

// Options
router.get(
  "/getAllFingerprints",
  userAndStuentProtect.userAndStuentProtect,
  fingerprintController.getAllFingerprints
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
