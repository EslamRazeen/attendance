const multer = require("multer");
const ApiError = require("../utils/apiError");
const { v4: uuidv4 } = require("uuid");

exports.uploadSingleImage = (field) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //   console.log(file);
      cb(null, "uploads/category");
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
      cb(null, fileName);
    },
  });

  const multeFiltr = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  };

  const upload = multer({ storage: storage, fileFilter: multeFiltr });

  return upload.single(field);
};

exports.uploadMixOfImages = (arrayOfFields) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      //   console.log(file);
      cb(null, "uploads/product");
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
      cb(null, fileName);
    },
  });

  const multeFiltr = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  };

  const upload = multer({ storage: storage, fileFilter: multeFiltr });

  return upload.fields(arrayOfFields);
};
