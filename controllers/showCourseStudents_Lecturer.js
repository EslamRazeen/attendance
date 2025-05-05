const asyncHandler = require("express-async-handler");

const Attendance = require("../models/attendancesSchema");
const User = require("../models/usersSchema");
const Student = require("../models/studentInfoSchema");

const showStudent = asyncHandler(async (req, res, next) => {
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

  const students = await Student.find({
    courses: { $in: [courseID] },
  });

  const attendances = await Attendance.find({
    courseId: courseID,
    sessionType:
      req.user.lecturerRole === "instructour" ? "lecture" : "section",
  });
  // console.log(attendances);

  let studentAttendanc = 0;
  let arr = [];
  students.forEach((student) => {
    studentAttendanc = attendances.filter(
      (attendanc) =>
        attendanc.student._id.toString() === student._id.toString() &&
        attendanc.attendanceStatus === "present"
    ).length;

    arr.push({
      student,
      studentAttendanc,
    });
  });

  res.json({ resutl: students.length, students: arr });
});

module.exports = {
  showStudent,
};
