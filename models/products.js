const mongoose = require("mongoose");
const joi = require("joi");

const mongooseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  type: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  description: {
    type: String,
    required: true,
    minlength: 150,
    maxlength: 1024,
  },
  _collection: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 155,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  sku: {
    type: String,
  },
  tags: {
    type: Array,
    default: [],
  },
  discountedPrice: {
    type: Number,
    min: 2,
  },
  couponed: {
    type: Object,
    default: {
      isCouponed: false,
      coupon: null,
    },
  },
  sizes: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
    default: new Date(),
  },
  wishlist: {
    type: Number,
    min: 0,
    default: 0,
  },
  cart: {
    type: Number,
    min: 0,
    default: 0,
  },
  orders: {
    type: Number,
    min: 0,
    default: 0,
  },
});

const joiSchema = joi.object({
  title: joi.string().min(5).max(255).required(),
  type: joi.string().min(3).max(10).required(),
  description: joi.string().min(150).max(1024).required(),
  _collection: joi.string().min(3).max(155).required(),
  price: joi.number().min(1).required(),
  sku: joi.string(),
  tags: joi.array(),
  discountedPrice: joi.number().min(2),
  couponed: joi.object(),
  sizes: joi.array(),
  date: joi.date(),
});

const putSchema = joi.object({
  title: joi.string().min(5).max(255),
  type: joi.string().min(3).max(10),
  description: joi.string().min(150).max(1024),
  _collection: joi.string().min(3).max(155),
  price: joi.number().min(1),
  sku: joi.string(),
  tags: joi.array(),
  discountedPrice: joi.number().min(2),
  couponed: joi.object(),
  sizes: joi.array(),
  date: joi.date(),
});

const analyticsSchema = joi.object({
  wishlist: joi.number().min(0),
  cart: joi.number().min(0),
  orders: joi.number().min(0),
});

const Product = mongoose.model("products", mongooseSchema);

module.exports = {
  schema: joiSchema,
  putSchema,
  Product,
  mongooseSchema,
  analyticsSchema,
};
