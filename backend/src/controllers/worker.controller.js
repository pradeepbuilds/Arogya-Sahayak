const Worker = require("../models/Worker");
const asyncHandler = require("../utils/asyncHandler");

exports.getProfile = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const worker = await Worker.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password -aadhaar");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: worker,
  });
});