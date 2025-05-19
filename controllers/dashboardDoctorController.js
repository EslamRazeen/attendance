// const asyncHandler = require("express-async-handler");
// const Attendance = require("../models/attendancesSchema");
// const Course = require("../models/coursesSchema");

// const getAttendanceSummary = asyncHandler(async (req, res) => {
//   const { range } = req.body;
//   const courseId = req.params.courseId;
//   const now = new Date();

//   const course = await Course.findById(courseId);

//   if (!["this week", "this month"].includes(range)) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Invalid range. Use 'this week' or 'this month'.",
//     });
//   }

//   if (!courseId) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing course ID in URL params.",
//     });
//   }

//   // 📅 احسب آخر 7 أيام من النهارده
//   const getLast7Days = (date) => {
//     const lastWeek = new Date(date);
//     lastWeek.setDate(date.getDate() - 6);
//     lastWeek.setHours(0, 0, 0, 0);
//     return lastWeek;
//   };

//   // 📅 احسب بداية الشهر
//   const getStartOfMonth = (date) => {
//     return new Date(date.getFullYear(), date.getMonth(), 1);
//   };

//   // 📅 احسب نهاية الأسبوع الحالي
//   const getEndOfCurrentWeek = (date) => {
//     const end = new Date(date);
//     const day = end.getDay(); // 0 (Sun) - 6 (Sat)
//     const toSaturday = 6 - (day === 0 ? 7 : day); // لو الأحد = 0 => -1
//     end.setDate(end.getDate() + toSaturday);
//     end.setHours(23, 59, 59, 999);
//     return end;
//   };

//   if (range === "this week") {
//     const startDate = getLast7Days(now);
//     const endDate = new Date(now);
//     endDate.setHours(23, 59, 59, 999);

//     const attendances = await Attendance.find({
//       scanDate: { $gte: startDate, $lte: endDate },
//       courseId: courseId,
//     });

//     const daysMap = {};

//     for (let i = 0; i < 7; i++) {
//       const day = new Date(startDate);
//       day.setDate(startDate.getDate() + i);
//       const key = day.toISOString().split("T")[0];
//       daysMap[key] = {
//         date: key,
//         day: day.toLocaleDateString("en-US", { weekday: "long" }),
//         present: 0,
//         absent: 0,
//       };
//     }

//     attendances.forEach((attendance) => {
//       const key = new Date(attendance.scanDate).toISOString().split("T")[0];
//       if (daysMap[key]) {
//         if (attendance.attendanceStatus === "present") {
//           daysMap[key].present++;
//         } else {
//           daysMap[key].absent++;
//         }
//       }
//     });

//     return res.status(200).json({
//       status: "success",
//       subject: course.courseName,
//       range: "last 7 days",
//       days: Object.values(daysMap),
//     });
//   }

//   if (range === "this month") {
//     const startOfMonth = getStartOfMonth(now);
//     const endOfWeek = getEndOfCurrentWeek(now);

//     const attendances = await Attendance.find({
//       scanDate: { $gte: startOfMonth, $lte: endOfWeek },
//       courseId: courseId,
//     });

//     // ⬅️ تقسيم الشهر إلى أسابيع حتى الأسبوع الحالي فقط
//     const weeks = [];
//     let start = new Date(startOfMonth);

//     while (start < endOfWeek) {
//       const end = new Date(start);
//       end.setDate(end.getDate() + 7);
//       weeks.push({ start: new Date(start), end: new Date(end) });
//       start = new Date(end);
//     }

//     const result = weeks.map((week, index) => {
//       const weekAttendances = attendances.filter(
//         (a) => a.scanDate >= week.start && a.scanDate < week.end
//       );

//       const present = weekAttendances.filter(
//         (a) => a.attendanceStatus === "present"
//       ).length;
//       const absent = weekAttendances.filter(
//         (a) => a.attendanceStatus === "absent"
//       ).length;
//       const total = present + absent;
//       const attendanceRate = total
//         ? `${Math.round((present / total) * 100)}%`
//         : "0%";

//       return {
//         week: `Week ${index + 1}`,
//         from: week.start.toISOString().split("T")[0],
//         to: week.end.toISOString().split("T")[0],
//         present,
//         absent,
//         attendanceRate,
//       };
//     });

//     return res.status(200).json({
//       status: "success",
//       subject: course.courseName,
//       range: "this month (until current week)",
//       weeks: result,
//     });
//   }
// });

// module.exports = {
//   getAttendanceSummary,
// };

const asyncHandler = require("express-async-handler");
const Attendance = require("../models/attendancesSchema");

const getAttendanceSummary = asyncHandler(async (req, res) => {
  const range = req.body.range || "this week"; // افتراضياً this week
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  if (range === "this week") {
    // last 7 days (including today)
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const attendances = await Attendance.find({
      scanDate: { $gte: startDate, $lte: now },
    });

    const daysMap = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const key = date.toISOString().split("T")[0];
      daysMap[key] = {
        date: key,
        day: date.toLocaleDateString("en-US", { weekday: "long" }),
        present: 0,
        absent: 0,
      };
    }

    attendances.forEach((record) => {
      const dateKey = new Date(record.scanDate).toISOString().split("T")[0];
      if (daysMap[dateKey]) {
        if (record.attendanceStatus === "present") daysMap[dateKey].present++;
        else daysMap[dateKey].absent++;
      }
    });

    const result = Object.values(daysMap).map((day) => {
      const total = day.present + day.absent;
      return {
        date: day.date,
        day: day.day,
        present: day.present,
        absent: day.absent,
        attendanceRate: total
          ? `${Math.round((day.present / total) * 100)}%`
          : "0%",
      };
    });

    res.status(200).json({
      status: "success",
      range: "last 7 days",
      days: result,
    });
  } else if (range === "this month") {
    // last 4 weeks, weeks start Saturday end Friday, last week ends today if before Friday

    // دالة تجيب يوم السبت قبل أو يساوي التاريخ المعطى
    function getLastSaturday(date) {
      const day = date.getDay();
      const diff = day >= 6 ? day - 6 : day + 1;
      const lastSaturday = new Date(date);
      lastSaturday.setDate(date.getDate() - diff);
      lastSaturday.setHours(0, 0, 0, 0);
      return lastSaturday;
    }

    let currentSaturday = getLastSaturday(now);
    const firstSaturday = new Date(currentSaturday);
    firstSaturday.setDate(currentSaturday.getDate() - 7 * 3);

    const weeks = [];

    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(firstSaturday);
      weekStart.setDate(firstSaturday.getDate() + i * 7);

      let weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      if (i === 3 && weekEnd > now) {
        weekEnd = new Date(now);
      }

      weeks.push({ from: weekStart, to: weekEnd });
    }

    const result = [];

    for (let i = 0; i < weeks.length; i++) {
      const { from, to } = weeks[i];

      const attendances = await Attendance.find({
        scanDate: { $gte: from, $lte: to },
      });

      let present = 0,
        absent = 0;

      attendances.forEach((record) => {
        if (record.attendanceStatus === "present") present++;
        else absent++;
      });

      const total = present + absent;
      const attendanceRate = total
        ? `${Math.round((present / total) * 100)}%`
        : "0%";

      result.push({
        week: `Week ${i + 1}`,
        from: from.toISOString().split("T")[0],
        to: to.toISOString().split("T")[0],
        present,
        absent,
        attendanceRate,
      });
    }

    res.status(200).json({
      status: "success",
      range: "last 4 weeks",
      weeks: result,
    });
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Invalid range value. Use 'this week' or 'this month'.",
    });
  }
});

module.exports = {
  getAttendanceSummary,
};
