const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Welcome on my personal Movie API for David's AppMovie.");
 })

 module.exports = router;