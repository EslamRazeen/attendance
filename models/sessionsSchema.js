const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionDate: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    lecturer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: true,
    },
    QRcodeChangeSpeed: {
      type: Number,
      default: 5,
    },
    QRcodeTimeWorking: {
      type: Number,
      default: 20,
    },
    // sessionStatus: {
    //   type: String,
    //   enum: ["open", "closed"],
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
