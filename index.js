require("dotenv").config();

const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

// MONGODB SETUP
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// IMPORT ROUTES
const userRoutes = require("./routes/user");
app.use(userRoutes);
const restoRoutes = require("./routes/restaurant");
app.use(restoRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "all routes" });
});

// LISTEN
app.listen(process.env.PORT, () => {
  console.log("Server Started on port : " + process.env.PORT);
});
