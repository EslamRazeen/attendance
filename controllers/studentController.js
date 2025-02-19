const StudentInfoSchema = require("../models/studentInfoSchema");
const factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");

const createUser_student = asyncHandler(async (req, res, next) => {
  console.log("Request Body:", req.body);

  if (!req.body.users || !req.body.users.length) {
    return res.status(400).json({ message: "No users found in request body" });
  }

  try {
    const users = await StudentInfoSchema.insertMany(req.body.users);
    res.status(201).json({ message: "Users created successfully", users });
  } catch (error) {
    console.error("Database Error:", error);
    res
      .status(500)
      .json({ message: "Error creating users", error: error.message });
  }
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
