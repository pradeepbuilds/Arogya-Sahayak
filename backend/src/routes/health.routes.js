const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const {
  createHealthRecord,
  getMyHealthRecords,
  deleteMyHealthRecord,
  getWorkerHealthRecordsByAdmin,
} = require("../controllers/health.controller");

const {
  protect,
  adminOnly,
} = require("../middleware/auth.middleware");

router.post("/", protect, upload.single("document"), createHealthRecord);
router.get("/", protect, getMyHealthRecords);
router.delete("/:id", protect, deleteMyHealthRecord);

router.get(
  "/admin/:workerId",
  protect,
  adminOnly("superadmin", "admin"),
  getWorkerHealthRecordsByAdmin
);

module.exports = router;