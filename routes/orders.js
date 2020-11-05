const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { Order, schema, putSchema } = require("../models/orders");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders || !orders.length)
      return res.status(400).send({ value: "No orders found" });

    res.status(200).send(orders);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.post("/", async (req, res) => {
  const body = _.pick(req.body, ["name", "address", "status", "products"]);
  const { error } = schema.validate(body);

  if (error) return res.status(400).send({ value: error.message.details[0] });

  try {
    const order = new Order(body);
    await order.save();
    return res.status(200).send(_.pick(order, ["_id"]));
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.put("/:id", async (req, res) => {
  const body = _.omit(req.body, ["_id"]);

  const { error } = putSchema.validate(body);

  if (error) return res.status(400).send({ value: error.details[0].message });

  try {
    const order = await Product.findById(req.params.id);
    if (!order) return res.status(400).send({ value: "No order found" });

    await order.updateOne(body);

    res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Order.remove();
    return res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

module.exports = router;
