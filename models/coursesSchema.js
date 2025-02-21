const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required"],
      // unique: [true, "Course name is unique"],
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required"],
      unique: [true, "Course code is unique"],
    },
    // lecturer: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    department: {
      type: String,
      // type: [String],
      // enum: ["CS", "IS", "BIO", "AI"],
      required: true,
    },
    // schedul: {
    //   type: [String],
    //   required: true,
    // },
    semester: {
      type: String,
      // type: [String],
      // enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
      required: true,
    },
    level: {
      type: String,
      // type: [String],
      // enum: ["1", "2", "3", "4"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
