const asyncHandler = require("express-async-handler");

const Attendance = require("../models/attendancesSchema");
const User = require("../models/usersSchema");

const attendanceReport = asyncHandler(async (req, res, next) => {
  const { courseID } = req.params;

  const userCourses = await User.findById(req.user._id);

  const lecturerCourseIds = userCourses.lecturerCourses.map((course) =>
    course._id.toString()
  );
  if (
    !lecturerCourseIds.includes(courseID.toString())
    // !userCourses.lecturerCourses.includes(new mongoose.Types.ObjectId(courseID))
  ) {
    return res.status(404).json("Course not found");
  }

  const attendances = await Attendance.find(
    {
      courseId: courseID,
      sessionType:
        req.user.lecturerRole === "instructour" ? "lecture" : "section",
    },
    { student: 1, attendanceStatus: 1, courseId: 1, sessionType: 1 }
  )
    .populate("student", "name") //  -_id
    .populate("courseId", "courseName");

  let absent = 0,
    present = 0;
  attendances.forEach((element) => {
    if (element.attendanceStatus === "absent") absent++;
    else present++;
  });

  res.json({ resutl: attendances.length, attendances, absent, present });
});

module.exports = {
  attendanceReport,
};
