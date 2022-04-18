const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

//import routes
const authRoute = require("./routes/auth");
const sauceRoute = require("./routes/sauce");
//connect to db

mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}`, { useNewUrlParser: true })
  .then(() => console.log("connected to db"))
  .catch((e) => console.log(e));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

//middleware
app.use(express.json());
app.use("/images", express.static(__dirname + "/Images"));

//route middleware
app.use("/api/auth", authRoute);
app.use("/api/sauces", sauceRoute);

app.listen(3000, () => console.log("server up and running"));

module.exports = app;
