const asyncHandler = require("express-async-handler");

const Attendance = require("../models/attendancesSchema");
const Session = require("../models/sessionsSchema");
const User = require("../models/usersSchema");
const Student = require("../models/studentInfoSchema");

const manualStudent = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.params;
  const session = await Session.findById(sessionId);

  const userCourses = await User.findById(req.user._id);

  const lecturerCourseIds = userCourses.lecturerCourses.map((course) =>
    course._id.toString()
  );
  if (
    !lecturerCourseIds.includes(session.course.toString())
    // !userCourses.lecturerCourses.includes(new mongoose.Types.ObjectId(courseID))
  ) {
    return res.status(404).json("Course not found");
  }

  const attendances = await Attendance.find({
    // courseId: courseID,
    sessionType:
      req.user.lecturerRole === "instructour" ? "lecture" : "section",
    sessionID: sessionId,
  });

  res.json({ resutl: attendances.length, data: attendances });
});

module.exports = {
  manualStudent,
};
