const mongoose = require("mongoose");

const mongooseSchema = new mongoose.Schema({
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

const Analytics = mongoose.model("analytics", mongooseSchema);

module.exports = Analytics;
