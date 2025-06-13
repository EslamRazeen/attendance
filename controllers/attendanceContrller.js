const asyncHandler = require("express-async-handler");
// const mongoose = require("mongoose");

const factory = require("./handlerFactory");
const Attendance = require("../models/attendancesSchema");
const Session = require("../models/sessionsSchema");
const Student = require("../models/studentInfoSchema");

const createAttendance = asyncHandler(async (req, res) => {
  const { student, sessionID, attendanceStatus } = req.body;
  const sessionExists = await Session.findById(sessionID);
  if (!sessionExists)
    return res.status(404).json({ message: "Session not found" });

  const studentExists = await Student.find({
    courses: { $in: [sessionExists.course] },
    _id: student,
  });

  if (!studentExists || studentExists.length === 0)
    return res.status(404).json({ message: "Student not found" });

  const studentAttendance = await Attendance.findOneAndUpdate(
    { sessionID, student },
    { attendanceStatus, scanDate: new Date() },
    { upsert: true, new: true }
  );
  res.json({ message: "Attendance marked successfully!", studentAttendance });
});

const fingerprintAttendance = asyncHandler(async (req, res) => {
  const { fingerprintStudentId, sessionID } = req.body;
  const sessionExists = await Session.findById(sessionID);
  if (!sessionExists)
    return res.status(404).json({ message: "Session not found" });

  const timeWorking = sessionExists.QRcodeTimeWorking * 60 * 1000;
  const sesstionCreateAt = new Date(sessionExists.createdAt).getTime();
  const now = Date.now();
  if (now - sesstionCreateAt > timeWorking) {
    return res.status(400).json("Session expired");
  }

  const studentExists = await Student.findOne({
    fingerprint: fingerprintStudentId,
    courses: { $in: [sessionExists.course] },
  });
  if (!studentExists)
    return res.status(404).json({ message: "Student not found" });

  const attendance = await Attendance.findOneAndUpdate(
    { sessionID, student: studentExists._id },
    { attendanceStatus: "present", scanDate: new Date() },
    { upsert: true, new: true }
  );
  res.json({
    message: "Fingerpring Attendance marked successfully!",
    attendance,
  });
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
  fingerprintAttendance,
};
