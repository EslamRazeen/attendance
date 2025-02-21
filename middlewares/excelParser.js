const multer = require("multer");
const XLSX = require("xlsx");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");

// const upload = multer({ storage: multer.memoryStorage() });

const excelParser = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    throw new ApiError("No file uploaded", 400);
  }

  // console.log("File received:", req.file);

  if (!req.file.buffer) {
    throw new ApiError("File buffer is empty", 400);
  }

  // try {
  const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

  // console.log("Workbook Sheets:", workbook.SheetNames);

  if (!workbook.SheetNames.length) {
    throw new ApiError("Invalid Excel file (no sheets found)", 400);
  }
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const users = XLSX.utils.sheet_to_json(sheet);

  // console.log("Extracted Users:", users);

  if (!users.length) {
    throw new ApiError("Empty Excel file or incorrect format", 400);
  }

  const users_Students = await Promise.all(
    users.map(async (row) => ({
      name: row.name,
      email: row.email,
      password: await bcrypt.hash(String(row.password), 12),
      studentID: row.ID,
      // role: row.role || "student",
      department: row.department,
      level: row.level,
      semester: row.semester,
      // courses: row.courses ? row.courses.split(",") : [],
    }))
  );
  req.body.users = users_Students;
  next();
  // } catch (error) {
  //   console.error("Error processing Excel file:", error);
  //   res.status(500).json({ message: "Error processing Excel file" });
  // }
});

module.exports = excelParser;
