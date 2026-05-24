const Notification = require("../models/Notification");
const Worker = require("../models/Worker");
const asyncHandler = require("../utils/asyncHandler");

exports.sendNotification = asyncHandler(async (req, res, next) => {
  const { title, message, targetType, targetWorkers, targetState } = req.body;

  let workers = [];

  if (targetType === "all") {
    workers = await Worker.find({ isActive: true }).select("_id");
  }

  if (targetType === "state") {
    workers = await Worker.find({
      isActive: true,
      state: targetState,
    }).select("_id");
  }

  if (targetType === "individual") {
    workers = targetWorkers.map((id) => ({ _id: id }));
  }

  const notification = await Notification.create({
    title,
    message,
    type: "manual",
    targetType,
    targetWorkers: workers.map((worker) => worker._id),
    targetState,
    sentBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Notification sent successfully",
    data: notification,
  });
});

exports.getMyNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({
    $or: [
      { targetType: "all" },
      { targetWorkers: req.user._id },
      { targetType: "state", targetState: req.user.state },
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  if (!notification.readBy.includes(req.user._id)) {
    notification.readBy.push(req.user._id);
    await notification.save();
  }

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
  });
});

exports.getAllNotificationsAdmin = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find()
    .populate("sentBy", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});