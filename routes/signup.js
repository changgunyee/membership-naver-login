const {executeSignupSqls} = require("./sqls");

const express = require('express');
const router = express.Router();
const path = require('path');

router.post('/', async (req, res) => {
    try {
        const result = await executeSignupSqls.addUser(req);
        if (!result) {
            throw new Error("ID이미 존재");
        }
        res.json({
            result: true,
            name: result
        })
    } catch (e) {
        res.json({
            result: false,
            name: null
        })
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await executeSignupSqls.checkIdExists(req);
        res.json({
            result: result
        })
    } catch (e) {
        res.json({
            result: true
        })
    }
})

module.exports = router;
