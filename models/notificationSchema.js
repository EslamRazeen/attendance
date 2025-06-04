const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  message: String,
  type: String, // زي: "apology_response", "session_update" إلخ
  relatedApology: { type: mongoose.Schema.Types.ObjectId, ref: "Apology" },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
