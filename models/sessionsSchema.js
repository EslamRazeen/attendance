const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    sessionID: {
      type: Date,
      required: true,
    },
    // sessionStatus: {
    //   type: String,
    //   enum: ["open", "closed"],
    // },
    Qrcode: {
      type: String,
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
    duration: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
