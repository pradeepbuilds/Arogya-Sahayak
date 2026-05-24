const express = require("express");

const router = express.Router();

const {
  createScheme,
  getAllSchemes,
  getEligibleSchemes,
  updateScheme,
  deleteScheme,
} = require("../controllers/scheme.controller");

const {
  protect,
  adminOnly,
} = require("../middleware/auth.middleware");

router.get("/", protect, getAllSchemes);

router.get(
  "/eligible",
  protect,
  getEligibleSchemes
);

router.post(
  "/admin",
  protect,
  adminOnly("superadmin", "admin"),
  createScheme
);

router.put(
  "/admin/:id",
  protect,
  adminOnly("superadmin", "admin"),
  updateScheme
);

router.delete(
  "/admin/:id",
  protect,
  adminOnly("superadmin", "admin"),
  deleteScheme
);

module.exports = router;