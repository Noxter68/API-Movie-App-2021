const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { WatchList, validate } = require("../models/watchlist");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const movie = await WatchList.findOne({id: req.params.id});
  res.send(movie);
});

router.get("/list/:user",auth, async (req, res) => {
    const watchList = await WatchList.find({user : req.params.user}).sort('title');
    res.send(watchList);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const user = await User.findById(req.body.user);
  if (!user) return res.status(400).send("Invalid User.");
  
  let movie = await WatchList.findOne({ title: req.body.title });
  if (movie) return res.status(400).send("Movie already added to watchlist.");

  let watchList = new WatchList({
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    duration: req.body.duration,
    poster_path: req.body.poster_path,
    genre: req.body.genre,
    user: req.body.user
  });
  watchList = await watchList.save();

  res.send(watchList);
});



router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const watchList = await WatchList.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      poster_path: req.body.poster_path,
      genre: req.body.genre,
    },
    { new: true }
  );

  if (!watchList)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(watchList);
});

router.delete("/:id", auth, async (req, res) => {
  const watchList = await WatchList.findOneAndRemove({ id: req.params.id });

  if (!watchList)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(watchList);
});

module.exports = router;
