const validateObjectId = require('../middleware/validateObjectId');
const { User, validate } = require("../models/user");
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const mongoose = require('mongoose');
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");

router.get("/", async (req, res) => {
  const users = await User.find().sort("email");
  res.send(users);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  // .pick is lodash use
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
