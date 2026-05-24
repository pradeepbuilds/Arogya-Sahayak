const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    schemeId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: String,

    benefits: String,

    applyLink: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    category: {
      type: String,
      enum: ["health", "insurance", "pension", "housing", "other"],
    },

    eligibility: {
      minAge: Number,
      maxAge: Number,

      gender: {
        type: String,
        enum: ["male", "female", "all"],
      },

      occupations: [String],

      states: [String],

      maxIncome: Number,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Scheme", schemeSchema);