const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render(path.join(rootPath, '/public/html/index.html'));
});

module.exports = router;
