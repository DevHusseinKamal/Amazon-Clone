const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();

const productsRoutes = require("./routes/product");
const usersRoutes = require("./routes/user");
const ordersRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");

const HttpError = require("./errors/http-error");
const errorHandler = require("./middlewares/error-handler");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requseted-With, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/api/products", productsRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/keys/", paymentRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route.", 404);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@amazon.ealyt8d.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => app.listen(PORT, () => console.log("RUNNING")))
  .catch((err) => console.log(err));
