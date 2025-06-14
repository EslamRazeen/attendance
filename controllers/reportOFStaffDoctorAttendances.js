const asyncHandler = require("express-async-handler");

const Attendance = require("../models/attendancesSchema");
const User = require("../models/usersSchema");

const attendanceReport = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);

  const lecturerCourseIds = user.lecturerCourses.map((course) =>
    course._id.toString()
  );

  const reportOfUserCourses = await Attendance.find({
    courseId: { $in: lecturerCourseIds },
    sessionType: user.lecturerRole === "instructour" ? "lecture" : "section",
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
