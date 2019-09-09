const express = require('express');
const router = express.Router();
const path = require('path');
const {executeSessionSqls, executeUserSqls} = require("./sqls");
const uuidv4 = require('uuid/v4');

router.post('/', login, createSession);

async function login(req, res, next) {
    try {
        const {id, password} = req.body;
        const loginResponse = await executeUserSqls.login(id, password);
        if (loginResponse) {
            req.userId = loginResponse.userId;
            return next();
        }
        return res.json(loginResponse);
    } catch (e) {
        return res.json(null);
    }
}

async function createSession(req, res) {
    let sessionId = uuidv4();
    let user = true;
    while (user) {
        try {
            sessionId = uuidv4();
            user = await executeSessionSqls.getUserIdBySessionId(sessionId);
        } catch (e) {
            return res.json(null);
        }
    }

    const createDate = Date.now();
    const expireDate = createDate + executeSessionSqls.EXPIRE_DELAY;
    try {
        const response = await executeSessionSqls.createSession(sessionId, req.userId, createDate, expireDate);
        res.cookie("user", {sessionId: response.sessionId}, {maxAge: executeSessionSqls.EXPIRE_DELAY});
        return res.json(response);
    } catch (e) {
        return res.json(null);
    }
}

module.exports = router;
