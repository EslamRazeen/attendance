const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/globalErrorMiddleware");

// Routes
const userRoute = require("./routes/userRoute");
const courseRoute = require("./routes/courseRoute");
const sessionRoute = require("./routes/sessionRoute");
const attendanceRoute = require("./routes/attendanceRoute");
const studentRoute = require("./routes/studentInfoRoute");
const authRoute = require("./routes/authRoute");
const reportOFAttendances = require("./routes/reportAttendanceRoute");
const reportOFDoctorAttendances = require("./routes/reportOFDoctorRoute");
const reportOFStudentAttendances = require("./routes/reportStudentAttendanceRoute");
const reportStaff = require("./routes/reportStaffRoute");
const reportStaffDoctor = require("./routes/reportOFStaffDoctorRoute");
const showStudents = require("./routes/showCourseStudentLecRoute");
const manualAttendace = require("./routes/manualAttendanceRoute");

const database = require("./config/database");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://attendance-eslamrazeen-eslam-razeens-projects.vercel.app",
    ],
    credentials: true,
  })
);

// database
database();

// Mount Routes
app.use("/api/attendanceQRCode/users", userRoute);
app.use("/api/attendanceQRCode/courses", courseRoute);
app.use("/api/attendanceQRCode/sessions", sessionRoute);
app.use("/api/attendanceQRCode/attendances", attendanceRoute);
app.use("/api/attendanceQRCode/studentInfo", studentRoute);
app.use("/api/attendanceQRCode/auth", authRoute);
app.use("/api/attendanceQRCode/report", reportOFAttendances);
app.use("/api/attendanceQRCode/doctorReport", reportOFDoctorAttendances);
app.use("/api/attendanceQRCode/studentReport", reportOFStudentAttendances);
app.use("/api/attendanceQRCode/staffReport", reportStaff);
app.use("/api/attendanceQRCode/staffDoctorReport", reportStaffDoctor);
app.use("/api/attendanceQRCode/showStudent", showStudents);
app.use("/api/attendanceQRCode/manualAttendace", manualAttendace);

app.all("*", (req, res, next) => {
  // Create Error and send it to the next middleware (Error Handling Middleware)
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// when you pass 4 parameters, express uderstand this Global Error Handling Middleware
app.use(globalError);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// 44. Handle Errors Outside Express (Unhandled Rejections)
// Events => listen => callback(err)
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down....");
    process.exit(1);
  });
});
