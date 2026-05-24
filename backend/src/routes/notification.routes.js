const express = require("express");
const router = express.Router();

const {
  sendNotification,
  getMyNotifications,
  markAsRead,
  getAllNotificationsAdmin,
} = require("../controllers/notification.controller");

const {
  protect,
  adminOnly,
} = require("../middleware/auth.middleware");

router.get("/", protect, getMyNotifications);

router.put("/:id/read", protect, markAsRead);

router.post(
  "/admin/send",
  protect,
  adminOnly("superadmin", "admin"),
  sendNotification
);

router.get(
  "/admin/all",
  protect,
  adminOnly("superadmin", "admin"),
  getAllNotificationsAdmin
);

module.exports = router;