const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["manual", "automated"],
      default: "manual",
    },

    targetType: {
      type: String,
      enum: ["all", "state", "individual"],
      default: "all",
    },

    targetWorkers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
      },
    ],

    targetState: String,

    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);