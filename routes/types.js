const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { Type, schema, putSchema } = require("../models/types");

router.get("/", async (req, res) => {
    try {
        const types = await Type.find();
        res.status(200).send(types);
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const type = await Type.findById(req.params.id);
        res.status(200).send(type);
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

router.post("/", async (req, res) => {
    const body = _.pick(req.body, ["title"]);
    const { error } = schema.validate(body);

    if (error) return res.status(400).send({ value: error.details[0].message });

    const duplicateType = await Type.findOne(body);
    if (duplicateType)
        return res.status(400).send({ value: "No duplicate types allowed" });

    try {
        const type = new Type(body);
        await type.save();
        return res.status(200).send(_.pick(type, ["_id"]));
    } catch (err) {
        return res.status(404).send({ value: err.name });
    }
});

router.put("/:id", async (req, res) => {
    const body = _.omit(req.body, ["_id"]);

    const { error } = putSchema.validate(body);

    if (error) return res.status(400).send({ value: error.details[0].message });

    try {
        const type = await Type.findById(req.params.id);
        if (!type) return res.status(400).send({ value: "No type found" });

        await type.updateOne(body);

        res.status(200).send(req.body);
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const type = await Type.findByIdAndDelete(req.params.id);
        if (!type) return res.status(400).send({ value: "Bad ID" });

        res.status(200).send();
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

router.delete("/", async (req, res) => {
    try {
        await Type.remove();
        res.status(200).send();
    } catch (err) {
        res.status(404).send({ value: err.name });
    }
});

module.exports = router;
