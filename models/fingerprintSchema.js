const mongoose = require("mongoose");

const fingerprintSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["enroll", "verify"],
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      //   required: true,
    },
    status: {
      type: String,
      enum: ["pending", "done", "failed"],
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    fingerprintId: {
      type: Number,
      sparse: true, // هذا لو عايز تخلي الفهرس موجود لكن يتجاهل null
    },
  },
  { timestamps: true }
);

// fingerprintSchema.pre(/^find/, function (next) {
//   this.populate("studentId", "name");
//   next();
// });

module.exports = mongoose.model("Fingerprint", fingerprintSchema);
