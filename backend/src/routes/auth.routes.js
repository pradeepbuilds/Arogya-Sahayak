const express = require("express");
const router = express.Router();

const {
  registerWorker,
  loginWorker,
  registerAdmin,
  loginAdmin,
} = require("../controllers/auth.controller");

const validate = require("../middleware/validate.middleware");

const {
  workerRegisterSchema,
  workerLoginSchema,
  adminRegisterSchema,
  adminLoginSchema,
} = require("../validators/auth.validator");

router.post("/register", validate(workerRegisterSchema), registerWorker);
router.post("/login", validate(workerLoginSchema), loginWorker);

router.post("/admin/register", validate(adminRegisterSchema), registerAdmin);
router.post("/admin/login", validate(adminLoginSchema), loginAdmin);

module.exports = router;