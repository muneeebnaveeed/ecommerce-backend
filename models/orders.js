const mongoose = require("mongoose");
const joi = require("joi");

const productModel = require("./products");

const mongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 155,
  },
  address: {
    type: String,
    required: true,
    minlength: 15,
    maxlength: 255,
  },
  products: {
    type: productModel.mongooseSchema,
    ref: "products",
  },
  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "dispatched",
      "received",
      "completed",
      "rejected",
      "returned",
    ],
    default: "pending",
  },
  total: {
    type: Number,
    min: 1,
  },
  date: {
    type: Date,
    default: new Date(),
  },
});

const joiSchema = joi.object({
  name: joi.string().min(3).max(155).required(),
  address: joi.string().min(15).max(255).required(),
  status: joi
    .string()
    .valid(
      "pending",
      "processing",
      "dispatched",
      "received",
      "completed",
      "rejected",
      "returned"
    ),
  total: joi.number().min(1),
});

const putSchema = joi.object({
  name: joi.string().min(3).max(155),
  address: joi.string().min(15).max(255),
  status: joi
    .string()
    .valid(
      "pending",
      "processing",
      "dispatched",
      "received",
      "completed",
      "rejected",
      "returned"
    ),
  total: joi.number().min(1),
});

const Order = mongoose.model("orders", mongooseSchema);

module.exports = {
  schema: joiSchema,
  putSchema,
  Order,
};
