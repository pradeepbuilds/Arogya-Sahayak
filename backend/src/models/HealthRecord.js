const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },

    recordType: {
      type: String,
      enum: [
        "disease",
        "medicine",
        "report",
        "allergy",
        "note",
      ],
    },

    title: {
      type: String,
      required: true,
    },

    description: String,

    doctorName: String,

    hospitalName: String,

    date: Date,

    attachments: [String],
    documentUrl: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "HealthRecord",
  healthRecordSchema
);