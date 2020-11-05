const mongoose = require("mongoose");
const joi = require("joi");

const mongooseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 155,
  },
  products: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const joiSchema = joi.object({
  title: joi.string().min(3).max(155).required(),
});

const putSchema = joi.object({
  title: joi.string().min(3).max(155),
});

const _Collection = mongoose.model("_collections", mongooseSchema);

module.exports = {
  schema: joiSchema,
  putSchema,
  _Collection,
};
