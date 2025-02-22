const asyncHandler = require("express-async-handler");

const Attendance = require("../models/attendancesSchema");
const Student = require("../models/studentInfoSchema");

const attendanceReport = asyncHandler(async (req, res, next) => {
  const { courseID } = req.params;

  const student = await Student.findById(req.student._id);

  const studentCourseIds = student.courses.map((course) =>
    course._id.toString()
  );
  if (
    !studentCourseIds.includes(courseID.toString())
    // !userCourses.lecturerCourses.includes(new mongoose.Types.ObjectId(courseID))
  ) {
    return res.status(404).json("Course not found");
  }

  const attendances = await Attendance.find(
    { courseId: courseID, student: req.student._id },
    { student: 1, attendanceStatus: 1, courseId: 1 }
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
