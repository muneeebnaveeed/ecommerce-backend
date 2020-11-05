const jwt = require("jsonwebtoken");

const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET);

const validateToken = (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) return res.status(401).send({ value: "Incorrect token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).send({ value: "Incorrect token" });
    req.user = payload;
    next();
  });
};

module.exports = {
  generateToken,
  validateToken,
};
