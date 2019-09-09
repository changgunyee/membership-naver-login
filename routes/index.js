const express = require('express');
const router = express.Router();
const path = require('path');
const {executeSessionSqls} = require("./sqls");

/* GET home page. */
router.get('/', (req, res) => {
    return res.render(path.join(rootPath, '/public/html/index.html'));
});


module.exports = router;
