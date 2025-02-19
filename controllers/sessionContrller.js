const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const QRCode = require("qrcode");

const sessionSchema = require("../models/sessionsSchema");
const factory = require("./handlerFactory");
const Session = require("../models/sessionsSchema");
const Attendance = require("../models/attendancesSchema");
const Student = require("../models/studentInfoSchema");
const QRCodeModel = require("../models/QRcodeSchema");

const createSession = asyncHandler(async (req, res, next) => {
  // create new session
  const session = new Session({
    course: req.body.course,
    lecturer: req.body.lecturer,
    sessionDate: Date.now(),
    // QRCode: generateQRCode(sessionId)
  });
  await session.save();

  // fetch all students that erolled in this course
  const courseId = new mongoose.Types.ObjectId(req.body.course);
  const students = await Student.find({ courses: { $in: [courseId] } }); //await Student.find({ courses: req.body.course });
  console.log(students);
  if (!students) {
    return res
      .status(404)
      .json({ message: "There are no students erolled in this course" });
  }
  await Promise.all(
    students.map((student) =>
      Attendance.create({
        student: student._id,
        sessionDate: session._id,
        attendanceStatus: "absent",
        scanDate: Date.now(),
      })
    )
  );

  const qrCodeData = JSON.stringify({
    sessionId: session._id,
    courseId: req.body.courseId,
    sessionDate: session.sessionDate,
  });
  const qrCode = await QRCode.toDataURL(qrCodeData);

  // save QR Code in DB
  const qrCodeEntry = new QRCodeModel({
    sessionId: session._id,
    qrCodeData: qrCode,
    expiresAt: new Date(Date.now() + 5 * 1000), // finish after 5 second
  });
  await qrCodeEntry.save();

  res.status(201).json({
    message: "Session created successfully",
    sessionId: session._id,
    qrCode,
  });
});
//factory.createDocument(sessionSchema);

const getAllSessions = factory.getAllDocuments(sessionSchema);

const getOneSession = factory.getOneDocument(sessionSchema);

const updateSession = factory.updateDocument(sessionSchema);

const deleteSession = factory.deleteDocument(sessionSchema);

module.exports = {
  createSession,
  getAllSessions,
  getOneSession,
  updateSession,
  deleteSession,
};
