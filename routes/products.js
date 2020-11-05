const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");

const { Product, schema, putSchema } = require("../models/products");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || !products.length)
      return res.status(400).send("No products found");
    res.status(200).send(products);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.get("/combination", async (req, res) => {
  try {
    const params = _.pick(req.query, ["type", "collection", "tags"]);

    const type = params.type || null;
    const collection = params.collection || null;
    const tags = params.tags || null;

    const typeQuery = type ? { type } : {};
    const collectionQuery = collection ? { _collection: collection } : {};
    const tagsQuery = tags ? { tags: { $all: tags } } : {};

    const query = await Product.find({
      ...typeQuery,
      ...collectionQuery,
      ...tagsQuery,
    });

    const ids = _.map(query, (product) => mongoose.Types.ObjectId(product._id));
    const products = await Product.find({ _id: { $in: ids } });

    if (!products || !products.length)
      return res.status(400).send("No products found");

    res.status(200).send(products);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.get("/type/:type", async (req, res) => {
  try {
    const products = await Product.find({ type: req.params.type });
    if (!products || !products.length)
      return res.status(400).send("No products found");

    res.status(200).send(products);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.get("/collection/:collection", async (req, res) => {
  console.log(req.query);
  try {
    const products = await Product.find({ _collection: req.params.collection });
    if (!products || !products.length)
      return res.status(400).send("No products found");

    res.status(200).send(products);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.get("/tag/:tags", async (req, res) => {
  try {
    const tags = req.params.tags.split(",");
    const products = await Product.find({ tags: { $all: tags } });
    if (!products || !products.length)
      return res.status(400).send("No products found");

    res.status(200).send(products);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send("No products found");
    res.status(200).send(product);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.post("/", async (req, res) => {
  const body = _.pick(req.body, [
    "title",
    "type",
    "description",
    "_collection",
    "price",
    "sku",
    "tags",
    "discountedPrice",
    "couponed",
    "sizes",
  ]);

  const { error } = schema.validate(body);

  if (error) return res.status(400).send({ value: error.details[0].message });

  const duplicate = await Product.findOne(
    _.pick(body, ["title", "type", "_collection"])
  );
  if (duplicate)
    return res.status(400).send({ value: "Similar product already exists" });

  if (body.sku) {
    const duplicateSKU = await Product.findOne({ sku: body.sku });
    if (duplicateSKU)
      return res
        .status(400)
        .send({ value: "No products with duplicate SKU allowed" });
  }

  try {
    const product = new Product(body);
    await product.save();
    return res.status(200).send(_.pick(product, ["_id"]));
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.post("/:id/wishlist", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await product.updateOne({ wishlist: product.wishlist + 1 });
    return res.status(200).send();
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.post("/:id/cart", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await product.updateOne({ cart: product.cart + 1 });
    return res.status(200).send();
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.post("/:id/orders", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await product.updateOne({ orders: product.orders + 1 });
    return res.status(200).send();
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.put("/:id", async (req, res) => {
  const body = _.omit(req.body, ["_id"]);

  const { error } = putSchema.validate(body);

  if (error) return res.status(400).send({ value: error.details[0].message });

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(400).send({ value: "No product found" });

    await product.updateOne(body);

    res.status(200).send(product);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Product.remove();
    res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.delete("/collection/:collection", async (req, res) => {
  try {
    await Product.deleteMany({ _collection: req.params.collection });
    res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.delete("/type/:type", async (req, res) => {
  try {
    await Product.deleteMany({ type: req.params.type });
    res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(400).send({ value: "Product does not exist" });

    res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.delete("/:id/wishlist", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await product.updateOne({ wishlist: product.wishlist - 1 });
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.delete("/:id/cart", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await product.updateOne({ cart: product.cart - 1 });
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.delete("/:id/orders", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await product.updateOne({ orders: product.orders - 1 });
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

module.exports = router;
