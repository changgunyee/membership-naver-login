const {executeSessionSqls} = require("./sqls");
const express = require('express');
const router = express.Router();
const path = require('path');

const MINUTE = 1000 * 60;

router.use(checkSession);

setInterval(async () => {
    await executeSessionSqls.deleteSessionsByExpireDate(Date.now());
}, MINUTE)

async function checkSession(req, res, next) {
    if (req.cookies.user && req.cookies.user.sessionId) {
        try {
            const user = await executeSessionSqls.getUserIdBySessionId(req.cookies.user.sessionId);
            if (user) {
                req.userId = user.userId;
            } else {
                req.clearCookie("user");
            }
        } catch (e) {
            console.log(e);
        }

        try {
            await executeSessionSqls.updateSessionExpireDate(req.cookies.user.sessionId, Date.now() + executeSessionSqls.EXPIRE_DELAY);
        } catch (e) {
            console.log(e);
        }

    }
    return next();
}

module.exports = router;
