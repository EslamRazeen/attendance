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
      ref: "Student",
    },
    courseId: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
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
