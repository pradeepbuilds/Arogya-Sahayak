const Scheme = require("../models/Scheme");
const asyncHandler = require("../utils/asyncHandler");

exports.createScheme = asyncHandler(async (req, res, next) => {
  const scheme = await Scheme.create({
    ...req.body,
    addedBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Scheme created successfully",
    data: scheme,
  });
});

exports.getAllSchemes = asyncHandler(async (req, res, next) => {
  const schemes = await Scheme.find({
    isActive: true,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: schemes.length,
    data: schemes,
  });
});

exports.getEligibleSchemes = asyncHandler(async (req, res, next) => {
  const worker = req.user;

  const schemes = await Scheme.find({
    isActive: true,
  });

  const eligibleSchemes = schemes.filter((scheme) => {
    const eligibility = scheme.eligibility;

    if (eligibility.minAge && worker.age < eligibility.minAge) {
      return false;
    }

    if (eligibility.maxAge && worker.age > eligibility.maxAge) {
      return false;
    }

    if (
      eligibility.gender &&
      eligibility.gender !== "all" &&
      eligibility.gender !== worker.gender
    ) {
      return false;
    }

    if (
      eligibility.states &&
      eligibility.states.length > 0 &&
      !eligibility.states.includes(worker.state)
    ) {
      return false;
    }

    if (
      eligibility.occupations &&
      eligibility.occupations.length > 0 &&
      !eligibility.occupations.includes(worker.occupation)
    ) {
      return false;
    }

    return true;
  });

  res.status(200).json({
    success: true,
    count: eligibleSchemes.length,
    data: eligibleSchemes,
  });
});

exports.updateScheme = asyncHandler(async (req, res, next) => {
  const scheme = await Scheme.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  if (!scheme) {
    return res.status(404).json({
      success: false,
      message: "Scheme not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Scheme updated successfully",
    data: scheme,
  });
});

exports.deleteScheme = asyncHandler(async (req, res, next) => {
  const scheme = await Scheme.findById(req.params.id);

  if (!scheme) {
    return res.status(404).json({
      success: false,
      message: "Scheme not found",
    });
  }

  await Scheme.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Scheme deleted successfully",
  });
});