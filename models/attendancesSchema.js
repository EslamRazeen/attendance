const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    sessionID: {
      type: mongoose.Schema.ObjectId,
      ref: "Session",
      required: true,
    },
    attendanceStatus: {
      type: String,
      enum: ["present", "absent"],
      default: "absent",
    },
    scanDate: {
      type: Date,
      default: Date.now(),
    },
    student: {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: true,
    },
    sessionType: {
      type: String,
      enum: ["lecture", "section"],
      required: true,
    },
  },
  { timestamps: true }
);

attendanceSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "student", select: { name: 1, courses: 0 } },
    { path: "courseId", select: "courseName" },
  ]);
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);
