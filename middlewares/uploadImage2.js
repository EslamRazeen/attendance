const multer = require("multer");
const path = require("path");

// تحديد مكان التخزين واسم الملف
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/apologies"); // المسار المحلي لحفظ الصور
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// فلتر لقبول الصور فقط
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
