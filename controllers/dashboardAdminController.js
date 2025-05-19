const asyncHandler = require("express-async-handler");
const Attendance = require("../models/attendancesSchema");

const getWeeklySummary = asyncHandler(async (req, res) => {
  const now = new Date();

  // احسب أول يوم في آخر 7 أيام
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(now);
  endDate.setHours(23, 59, 59, 999);

  // مصفوفة أيام الأسبوع حسب index
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // حضّر الأيام في خريطة حسب التاريخ
  const daysMap = {};
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    date.setHours(0, 0, 0, 0);

    const key = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
    daysMap[key] = {
      date: key,
      day: daysOfWeek[date.getDay()],
      present: 0,
      absent: 0,
    };
  }

  // هنسحب الحضور من آخر 7 أيام
  const attendances = await Attendance.find({
    scanDate: { $gte: startDate, $lte: endDate },
  });

  // عدّ الحضور والغياب لكل يوم
  attendances.forEach((record) => {
    const scanDate = new Date(record.scanDate);
    scanDate.setHours(0, 0, 0, 0);
    const dateKey = scanDate.toLocaleDateString("en-CA");

    if (daysMap[dateKey]) {
      if (record.attendanceStatus === "present") {
        daysMap[dateKey].present++;
      } else {
        daysMap[dateKey].absent++;
      }
    }
  });

  // حضّر البيانات النهائية
  const result = Object.values(daysMap).map((day) => {
    const total = day.present + day.absent;
    const attendanceRate =
      total > 0 ? `${Math.round((day.present / total) * 100)}%` : "0%";
    return {
      date: day.date,
      day: day.day,
      present: day.present,
      absent: day.absent,
      attendanceRate,
    };
  });

  res.status(200).json({
    status: "success",
    range: "last 7 days",
    days: result,
  });
});

module.exports = {
  getWeeklySummary,
};
