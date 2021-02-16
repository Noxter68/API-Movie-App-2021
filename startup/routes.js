const express = require('express');
const error = require("../middleware/error");
const cors = require("cors");
const logger = require("../middleware/logger");
const watchlist = require("../routes/watchlist");
const home = require("../routes/home");
const user = require("../routes/user");
const auth = require("../routes/auth");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/api/watchlist", watchlist);
  app.use("/api/users", user);
  app.use("/api/auth", auth);
  app.use("/", home);
  app.use(error);
};
