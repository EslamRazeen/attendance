// const xlsx = require("xlsx");
// const fs = require("fs");
// const asyncHandler = require("express-async-handler");

// const excelParser = asyncHandler(async (req, res, next) => {
//   console.log(req.file);
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   // reading of sheet
//   const workbook = xlsx.read(req.file.buffer, { type: "buffer" }); //.readFile(req.file.path);
//   const sheetName = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheetName];

//   // convert sheet ot json
//   const usersData = xlsx.utils.sheet_to_json(sheet);
//   console.log(users);
//   let students = [];

//   for (const user of usersData) {
//     if (user.Role === "student") {
//       students.push({
//         name: user.name,
//         email: user.email,
//         studentLevel: user.Level,
//         courses: user.Courses ? user.Courses.split(",") : [],
//         department: user.Department,
//       });
//     }
//   }

//   req.students = students;

//   // delete file from server after reading it
//   fs.unlinkSync(req.file.path);

//   next();
// });

const multer = require("multer");
const XLSX = require("xlsx");

const upload = multer({ storage: multer.memoryStorage() });

const excelParser = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("File received:", req.file);

  if (!req.file.buffer) {
    return res.status(400).json({ message: "File buffer is empty" });
  }

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

    console.log("Workbook Sheets:", workbook.SheetNames);

    if (!workbook.SheetNames.length) {
      return res
        .status(400)
        .json({ message: "Invalid Excel file (no sheets found)" });
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const users = XLSX.utils.sheet_to_json(sheet);

    console.log("Extracted Users:", users);

    if (!users.length) {
      return res
        .status(400)
        .json({ message: "Empty Excel file or incorrect format" });
    }

    const users_Students = users.map((row) => ({
      name: row.name,
      email: row.email,
      password: row.password,
      //   passwordConfirm: row.passwordConfirm,
      studentID: row.ID,
      role: row.role || "student",
      department: row.department,
      level: row.level,
      semester: row.semester,
      courses: row.courses ? row.courses.split(",") : [],
    }));
    req.body.users = users_Students;
    next();
  } catch (error) {
    console.error("Error processing Excel file:", error);
    res.status(500).json({ message: "Error processing Excel file" });
  }
};

module.exports = excelParser;
