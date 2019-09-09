const {executeUserSqls} = require("./sqls");

const express = require('express');
const router = express.Router();
const path = require('path');

router.post('/', signup);

router.get('/', checkIdAvailable);

async function signup(req, res) {
    try {
        const {id, password, name, birth, gender, email, phoneNumber, interest, tos} = req.body;
        const available = await executeUserSqls.checkIdAvailable(id);
        if (!available) {
            return res.json(null);
        }

        const response = await executeUserSqls.addUser(id, password, name, birth, gender, email, phoneNumber, interest, tos);
        return res.json(response);
    } catch (e) {
        return res.json(null);
    }
}

async function checkIdAvailable(req, res) {
    try {
        const response = await executeUserSqls.checkIdAvailable(req.query.id);
        return res.json(response);
    } catch (e) {
        return res.json(null)
    }
}

module.exports = router;
