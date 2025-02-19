const courseSchema = require("../models/coursesSchema");
const factory = require("./handlerFactory");

const createCourse = factory.createDocument(courseSchema);

const getAllCourses = factory.getAllDocuments(courseSchema);

const getOneCourse = factory.getOneDocument(courseSchema);

const updateCourse = factory.updateDocument(courseSchema);

const deleteCourse = factory.deleteDocument(courseSchema);

module.exports = {
  createCourse,
  getAllCourses,
  getOneCourse,
  updateCourse,
  deleteCourse,
};
