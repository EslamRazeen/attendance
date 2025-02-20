const StudentInfoSchema = require("../models/studentInfoSchema");
const factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");

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

  // insert users that not in db before
  const usersInserted = await StudentInfoSchema.insertMany(newUsers);

  res.status(201).json({
    message: "Users created successfully",
    totalInserted: usersInserted.length,
    totalSkipped: req.body.users.length - usersInserted.length,
    skippedEmails: [...existingEmails],
  });
});

const createStudent = factory.createDocument(StudentInfoSchema);

const getAllStudents = factory.getAllDocuments(StudentInfoSchema);

const getOneStudent = factory.getOneDocument(StudentInfoSchema);

const updateStudent = factory.updateDocument(StudentInfoSchema);

const deleteStudent = factory.deleteDocument(StudentInfoSchema);

module.exports = {
  createStudent,
  getAllStudents,
  getOneStudent,
  updateStudent,
  deleteStudent,
  createUser_student,
};
