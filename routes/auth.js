const { User } = require("../models/user");
const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Email or password.");

  const token = user.generateAuthToken();
  
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(3).required().email().trim(),
    password: Joi.string().required().trim(),
  };
  const options = { abortEarly: false };
  return Joi.validate(req, schema, options);
}

module.exports = router;
