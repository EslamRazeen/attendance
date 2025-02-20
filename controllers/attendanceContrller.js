const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const factory = require("./handlerFactory");
const Attendance = require("../models/attendancesSchema");
const Session = require("../models/sessionsSchema");
const User = require("../models/usersSchema");
const Student = require("../models/studentInfoSchema");

const createAttendance = asyncHandler(async (req, res) => {
  const { student, sessionID, attendanceStatus } = req.body;
  const sessionExists = await Session.findById(sessionID);
  if (!sessionExists)
    return res.status(404).json({ message: "Session not found" });

  // const studentExists = await Student.findById(student);
  // const studentID = new mongoose.Types.ObjectId(student);
  const studentExists = await Student.find({
    courses: { $in: [sessionExists.course] },
    _id: student,
  });
  // console.log(studentExists);

  if (!studentExists || studentExists.length === 0)
    return res.status(404).json({ message: "Student not found" });

  const studentAttendance = await Attendance.findOneAndUpdate(
    { sessionID, student },
    { attendanceStatus, scanDate: new Date() },
    { upsert: true, new: true }
  );
  res.json({ message: "Attendance marked successfully!", studentAttendance });
});

const getAllAttendances = factory.getAllDocuments(Attendance);

const getOneAttendance = factory.getOneDocument(Attendance);

const updateAttendance = factory.updateDocument(Attendance);

const deleteAttendance = factory.deleteDocument(Attendance);

module.exports = {
  createAttendance,
  getAllAttendances,
  getOneAttendance,
  updateAttendance,
  deleteAttendance,
};
