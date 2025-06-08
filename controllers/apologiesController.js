const asyncHandler = require("express-async-handler");

const Apology = require("../models/apologiesSchema");
const Student = require("../models/studentInfoSchema");
const Notification = require("../models/notificationSchema");
const factory = require("./handlerFactory");

const createApology = asyncHandler(async (req, res, next) => {
  // console.log("REQ FILE:", req.file);
  const { course, description, image } = req.body;

  const studentCourse = await Student.findOne({
    courses: course,
    _id: req.student._id,
  });

  if (!studentCourse) {
    return res
      .status(401)
      .json(`This course: ${course} not found for this student`);
  }
  // console.log(studentCourse);

  const apology = await Apology.create({
    student: req.student._id,
    course,
    description,
    image: req.file?.path || null,
  });

  res.status(201).json({ status: "success", data: apology });
});

const reviewApology = asyncHandler(async (req, res) => {
  const apologyId = req.params.id;
  const { status, reason } = req.body;

  const apology = await Apology.findById(apologyId)
    .populate("student", "name")
    .populate({ path: "course", select: "courseName" });

  if (!apology) {
    return res.status(404).json({ message: "Apology not found" });
  }

  apology.status = status;
  apology.reason = reason || "";
  apology.seenByStaff = true;
  apology.seenAt = new Date();
  await apology.save();

  // const notification = await Notification.create({
  //   user: apology.student._id,
  //   message: `Your apology was ${
  //     status === "accepted" ? "accepted" : "rejected"
  //   } by staff.`,
  //   relatedApology: apology._id,
  //   type: "apology_response",
  //   seen: false,
  // });

  res.status(200).json({
    message: "Apology updated and notification sent.",
    apology,
    // notification,
  });
});

const getAcceptedApologies = asyncHandler(async (req, res) => {
  const apologies = await Apology.find({
    // status: "accepted",
    course: { $in: req.user.lecturerCourses },
  })
    .populate("student", "name department level")
    .populate("course", "courseName");

  res
    .status(200)
    .json({ status: "success", resutl: apologies.length, data: apologies });
});

const getAllApologies = factory.getAllDocuments(Apology);

const getOneApology = factory.getOneDocument(Apology);

const deleteApology = factory.deleteDocument(Apology);

const getLoggedStudentApologies = asyncHandler(async (req, res) => {
  const apologies = await Apology.find({
    student: req.student._id,
  })
    .select(
      "course status image description seenByStaff reason createdAt updatedAt seenAt"
    )
    .populate("course", "courseName");

  if (!apologies) {
    return res.status(404).json("There are no apologies for you");
  }

  res.status(200).json({ result: apologies.length, data: apologies });
});

module.exports = {
  createApology,
  reviewApology,
  getAcceptedApologies,
  getAllApologies,
  getOneApology,
  deleteApology,
  getLoggedStudentApologies,
};
