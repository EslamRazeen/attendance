const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");

const createDocument = (documentSchema) =>
  asyncHandler(async (req, res) => {
    const document = await documentSchema.create(req.body);
    res.status(200).json({ data: document });
  });

const getAllDocuments = (documentSchema) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documents = await documentSchema.find(filter);

    res.status(200).json({ result: documents.length, data: documents });
  });

const getOneDocument = (documentSchema, populateOption) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = documentSchema.findById(id);
    if (populateOption) {
      query = query.populate(populateOption);
    }
    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`There is no document with this id`, 404));
    }

    res.status(200).json({ data: document });
  });

const updateDocument = (documentSchema) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await documentSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!document) {
      return next(new ApiError(`There is no document with this id`, 404));
    }

    // Trigger 'save' event when document updated
    document.save(); // To execute Aggregation in update

    res
      .status(200)
      .json({ message: "document updated successfully", data: document });
  });

const deleteDocument = (documentSchema) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await documentSchema.findByIdAndDelete(id, req.body, {
      new: true,
    });

    if (!document) {
      return next(new ApiError(`There is no document with this id`, 404));
    }

    res.status(200).json({ message: "document deleted successfully" });
  });

module.exports = {
  createDocument,
  getAllDocuments,
  getOneDocument,
  updateDocument,
  deleteDocument,
};
