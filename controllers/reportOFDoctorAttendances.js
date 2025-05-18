const asyncHandler = require("express-async-handler");

const Attendance = require("../models/attendancesSchema");
const User = require("../models/usersSchema");

const attendanceReport = asyncHandler(async (req, res, next) => {
  const userCourses = await User.findById(req.user._id);

  const lecturerCourseIds = userCourses.lecturerCourses.map((course) =>
    course._id.toString()
  );

  const reportOfUserCourses = await Attendance.find({
    courseId: { $in: lecturerCourseIds },
    sessionType:
      req.user.lecturerRole === "instructour" ? "lecture" : "section",
  });

  let absent = 0,
    present = 0;
  reportOfUserCourses.forEach((element) => {
    if (element.attendanceStatus === "absent") absent++;
    else present++;
  });
  let attendanceRate = Math.round((present / (absent + present)) * 100);
  let showQttendanceRate = `${attendanceRate}%`;

  const selectedDate = new Date(req.body.date);
  const nextDay = new Date(selectedDate);
  nextDay.setDate(nextDay.getDate() + 1);

  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid or missing date. Please use format like 2025-05-16",
    });
  }

  const attendancesScanDate = await Attendance.find({
    scanDate: {
      $gte: selectedDate,
      $lt: nextDay,
    },
    attendanceStatus: "present",
    courseId: { $in: lecturerCourseIds },
    sessionType:
      req.user.lecturerRole === "instructour" ? "lecture" : "section",
  });

  const hourlyReport = {};
  for (let hour = 9; hour < 17; hour++) {
    const timeRange = `${hour}:00 - ${hour + 1}:00`;
    hourlyReport[timeRange] = 0;
  }

  attendancesScanDate.forEach((record) => {
    const hour = new Date(record.scanDate).getHours();

    if (hour >= 9 && hour < 17) {
      const timeRange = `${hour}:00 - ${hour + 1}:00`;
      hourlyReport[timeRange]++;
    }
  });

  res.json({
    status: "success",
    resutl: reportOfUserCourses.length,
    // reportOfUserCourses,
    date: selectedDate.toISOString().split("T")[0],
    day: selectedDate.toLocaleDateString("en-US", { weekday: "long" }),
    data: hourlyReport,
    absent,
    present,
    showQttendanceRate,
  });
});

module.exports = {
  attendanceReport,
};
