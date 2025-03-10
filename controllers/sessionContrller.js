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
    lecturer: req.user._id,
    sessionDate: Date.now(),
    QRcodeChangeSpeed: req.body.changeSpeed,
    QRcodeTimeWorking: req.body.timeWorking,
  });
  await session.save();

  // fetch all students that erolled in this course
  const courseId = req.body.course;
  const students = await Student.find({
    courses: { $in: courseId },
  });

  // const allStudents = await Student.find({}, { name: 1, courses: 1 });
  // console.log(allStudents);

  if (!students) {
    return res
      .status(404)
      .json({ message: "There are no students erolled in this course" });
  }
  await Promise.all(
    students.map((student) =>
      Attendance.create({
        student: student._id,
        sessionID: session._id,
        courseId: session.course,
        attendanceStatus: "absent",
        scanDate: Date.now(),
        sessionType:
          req.user.lecturerRole === "instructor" ? "lecture" : "section",
      })
    )
  );

  const qrCodeData = JSON.stringify({
    sessionId: session._id,
    courseId: req.body.course,
    sessionDate: session.sessionDate,
    expiresAt: new Date(Date.now() + session.QRcodeChangeSpeed * 1000),
  });
  const qrCode = await QRCode.toDataURL(qrCodeData);

  // save QR Code in DB
  const qrCodeEntry = new QRCodeModel({
    sessionId: session._id,
    qrCodeData: qrCode,
    expiresAt: new Date(Date.now() + session.QRcodeChangeSpeed * 1000),
  });
  await qrCodeEntry.save();

  res.status(201).json({
    message: "Session created successfully",
    sessionId: session._id,
    changeSpeed: session.QRcodeChangeSpeed,
    timeWorking: session.QRcodeTimeWorking,
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
