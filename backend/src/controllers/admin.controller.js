const Worker = require("../models/Worker");
const APIFeatures = require("../utils/apiFeatures");
const asyncHandler = require("../utils/asyncHandler");

exports.getDashboard = asyncHandler(async (req, res, next) => {
  const totalWorkers = await Worker.countDocuments();

  const verifiedWorkers = await Worker.countDocuments({
    isVerified: true,
  });

  const pendingWorkers = await Worker.countDocuments({
    isVerified: false,
  });

  const activeWorkers = await Worker.countDocuments({
    isActive: true,
  });

  const monthlyRegistrations = await Worker.aggregate([
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);

  const stateStats = await Worker.aggregate([
    {
      $group: {
        _id: "$state",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  const genderStats = await Worker.aggregate([
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
  ]);

  const occupationStats = await Worker.aggregate([
    {
      $group: {
        _id: "$occupation",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      cards: {
        totalWorkers,
        verifiedWorkers,
        pendingWorkers,
        activeWorkers,
      },
      monthlyRegistrations,
      stateStats,
      genderStats,
      occupationStats,
    },
  });
});

exports.getAllWorkers = asyncHandler(async (req, res, next) => {
  const total = await Worker.countDocuments();

  const features = new APIFeatures(
    Worker.find().select("-password -aadhaar"),
    req.query
  )
    .search()
    .filter()
    .sort()
    .paginate();

  const workers = await features.query;

  res.status(200).json({
    success: true,
    total,
    results: workers.length,
    currentPage: Number(req.query.page) || 1,
    data: workers,
  });
});

exports.verifyWorker = asyncHandler(async (req, res, next) => {
  const worker = await Worker.findById(req.params.id);

  if (!worker) {
    return res.status(404).json({
      success: false,
      message: "Worker not found",
    });
  }

  worker.isVerified = true;
  worker.verifiedBy = req.user._id;
  worker.verifiedAt = new Date();

  await worker.save();

  res.status(200).json({
    success: true,
    message: "Worker verified successfully",
    data: worker,
  });
});