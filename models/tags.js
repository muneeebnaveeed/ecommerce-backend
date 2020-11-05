const mongoose = require("mongoose");
const joi = require("joi");

const mongooseSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25,
  },
});

const joiSchema = joi.object({
  value: joi.string().alphanum().min(2).max(25).required(),
});

const Tag = mongoose.model("tags", mongooseSchema);

module.exports = {
  schema: joiSchema,
  Tag,
};
