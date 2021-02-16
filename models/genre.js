const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
    id: [{ id: Number, name: String}]
})


const Genre = mongoose.model('Genre', genreSchema);
  
  function validateGenre(genre) {
    const schema = {
      name: Joi.string().min(3).required().trim(),
    };
    const options = { abortEarly: false };
    return Joi.validate(genre, schema, options);
  }

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre