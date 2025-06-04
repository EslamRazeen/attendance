const asyncHandler = require("express-async-handler");

const Attendance = require("../models/attendancesSchema");
const Session = require("../models/sessionsSchema");
const User = require("../models/usersSchema");
const Student = require("../models/studentInfoSchema");

const sessionsCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const sessions = await Session.find({
    course: courseId,
  });
  if (!sessions) {
    return next(new ApiError(`There is no sessions with this course id`, 404));
  }
  res.status(200).json({ result: sessions.length, data: sessions });
});

module.exports = {
  sessionsCourse,
};
