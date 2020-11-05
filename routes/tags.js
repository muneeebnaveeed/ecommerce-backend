const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { Tag, schema } = require("../models/tags");

router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).send(tags);
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.post("/", async (req, res) => {
  const body = _.pick(req.body, ["value"]);
  const { error } = schema.validate(body);

  if (error) return res.status(400).send({ value: error.details[0].message });

  const duplicateTag = await Tag.findOne(body);
  if (duplicateTag)
    return res.status(400).send({ value: "No duplicate tags allowed" });

  try {
    const tag = new Tag(body);
    await tag.save();
    return res.status(200).send(_.pick(tag, ["_id"]));
  } catch (err) {
    return res.status(404).send({ value: err.name });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) return res.status(400).send({ value: "Bad ID" });

    res.status(200).send(_.pick(tag, ["_id"]));
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

module.exports = router;
