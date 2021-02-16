const mongoose = require("mongoose");
const Joi = require("joi");

const WatchList = mongoose.model(
  "WatchList",
  new mongoose.Schema({
    user: {
      type:String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1000,
    },
    duration: {
      type: Number,
      required: true,
    },
    poster_path: {
      type: String,
      required: true,
    },
    genre: [{id: Number, name: String}]
  })
);

function validateWatchlist(movie) {
  const schema = {
    id: Joi.number().required(),
    title: Joi.string().min(3).required(),
    description: Joi.string().required(),
    duration: Joi.number().required(),
    poster_path: Joi.string().min(3).required(),
    genre: Joi.required(),
    user: Joi.string().required()
  };
  const options = { abortEarly: false };
  return Joi.validate(movie, schema, options);
}

exports.WatchList = WatchList;
exports.validate = validateWatchlist
