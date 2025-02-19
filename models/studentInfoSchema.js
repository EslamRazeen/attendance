const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: [true, "User email is unique"],
    },
    password: {
      type: String,
      required: [true, "User password is required"],
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    department: {
      type: String,
    },
    level: {
      type: String,
    },
    semester: {
      type: String,
    },
    // user: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User",
    // },
    studentID: {
      type: String,
    },
    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
