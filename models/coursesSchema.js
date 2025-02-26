const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      unique: [true, "Course code is unique"],
    },
    department: {
      type: String,
      enum: ["CS", "IS", "BIO", "AI"],
      required: true,
    },
    // schedul: {
    //   type: [String],
    //   required: true,
    // },
    semester: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
