const mongoose = require("mongoose");

const apologiesSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
    },
    seenByStaff: {
      type: Boolean,
      default: false,
    },
    seenAt: Date,
  },
  { timestamps: true }
);

apologiesSchema.pre(/^find/, function (next) {
  this.populate("course", "courseName");
  next();
});

module.exports = mongoose.model("Apology", apologiesSchema);
