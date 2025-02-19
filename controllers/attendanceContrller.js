const asyncHandler = require("express-async-handler");

const factory = require("./handlerFactory");
const Attendance = require("../models/attendancesSchema");
const Session = require("../models/sessionsSchema");
const User = require("../models/usersSchema");

const createAttendance = asyncHandler(async (req, res) => {
  const { student, sessionDate, attendanceStatus } = req.body;
  const sessionExists = await Session.findById(sessionDate);
  if (!sessionExists)
    return res.status(404).json({ message: "Session not found" });

  const studentExists = await User.findById(student);
  if (!studentExists || studentExists.role !== "student")
    return res.status(404).json({ message: "Student not found" });

  await Attendance.findOneAndUpdate(
    { sessionDate, student },
    { attendanceStatus, scanDate: new Date() },
    { upsert: true, new: true }
  );
  res.json({ message: "Attendance marked successfully!" });
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
