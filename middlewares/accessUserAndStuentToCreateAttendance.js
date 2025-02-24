const asyncHanler = require("express-async-handler");

const authController = require("../controllers/authController");
const authStudentController = require("../controllers/authControllerStudent");

const userAndStuentProtect = asyncHanler(async (req, res, next) => {
  const [studentCheck, userCheck] = await Promise.allSettled([
    authStudentController.protect(req, res, () => {}),
    authController.protect(req, res, () => {}),
  ]);

  if (studentCheck.status === "fulfilled" || userCheck.status === "fulfilled") {
    return next();
  }

  res.status(401).json({ message: "Unauthorized" });
});

module.exports = { userAndStuentProtect };
