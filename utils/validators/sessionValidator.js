const { check } = require("express-validator");

const validator = require("../../middlewares/validatorMiddleware");

const createSessionValidator = [
  check("course")
    .notEmpty()
    .withMessage("Course is required")
    .isMongoId()
    .withMessage("Invalid Course ID"),
  check("QRcodeChangeSpeed")
    .optional()
    .isNumeric()
    .withMessage("QRcode ChangeSpeed must be Number"),
  check("QRcodeTimeWorking")
    .optional()
    .isNumeric()
    .withMessage("QRcode TimeWorking must be Number"),
  validator,
];
const updateSessionValidator = [
  check("sessionDate")
    .optional()
    .isDate()
    .withMessage("session date must be Date"),
  check("lecturer").optional().isMongoId().withMessage("Invalid lecture ID"),
  check("course").optional().isMongoId().withMessage("Invalid Course ID"),
  check("QRcodeChangeSpeed")
    .optional()
    .isNumeric()
    .withMessage("QRcode ChangeSpeed must be Number"),
  check("QRcodeTimeWorking")
    .optional()
    .isNumeric()
    .withMessage("QRcode TimeWorking must be Number"),
  validator,
];

const deleteSessionValidator = [
  check("id").isMongoId().withMessage("Invalid Session id format"),
  validator,
];

const getSessionValidator = [
  // 1) rules
  check("id").isMongoId().withMessage("Invalid Session id format"),
  // 2) middleWare
  validator,
];

module.exports = {
  createSessionValidator,
  updateSessionValidator,
  deleteSessionValidator,
  getSessionValidator,
};
