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
  const students = [];
  let matchedCourses = [];
  for (const student of req.body) {
    matchedCourses = await Course.find({
      department: student.department,
      level: student.level,
      // semester: student.semester,
    });
    student.courses = matchedCourses.map((course) => course._id);
    student.password = await bcrypt.hash(student.password, 12);
    students.push(student);
  }

  const documents = await studentInfoSchema.insertMany(students);
  const insertedIds = documents.map((doc) => doc._id);

  // i used .find because i want to show courses name and id
  const newStudents = await studentInfoSchema.find({
    _id: { $in: insertedIds },
  });

  res.status(200).json({ data: newStudents });
});
// factory.createDocument(StudentInfoSchema);

const getAllStudents = factory.getAllDocuments(StudentInfoSchema);

const getOneStudent = factory.getOneDocument(StudentInfoSchema);

const updateStudent = asyncHandler(async (req, res, next) => {
  const student = await studentInfoSchema.findById(req.params.id);
  if (!student) {
    return next(new ApiError(`There is no student with this id`, 404));
  }
  const isLevelChanged =
    req.body.hasOwnProperty("level") && req.body.level !== student.level;
  if (isLevelChanged) {
    const newCourses = await Course.find({
      level: req.body.level,
      department: student.department,
    });
    req.body.courses = newCourses.map((course) => course._id);
  }

  const document = await StudentInfoSchema.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`There is no document with this id`, 404));
  }
  // console.log(req.body);

  res.status(200).json({
    message: "Student updated successfully",
    data: document,
  });
});

const addCourseToStudent = asyncHandler(async (req, res, next) => {
  const { studentId, courseId } = req.body;

  const student = await studentInfoSchema.findByIdAndUpdate(
    studentId,
    {
      $addToSet: { courses: courseId },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    message: "Course added successfully to student courses",
    numberOfCourses: student.courses.length,
    data: student.courses,
  });
});

const removeCourseFromStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.body;
  const student = await studentInfoSchema.findByIdAndUpdate(
    studentId,
    {
      $pull: { courses: req.params.courseId },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    message: "Course removed successfully from studnet courses",
    numberOfCourses: student.courses.length,
    data: student.courses,
  });
});

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
  addCourseToStudent,
  removeCourseFromStudent,
};
