const HealthRecord = require("../models/HealthRecord");
const asyncHandler = require("../utils/asyncHandler");

exports.createHealthRecord = async (req, res) => {
  try {
    let documentUrl = "";

    if (req.file) {
      documentUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;
    }

    const record = await HealthRecord.create({
      workerId: req.user._id,
      ...req.body,
      documentUrl,
    });

    res.status(201).json({
      success: true,
      message: "Health record created successfully",
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyHealthRecords = asyncHandler(async (req, res, next) => {
  const records = await HealthRecord.find({
    workerId: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: records.length,
    data: records,
  });
});

exports.deleteMyHealthRecord = asyncHandler(async (req, res, next) => {
  const record = await HealthRecord.findOne({
    _id: req.params.id,
    workerId: req.user._id,
  });

  if (!record) {
    return res.status(404).json({
      success: false,
      message: "Health record not found",
    });
  }

  await HealthRecord.findByIdAndDelete(record._id);

  res.status(200).json({
    success: true,
    message: "Health record deleted successfully",
  });
});

exports.getWorkerHealthRecordsByAdmin = asyncHandler(async (req, res, next) => {
  const records = await HealthRecord.find({
    workerId: req.params.workerId,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: records.length,
    data: records,
  });
});