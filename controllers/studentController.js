const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const factory = require("./handlerFactory");
const StudentInfoSchema = require("../models/studentInfoSchema");
const Course = require("../models/coursesSchema");

const ApiError = require("../utils/apiError");
const studentInfoSchema = require("../models/studentInfoSchema");

const createUser_student = asyncHandler(async (req, res, next) => {
  if (!req.body.users || !req.body.users.length) {
    throw new ApiError("No users found in request body", 400);
  }

  const emails = req.body.users.map((user) => user.email);

  // check if emails in db
  const existingUsers = await StudentInfoSchema.find({
    email: { $in: emails },
  }).select("email");
  const existingEmails = new Set(existingUsers.map((user) => user.email));

  // return users not in db
  const newUsers = req.body.users.filter(
    (user) => !existingEmails.has(user.email)
  );

  if (!newUsers.length) {
    return next(
      new ApiError("All users in the Excel sheet already exist.", 400)
    );
  }

  for (const student of newUsers) {
    const matchedCourses = await Course.find({
      department: student.department,
      level: student.level,
      semester: student.semester,
    });
    student.courses = matchedCourses.map((course) => course._id);
    // console.log(matchedCourses);
    // console.log(student.course);
    // console.log(student);
  }

  // insert users that not in db before
  const usersInserted = await StudentInfoSchema.insertMany(newUsers);

  res.status(201).json({
    message: "Users created successfully",
    totalInserted: usersInserted.length,
    totalSkipped: req.body.users.length - usersInserted.length,
    skippedEmails: [...existingEmails],
  });
});

const createStudent = asyncHandler(async (req, res) => {
  const document = await studentInfoSchema.insertMany(req.body);
  res.status(200).json({ data: document });
});
// factory.createDocument(StudentInfoSchema);

const getAllStudents = factory.getAllDocuments(StudentInfoSchema);

const getOneStudent = factory.getOneDocument(StudentInfoSchema);

const updateStudent = factory.updateDocument(StudentInfoSchema);

const deleteStudent = factory.deleteDocument(StudentInfoSchema);

const updateLoggedStudentPassword = asyncHandler(async (req, res, next) => {
  const user = await StudentInfoSchema.findByIdAndUpdate(req.student._id, {
    password: await bcrypt.hash(req.body.newPassword, 12),
    passwordChangedAt: Date.now(),
  });
  res
    .status(200)
    .json({ message: "User password updated successfully", data: user });
});

module.exports = {
  createStudent,
  getAllStudents,
  getOneStudent,
  updateStudent,
  deleteStudent,
  createUser_student,
  updateLoggedStudentPassword,
};
