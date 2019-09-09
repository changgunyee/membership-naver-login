const express = require('express');
const router = express.Router();
const path = require('path');
const {executeUserSqls} = require("./sqls");

router.get('/', getUser);

async function getUser(req, res) {
    let userId;
    if (req.userId) {
        userId = req.userId;
    } else if (req.query.id) {
        userId = req.query.id;
    } else {
        return res.json(null);
    }
    try {
        const user = await executeUserSqls.getUser(userId);
        return res.json(user);
    } catch (e) {
        return res.json(null);
    }
}

module.exports = router;
