const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { FAQ, schema } = require("../models/faqs");

router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).send(faqs);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.post("/", async (req, res) => {
  const body = _.pick(req.body, ["title", "content"]);
  const { error } = schema.validate(body);

  if (error) return res.status(400).send({ value: error.details[0].message });

  try {
    const faq = new FAQ(body);
    await faq.save();
    return res.status(200).send(_.pick(faq, ["_id"]));
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.post("/:id", async (req, res) => {
  const body = _.omit(req.body, ["_id"]);
  const { error } = schema.validate(body);

  if (error) return res.status(400).send({ value: error.details[0].message });

  try {
    const faq = await FAQ.findById(req.params.id);
    await faq.updateOne(body);
    return res.status(200).send();
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.delete("/", async (req, res) => {
  try {
    await FAQ.remove();
    res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(400).send({ value: "Bad ID" });
    res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

module.exports = router;
