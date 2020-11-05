const mongoose = require("mongoose");
const joi = require("joi");

const mongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 55,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 55,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const joiSchema = joi.object({
  name: joi.string().min(1).max(55).required(),
  email: joi.string().min(1).max(55).required(),
  password: joi.string().required(),
});

const Admin = mongoose.model("admins", mongooseSchema);

module.exports = {
  schema: joiSchema,
  Admin,
};
