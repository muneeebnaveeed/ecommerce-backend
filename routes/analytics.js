const express = require("express");
const router = express.Router();

const Analytics = require("../models/analytics");

router.get("/", async (req, res) => {
  try {
    const analytics = await Analytics.find();
    res.status(200).send(analytics);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.post("/wishlist", async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    await analytics.updateOne({ wishlist: analytics.wishlist + 1 });
    res.status(200).send(analytics);
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    await analytics.updateOne({ cart: analytics.cart + 1 });
    res.status(200).send(analytics);
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    await analytics.updateOne({ orders: analytics.orders + 1 });
    res.status(200).send(analytics);
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.delete("/", async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    await analytics.updateOne({ wishlist: 0, cart: 0, orders: 0 });
    res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.delete("/wishlist", async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    await analytics.updateOne({ wishlist: 0 });
    res.status(200).send();
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.delete("/cart", async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    await analytics.updateOne({ cart: 0 });
    res.status(200).send();
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.delete("/orders", async (req, res) => {
  try {
    const analytics = await Analytics.findOne();
    await analytics.updateOne({ orders: 0 });
    res.status(200).send();
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

module.exports = router;
