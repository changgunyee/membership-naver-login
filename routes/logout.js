const express = require('express');
const router = express.Router();
const path = require('path');
const {executeSessionSqls} = require("./sqls");

router.get('/', logout);

async function logout(req, res) {
    try {
        const sessionId = req.cookies.user.sessionId;
        const response = await executeSessionSqls.deleteSessionById(sessionId);
        res.clearCookie("user");
        res.json(response);
    } catch (e) {
        res.json(null);
    }
}

module.exports = router;
