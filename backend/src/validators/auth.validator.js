const Joi = require("joi");

const workerRegisterSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().min(6).required(),
  aadhaar: Joi.string().pattern(/^[0-9]{12}$/).optional().allow(""),
  age: Joi.number().min(18).max(100).optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  bloodGroup: Joi.string().optional().allow(""),
  occupation: Joi.string().optional().allow(""),
  state: Joi.string().optional().allow(""),
  city: Joi.string().optional().allow(""),
  address: Joi.string().optional().allow(""),
});

const workerLoginSchema = Joi.object({
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  password: Joi.string().required(),
});

const adminRegisterSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("superadmin", "admin", "viewer").optional(),
});

const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  workerRegisterSchema,
  workerLoginSchema,
  adminRegisterSchema,
  adminLoginSchema,
};