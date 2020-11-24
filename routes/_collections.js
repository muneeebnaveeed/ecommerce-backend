const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { _Collection, schema, putSchema } = require("../models/_collections");
const { Product } = require("../models/products");

router.get("/", async (req, res) => {
    try {
        const collections = await _Collection.find();
        res.status(200).send(collections);
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

router.get("/performing", async (req, res) => {
    try {
        const sortedCollections = await _Collection
            .find()
            .sort({ products: -1 });
        res.status(200).send(sortedCollections);
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const collection = await _Collection.findById(req.params.id);
        res.status(200).send(collection);
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

router.get("/:id/products", async (req, res) => {
    const ids = _.pick(req.body, ["products"]).products;
    try {
        const products = await Product.find({ _id: { $in: ids } });
        res.status(200).send(products);
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

router.post("/", async (req, res) => {
    const body = _.pick(req.body, ["title"]);
    const { error } = schema.validate(body);

    if (error) return res.status(400).send({ value: error.details[0].message });

    const duplicateCollection = await _Collection.findOne(body);
    if (duplicateCollection)
        return res
            .status(400)
            .send({ value: "No duplicate collections allowed" });

    try {
        const _collection = new _Collection(body);
        await _collection.save();
        return res.status(200).send(_.pick(_collection, ["_id"]));
    } catch (err) {
        return res.status(404).send({ value: err.name });
    }
});

router.put("/:id", async (req, res) => {
    const body = _.omit(req.body, ["_id"]);

    const { error } = putSchema.validate(body);

    if (error) return res.status(400).send({ value: error.details[0].message });

    try {
        const _collection = await _Collection.findById(req.params.id);
        if (!_collection)
            return res.status(400).send({ value: "No product found" });

        await _collection.updateOne(body);

        res.status(200).send();
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const collection = await _Collection.findByIdAndDelete(req.params.id);
        if (!collection) return res.status(400).send({ value: "Bad ID" });

        res.status(200).send();
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

router.delete("/", async (req, res) => {
    try {
        await _Collection.remove();
        res.status(200).send();
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

module.exports = router;
