const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    sessionID: {
      type: mongoose.Schema.ObjectId,
      ref: "Session",
    },
    attendanceStatus: {
      type: String,
      enum: ["present", "absent"],
      default: "absent",
    },
    scanDate: {
      type: Date,
      required: true,
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
