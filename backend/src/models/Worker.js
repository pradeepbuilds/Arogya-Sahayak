const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { encryptData } = require("../utils/encrypt");

const emergencyContactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  relation: String,
});

const workerSchema = new mongoose.Schema(
  {
    workerId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    aadhaar: {
      type: String,
      select: false,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    age: Number,

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    bloodGroup: String,

    occupation: String,

    state: String,

    city: String,

    address: String,

    photo: String,

    qrCode: String,
qrPublicUrl: String,
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    verifiedAt: Date,

    isActive: {
      type: Boolean,
      default: true,
    },

    emergencyContact: emergencyContactSchema,
  },
  { timestamps: true }
);

workerSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  if (this.isModified("aadhaar") && this.aadhaar) {
    this.aadhaar = encryptData(this.aadhaar);
  }
});

workerSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Worker", workerSchema);