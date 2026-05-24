const express = require("express");

const router = express.Router();

const {
  getPublicWorkerProfile,
} = require("../controllers/public.controller");

router.get("/worker/:workerId", getPublicWorkerProfile);

module.exports = router;