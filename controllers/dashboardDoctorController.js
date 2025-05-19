const asyncHandler = require("express-async-handler");
const Attendance = require("../models/attendancesSchema");

const getAttendanceSummary = asyncHandler(async (req, res) => {
  const range = req.body.range || "this week"; // من body
  const courseId = req.params.courseId; // من param

  if (!courseId) {
    return res.status(400).json({
      status: "fail",
      message: "courseId is required as a URL parameter",
    });
  }

  const now = new Date();
  now.setHours(23, 59, 59, 999);

  if (range === "this week") {
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const attendances = await Attendance.find({
      courseId,
      scanDate: { $gte: startDate, $lte: now },
    });

    const daysMap = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const dayNum = String(date.getDate()).padStart(2, "0");
      const key = `${year}-${month}-${dayNum}`; // yyyy-mm-dd
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

    return res.status(200).json({
      status: "success",
      range: "last 7 days",
      days: result,
    });
  } else if (range === "this month") {
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
        courseId,
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

    return res.status(200).json({
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

module.exports = { getAttendanceSummary };
