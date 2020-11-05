const mongoose = require("mongoose");
const joi = require("joi");

const mongooseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 255,
  },
});

const joiSchema = joi.object({
  title: joi.string().min(10).max(255).required(),
  content: joi.string().min(10).max(255).required(),
});

const FAQ = mongoose.model("faqs", mongooseSchema);

module.exports = {
  schema: joiSchema,
  FAQ,
};
