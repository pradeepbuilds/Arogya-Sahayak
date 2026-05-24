const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getAllWorkers,
  verifyWorker,
} = require("../controllers/admin.controller");

const {
  protect,
  adminOnly,
} = require("../middleware/auth.middleware");

router.get(
  "/dashboard",
  protect,
  adminOnly("superadmin", "admin"),
  getDashboard
);

router.get(
  "/workers",
  protect,
  adminOnly("superadmin", "admin"),
  getAllWorkers
);

router.put(
  "/workers/:id/verify",
  protect,
  adminOnly("superadmin", "admin"),
  verifyWorker
);

module.exports = router;