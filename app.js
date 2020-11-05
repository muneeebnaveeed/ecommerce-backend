const express = require("express");
const dotenv = require("dotenv");
const parser = require("body-parser");
const mongoose = require("mongoose");

const routes = require("./routes");
const { auth } = require("./utils");
const { generateToken } = require("./utils/auth");

// boilerplate
const app = express();
dotenv.config();

const { validateToken } = auth;

// db connection
mongoose
  .connect(process.env.DB_CONNECTION || null, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");

    // init express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Running server on Port ${port}`));

    // middlewares
    app.use(parser.json());

    // routes
    app.use("/tags", validateToken, routes.tags);
    app.use("/products", validateToken, routes.products);
    app.use("/collections", validateToken, routes._collections);
    app.use("/types", validateToken, routes.types);
    app.use("/analytics", validateToken, routes.analytics);
    app.use("/orders", validateToken, routes.orders);
    app.use("/faqs", validateToken, routes.faqs);

    // auth
    app.use("/auth", routes.auth);
  })
  .catch((err) => console.log(err));
