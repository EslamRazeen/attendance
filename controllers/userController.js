const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const userSchema = require("../models/usersSchema");
const factory = require("./handlerFactory");

const createUser = factory.createDocument(userSchema);

const getAllUsers = factory.getAllDocuments(userSchema);

const getOneUser = factory.getOneDocument(userSchema);

const deleteUser = factory.deleteDocument(userSchema);

const addCourseToLecturer = asyncHandler(async (req, res, next) => {
  const { userId, courseId } = req.body;
  const user = await userSchema.findByIdAndUpdate(
    userId,
    {
      // $addToSet => add product to wishlist array only once
      $addToSet: { lecturerCourses: courseId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product added successfully to wishlist",
    data: user.lecturerCourses,
  });
});

const removeCourseFromLecturer = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  const user = await userSchema.findByIdAndUpdate(
    userId,
    {
      // $pull => remove product from wishlist array if exists
      $pull: { lecturerCourses: req.params.courseId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    message: "Product removed successfully from wishlist",
    data: user.lecturerCourses,
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userSchema.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      role: req.body.role,
      email: req.body.email,
      lecturerDepartment: req.body.lecturerDepartment,
      lecturerRole: req.body.lecturerRole,
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(`There is no user for this id: ${id}`, 404));
  }

  res.status(200).json({ message: "User updated successfully", data: user });
});

const updatUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await userSchema.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!user) {
    return next(new ApiError(`There is no user for this id: ${id}`, 404));
  }

  res
    .status(200)
    .json({ message: "User password updated successfully", data: user });
});

const getLoggedUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await userSchema.findByIdAndUpdate(req.user._id, {
    password: await bcrypt.hash(req.body.newPassword, 12),
    passwordChangedAt: Date.now(),
  });
  res
    .status(200)
    .json({ message: "User password updated successfully", data: user });
});

// const deactivateLoggedUser = asyncHandler(async (req, res, next) => {
//   await userSchema.findByIdAndUpdate(req.user._id, {
//     active: false,
//   });
//   res.status(204).json({ message: "Your account is deactivate" });
// });

module.exports = {
  createUser,
  // createUser_student,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  updatUserPassword,
  getLoggedUser,
  updateLoggedUserPassword,
  addCourseToLecturer,
  removeCourseFromLecturer,
  //   updateLoggedUser,
  //   deactivateLoggedUser,
};
