const Worker = require("../models/Worker");
const Admin = require("../models/Admin");
const asyncHandler = require("../utils/asyncHandler");
const generateWorkerId = require("../utils/generateWorkerId");
const generateQR = require("../utils/generateQR");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");
const ApiError = require("../utils/ApiError");

// Worker Register
exports.registerWorker = asyncHandler(async (req, res, next) => {
  const existingWorker = await Worker.findOne({ phone: req.body.phone });

  if (existingWorker) {
    return next(new ApiError(400, "Worker already exists with this phone"));
  }

  const workerId = await generateWorkerId();
  const { qrCode, publicUrl } = await generateQR(workerId);

  const worker = await Worker.create({
    ...req.body,
    workerId,
    qrCode,
    qrPublicUrl: publicUrl,
  });

  const accessToken = generateAccessToken(worker._id, "worker");
  const refreshToken = generateRefreshToken(worker._id, "worker");

  res.status(201).json({
    success: true,
    message: "Worker registered successfully",
    data: {
      worker: {
        id: worker._id,
        workerId: worker.workerId,
        name: worker.name,
        phone: worker.phone,
      },
      accessToken,
      refreshToken,
    },
  });
});

// Worker Login
exports.loginWorker = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;

  const worker = await Worker.findOne({ phone }).select("+password");

  if (!worker) {
    return next(new ApiError(401, "Invalid phone or password"));
  }

  if (!worker.isActive) {
    return next(new ApiError(403, "Worker account is inactive"));
  }

  const isMatch = await worker.comparePassword(password);

  if (!isMatch) {
    return next(new ApiError(401, "Invalid phone or password"));
  }

  const accessToken = generateAccessToken(worker._id, "worker");
  const refreshToken = generateRefreshToken(worker._id, "worker");

  res.status(200).json({
    success: true,
    message: "Worker login successful",
    data: {
      worker: {
        id: worker._id,
        workerId: worker.workerId,
        name: worker.name,
        phone: worker.phone,
      },
      accessToken,
      refreshToken,
    },
  });
});

// Admin Register
exports.registerAdmin = asyncHandler(async (req, res, next) => {
  const existingAdmin = await Admin.findOne({ email: req.body.email });

  if (existingAdmin) {
    return next(new ApiError(400, "Admin already exists with this email"));
  }

  const admin = await Admin.create(req.body);

  const accessToken = generateAccessToken(admin._id, admin.role);
  const refreshToken = generateRefreshToken(admin._id, admin.role);

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

// Admin Login
exports.loginAdmin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    return next(new ApiError(401, "Invalid email or password"));
  }

  if (!admin.isActive) {
    return next(new ApiError(403, "Admin account is inactive"));
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return next(new ApiError(401, "Invalid email or password"));
  }

  admin.lastLogin = new Date();
  await admin.save();

  const accessToken = generateAccessToken(admin._id, admin.role);
  const refreshToken = generateRefreshToken(admin._id, admin.role);

  res.status(200).json({
    success: true,
    message: "Admin login successful",
    data: {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    },
  });
});