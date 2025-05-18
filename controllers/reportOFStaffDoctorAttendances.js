const asyncHandler = require("express-async-handler");

const Attendance = require("../models/attendancesSchema");
const User = require("../models/usersSchema");

const attendanceReport = asyncHandler(async (req, res, next) => {
  const userCourses = await User.findById(req.params.courseId);

  const lecturerCourseIds = userCourses.lecturerCourses.map((course) =>
    course._id.toString()
  );

  const reportOfUserCourses = await Attendance.find({
    courseId: { $in: lecturerCourseIds },
    sessionType:
      userCourses.lecturerRole === "instructour" ? "lecture" : "section",
  });

  let absent = 0,
    present = 0;
  reportOfUserCourses.forEach((element) => {
    if (element.attendanceStatus === "absent") absent++;
    else present++;
  });
  let attendanceRate = Math.round((present / (absent + present)) * 100);
  let showQttendanceRate = `${attendanceRate}%`;

  res.json({
    status: "success",
    resutl: reportOfUserCourses.length,
    absent,
    present,
    showQttendanceRate,
  });
});

module.exports = {
  attendanceReport,
};
