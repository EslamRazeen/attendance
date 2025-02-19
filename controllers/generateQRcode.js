const asyncHandler = require("express-async-handler");
const QRCode = require("qrcode");

const Session = require("../models/sessionsSchema");
const QRCodeModel = require("../models/QRcodeSchema");

const updateQRCode = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findById(sessionId);
  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  // Check if session is finish
  const sessionEndTime =
    new Date(session.sessionID).getTime() + session.duration * 60000; //60000 means 1 min
  if (Date.now() > sessionEndTime) {
    return res
      .status(400)
      .json({ message: "Session has ended, QR Code is no longer valid" });
  }

  // generate new QRcode
  const qrCodeData = JSON.stringify({
    sessionId: session._id,
    courseId: session.course,
    sessionID: Date.now(),
  });
  const qrCodeImage = await QRCode.toDataURL(qrCodeData);

  // calculate the time remaining until the session ends
  const totalMinutes = (sessionEndTime - Date.now()) / 60000;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);
  const timeRemaining = minutes + " Miniute, " + seconds + " Second";

  // Update expiresAt in database
  const qrCodeInDB = await QRCodeModel.findOneAndUpdate(
    { sessionId: session._id },
    {
      qrCode: qrCodeData,
      expiresAt: new Date(Date.now() + 5 * 1000),
    },
    { upsert: true, new: true }
  );

  res.json({
    qrCode: qrCodeImage,
    sessionId: session._id,
    courseId: session.course,
    expiresAt: qrCodeInDB.expiresAt,
    timeRemaining,
  });
});

module.exports = {
  updateQRCode,
};
