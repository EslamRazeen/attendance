const asyncHandler = require("express-async-handler");

const factory = require("./handlerFactory");
const Attendance = require("../models/attendancesSchema");
const Session = require("../models/sessionsSchema");
const Fingerprint = require("../models/fingerprintSchema");
const studentInfoSchema = require("../models/studentInfoSchema");

const fingerprintFirstRegister = asyncHandler(async (req, res, next) => {
  const { studentId, fingerprintId } = req.body;
  const student = await studentInfoSchema.findById(studentId);
  if (!student) {
    return res.status(404).json("Student not found");
  }

  const checkFingerprint = await Fingerprint.findOne({
    fingerprintId,
  });
  if (checkFingerprint) return res.status(404).json("This fingerprint in use");

  student.fingerprint = fingerprintId;
  await student.save();

  const fingerprint = await Fingerprint.create({
    studentId,
    type: "enroll",
    status: "pending",
    fingerprintId,
  });

  res
    .status(201)
    .json({ message: "Waiting for student fingerprint", data: fingerprint });
});

const getFingerprintRegister = asyncHandler(async (req, res, next) => {
  const fingerprint = await Fingerprint.findOne({
    status: "pending",
    type: "enroll",
  })
    .sort({
      createdAt: -1,
    })
    .select("type fingerprintId status studentId -_id");

  if (!fingerprint) {
    return res.status(404).json("No pending enroll request");
  }
  res.status(200).json({ data: fingerprint });
});

const fingerprintConfirmRegister = asyncHandler(async (req, res, next) => {
  const { studentId, fingerprintId } = req.body;

  //   const student = await studentInfoSchema.findById(studentId);
  //   if (!student) {
  //     return res.status(404).json("Student not found");
  //   }

  if (!fingerprintId) {
    await Fingerprint.findOneAndUpdate(
      { studentId, type: "enroll", status: "pending" },
      { status: "failed" }
    );
    return res.status(400).json("Fingerprint register failed");
  }

  const fingerprint = await Fingerprint.findOneAndUpdate(
    { studentId, fingerprintId, type: "enroll", status: "pending" },
    { status: "done", fingerprintId },
    { new: true }
  );
  if (!fingerprint) {
    return res.status(400).json("There are no fingerprints with this data");
  }

  res.status(201).json({
    message: "Fingerprint registered successfully",
    data: fingerprint,
  });
});

const fingerprintVerify = asyncHandler(async (req, res) => {
  const { sessionID } = req.body;
  const sessionExists = await Session.findById(sessionID);
  if (!sessionExists)
    return res.status(404).json({ message: "Session not found" });

  const timeWorking = sessionExists.QRcodeTimeWorking * 60 * 1000;
  const sesstionCreateAt = new Date(sessionExists.createdAt).getTime();
  const now = Date.now();
  if (now - sesstionCreateAt > timeWorking) {
    return res.status(400).json("Session expired");
  }

  const fingerprint = await Fingerprint.create({
    sessionId: sessionID,
    type: "verify",
    status: "pending",
  });

  res.status(201).json({ message: "Waiting for check", data: fingerprint });
});

// مش هستخدمه
const getPendingFingerprintVerify = asyncHandler(async (req, res, next) => {
  const fingerprint = await Fingerprint.findOne({
    status: "pending",
    type: "verify",
  })
    .sort({
      createdAt: -1,
    })
    .select("type status");

  if (!fingerprint) {
    return res.status(404).json("No pending verify request");
  }
  res.status(200).json({ data: fingerprint });
});

const fingerprintConfirmVerify = asyncHandler(async (req, res, next) => {
  const { fingerprintId, fingerprintVerificatioId } = req.body;

  const fingerprintFirsDocument = await Fingerprint.findById(
    fingerprintVerificatioId
  );
  if (!fingerprintFirsDocument) {
    return res.status(404).json("There is no fingerprint document for this id");
  }

  const student = await studentInfoSchema.findOne({
    fingerprint: fingerprintId,
  });

  if (!student) {
    return res
      .status(400)
      .json(
        "Fingerprint verify failed, There is no student has this fingerprint"
      );
  }
  const session = await Session.findById(fingerprintFirsDocument.sessionId);
  if (!session) {
    return res.status(404).json("Session not found");
  }

  const isEnrolled = student.courses.some(
    (course) => course._id.toString() === session.course.toString()
  );

  if (!isEnrolled) {
    return res
      .status(404)
      .json({ message: "Student not enrolled in this course" });
  }

  const timeWorking = session.QRcodeTimeWorking * 60 * 1000;
  const sesstionCreateAt = new Date(session.createdAt).getTime();
  const now = Date.now();

  let fingerprint;
  if (now - sesstionCreateAt > timeWorking) {
    fingerprint = await Fingerprint.findOneAndUpdate(
      { _id: fingerprintVerificatioId, type: "verify", status: "pending" },
      { status: "done", studentId: student._id },
      { new: true }
    );
    return res
      .status(404)
      .json("No pending verification found, Session expired");
  }

  const attendance = await Attendance.findOneAndUpdate(
    { sessionID: session._id, student: student._id },
    { attendanceStatus: "present", scanDate: new Date() },
    { upsert: true, new: true }
  );

  res.status(201).json({
    message: "Attendance marked successfully!",
    data: attendance,
  });
});

const getAllFingerprints = factory.getAllDocuments(Fingerprint);

const deleteFingerprint = factory.deleteDocument(Fingerprint);

const getOneFingerprint = factory.getOneDocument(Fingerprint);

const deleteAllFingerprints = asyncHandler(async (req, res, next) => {
  await Fingerprint.deleteMany({});

  res.status(200).json({ message: "All Fingerprints deleted successfully" });
});

module.exports = {
  fingerprintFirstRegister,
  getFingerprintRegister,
  fingerprintConfirmRegister,
  fingerprintVerify,
  getPendingFingerprintVerify,
  fingerprintConfirmVerify,
  getAllFingerprints,
  deleteFingerprint,
  getOneFingerprint,
  deleteAllFingerprints,
};
