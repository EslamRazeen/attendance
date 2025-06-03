const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
      required: true,
    },
    semester: {
      type: String,
    },
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

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

studentSchema.pre("save", function (next) {
  this.courses = [...new Set(this.courses.map(String))];
  next();
});

studentSchema.pre(/^find/, function (next) {
  this.populate("courses", "courseName");
  next();
});

module.exports = mongoose.model("Student", studentSchema);
