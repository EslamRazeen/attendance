const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      unique: [true, "Course name is unique"],
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      unique: [true, "Course code is unique"],
    },
    lecturer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    department: {
      type: [String],
      enum: ["CS", "IS", "BIO", "AI"],
      required: true,
    },
    schedul: {
      type: [String],
      required: true,
    },
    semester: {
      type: [String],
      enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
    },
    level: {
      type: [String],
      enum: ["1", "2", "3", "4"],
      required: true,
    },
    QRcodeChangeSpeed: {
      type: String,
      default: "5 Sec",
    },
    QRcodeTimeWorking: {
      type: String,
      default: "5 Min",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
