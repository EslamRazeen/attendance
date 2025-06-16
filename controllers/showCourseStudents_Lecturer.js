const asyncHandler = require("express-async-handler");

const Attendance = require("../models/attendancesSchema");
const User = require("../models/usersSchema");
const Student = require("../models/studentInfoSchema");

const showStudent = asyncHandler(async (req, res, next) => {
  const { courseID } = req.params;
  const datee = req.body.date || "03/06/1800";
  const [day, month, year] = datee.split("/");

  const startOfDay = new Date(`${year}-${month}-${day}T00:00:00Z`);

  const endOfDay = new Date(`${year}-${month}-${day}T23:59:59Z`);

  // const sessions = await Session.find({
  //   course: { $in: [courseID] },
  // });

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
  if (!students) {
    return res.status(404).json("Students not found");
  }

  const attendances = await Attendance.find({
    courseId: courseID,
    sessionType:
      req.user.lecturerRole === "instructour" ? "lecture" : "section",
  }).populate("student");

  let studentAttendanc = 0;
  let arr = [];
  students.forEach((student) => {
    studentAttendanc = attendances.filter(
      (attendanc) =>
        attendanc.student &&
        attendanc.student._id.toString() === student._id.toString() &&
        attendanc.attendanceStatus === "present"
    ).length;

    arr.push({
      student,
      studentAttendanc,
    });
  });

  const result = await Attendance.find({
    courseId: courseID,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    attendanceStatus: "present",
    sessionType:
      req.user.lecturerRole === "instructour" ? "lecture" : "section",
  });

  const uniqeStudentIds = Array.from(
    new Set(result.map((att) => att.student._id.toString()))
  );

  const uniqueStudents = await Student.find({
    _id: { $in: uniqeStudentIds },
  });

  res.json({
    resutl: students.length,
    students: arr,
    result2: uniqueStudents.length,
    presntsINDate: uniqueStudents,
  });
});

module.exports = {
  showStudent,
};
