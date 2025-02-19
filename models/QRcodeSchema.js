const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  qrCodeData: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const QRCodeModel = mongoose.model("QRCode", qrCodeSchema);

module.exports = QRCodeModel;
