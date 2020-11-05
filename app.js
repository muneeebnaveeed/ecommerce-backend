const express = require("express");
const dotenv = require("dotenv");
const parser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");

// boilerplate
const app = express();
dotenv.config();

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
    app.use("/tags", routes.tags);
    app.use("/products", routes.products);
    app.use("/collections", routes._collections);
    app.use("/types", routes.types);
    app.use("/analytics", routes.analytics);
    app.use("/orders", routes.orders);
    app.use("/faqs", routes.faqs);
  })
  .catch((err) => console.log(err));
