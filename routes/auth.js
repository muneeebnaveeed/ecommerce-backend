const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

const { Admin, schema } = require("../models/admins");
const { generateToken } = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).send(admins);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/register", async (req, res) => {
  const body = _.pick(req.body, ["name", "email", "password"]);

  const { error } = schema.validate(body);

  if (error) return res.status(400).send({ value: error.details[0].message });

  try {
    const duplicateAdmin = await Admin.findOne({
      $or: [{ name: body.name }, { email: body.email }],
    });
    if (duplicateAdmin)
      return res
        .status(400)
        .send({ value: "Name and/or Email already exists" });

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(body.password, salt);
    body.password = hash;

    const admin = new Admin(body);
    await admin.save();
    res.status(200).send(admin._id);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(400).send({ value: "Admin doesn't exist" });

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!isValidPassword)
      return res.status(403).send({ value: "Invalid password" });

    const body = _.pick(req.body, ["name", "email", "password"]);

    if (body.password) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(body.password, salt);
      body.password = hash;
    }

    await admin.update(body);
    res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

router.post("/login", async (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  try {
    const admin = await Admin.findOne({ email: body.email });
    if (!admin)
      return res.status(400).send({ value: "Incorrect Email and/or Password" });

    const isValidPassword = await bcrypt.compare(body.password, admin.password);
    if (!isValidPassword)
      return res.status(400).send({ value: "Incorrect Email and/or Password" });

    const payload = _.pick(admin, ["_id", "name", "email"]);
    const token = generateToken(payload);

    res.status(200).send(token);
  } catch (err) {
    res.status(404).send({ value: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(400).send({ value: "Admin not found" });

    res.status(200).send();
  } catch (err) {
    res.status(404).send({ value: err.name });
  }
});

module.exports = router;
