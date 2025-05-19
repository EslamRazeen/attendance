const asyncHandler = require("express-async-handler");
const Attendance = require("../models/attendancesSchema");
const Course = require("../models/coursesSchema");

const getAttendanceSummary = asyncHandler(async (req, res) => {
  const { range } = req.body;
  const courseId = req.params.courseId;
  const now = new Date();

  const course = await Course.findById(courseId);

  if (!["this week", "this month"].includes(range)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid range. Use 'this week' or 'this month'.",
    });
  }

  if (!courseId) {
    return res.status(400).json({
      status: "fail",
      message: "Missing course ID in URL params.",
    });
  }

  // 📅 احسب آخر 7 أيام من النهارده
  const getLast7Days = (date) => {
    const lastWeek = new Date(date);
    lastWeek.setDate(date.getDate() - 6);
    lastWeek.setHours(0, 0, 0, 0);
    return lastWeek;
  };

  // 📅 احسب بداية الشهر
  const getStartOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // 📅 احسب نهاية الأسبوع الحالي
  const getEndOfCurrentWeek = (date) => {
    const end = new Date(date);
    const day = end.getDay(); // 0 (Sun) - 6 (Sat)
    const toSaturday = 6 - (day === 0 ? 7 : day); // لو الأحد = 0 => -1
    end.setDate(end.getDate() + toSaturday);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  if (range === "this week") {
    const startDate = getLast7Days(now);
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    const attendances = await Attendance.find({
      scanDate: { $gte: startDate, $lte: endDate },
      courseId: courseId,
    });

    const daysMap = {};

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const key = day.toISOString().split("T")[0];
      daysMap[key] = {
        date: key,
        day: day.toLocaleDateString("en-US", { weekday: "long" }),
        present: 0,
        absent: 0,
      };
    }

    attendances.forEach((attendance) => {
      const key = new Date(attendance.scanDate).toISOString().split("T")[0];
      if (daysMap[key]) {
        if (attendance.attendanceStatus === "present") {
          daysMap[key].present++;
        } else {
          daysMap[key].absent++;
        }
      }
    });

    return res.status(200).json({
      status: "success",
      subject: course.courseName,
      range: "last 7 days",
      days: Object.values(daysMap),
    });
  }

  if (range === "this month") {
    const startOfMonth = getStartOfMonth(now);
    const endOfWeek = getEndOfCurrentWeek(now);

    const attendances = await Attendance.find({
      scanDate: { $gte: startOfMonth, $lte: endOfWeek },
      courseId: courseId,
    });

    // ⬅️ تقسيم الشهر إلى أسابيع حتى الأسبوع الحالي فقط
    const weeks = [];
    let start = new Date(startOfMonth);

    while (start < endOfWeek) {
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      weeks.push({ start: new Date(start), end: new Date(end) });
      start = new Date(end);
    }

    const result = weeks.map((week, index) => {
      const weekAttendances = attendances.filter(
        (a) => a.scanDate >= week.start && a.scanDate < week.end
      );

      const present = weekAttendances.filter(
        (a) => a.attendanceStatus === "present"
      ).length;
      const absent = weekAttendances.filter(
        (a) => a.attendanceStatus === "absent"
      ).length;
      const total = present + absent;
      const attendanceRate = total
        ? `${Math.round((present / total) * 100)}%`
        : "0%";

      return {
        week: `Week ${index + 1}`,
        from: week.start.toISOString().split("T")[0],
        to: week.end.toISOString().split("T")[0],
        present,
        absent,
        attendanceRate,
      };
    });

    return res.status(200).json({
      status: "success",
      subject: course.courseName,
      range: "this month (until current week)",
      weeks: result,
    });
  }
});

module.exports = {
  getAttendanceSummary,
};
