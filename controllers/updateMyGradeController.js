const asyncHandler = require("express-async-handler");

const studentSchema = require("../models/studentInfoSchema");
const courseSchema = require("../models/coursesSchema");

const updateMyGrade = asyncHandler(async (req, res, next) => {
  const { studentIds, level } = req.body;
  const numLevel = Number(level);
  // const newCourses = await courseSchema.find({level: level})
  const students = await studentSchema.find({
    level: level,
    _id: { $in: studentIds },
  });
  if (!students) {
    return res.status(404).json("Not students for this IDs or for this level");
  }

  if (numLevel === 4) {
    await studentSchema.deleteMany({
      _id: { $in: studentIds },
    });
  }

  await Promise.all(
    students.map(async (student) => {
      const coursesOfStudents = await courseSchema.find({
        level:
          numLevel + 1 < 5 ? (numLevel + 1).toString() : numLevel.toString(),
        department: student.department,
      });

      student.level =
        numLevel + 1 < 5 ? (numLevel + 1).toString() : numLevel.toString();
      student.courses = coursesOfStudents.map((course) => course._id);
      await student.save();
    })
  );

  res.status(200).json({
    message: "Students updated",
    modifiedCount: students.result,
    data: students,
  });
});

module.exports = {
  updateMyGrade,
};
