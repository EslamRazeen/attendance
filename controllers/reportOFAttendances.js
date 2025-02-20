const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const Attendance = require("../models/attendancesSchema");
const Session = require("../models/sessionsSchema");
const User = require("../models/usersSchema");
const Course = require("../models/coursesSchema");

const attendanceReport = asyncHandler(async (req, res, next) => {
  const userCourses = await User.findById(req.user._id).populate(
    "lecturerCourses"
  );

  res.json(userCourses);
});

module.exports = {
  attendanceReport,
};
