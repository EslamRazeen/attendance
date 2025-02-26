const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      minlength: [3, "Too short user name"],
      maxlength: [100, "Too long user name"],
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
    role: {
      type: String,
      enum: ["staff", "lecturer", "student"],
      required: true,
      default: "lecturer",
    },
    lecturerRole: {
      type: String,
      enum: ["instructor", "assistant"],
      // default: "instructor",
    },
    lecturerDepartment: {
      type: String,
      // default: "Computer Science",
    },
    lecturerCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    // studentDepartment: {
    //   type: String,
    //   enum: ["CS", "IS", "AI", "BIO"],
    // },
    // studentLevel: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Hashin password in case of create
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  this.lecturerCourses = [...new Set(this.lecturerCourses.map(String))];
  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate("lecturerCourses", "courseName");
  next();
});

module.exports = mongoose.model("User", userSchema);
