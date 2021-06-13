const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../views/index.html'));
});

/*GET login page*/
router.get('/login', function (req, res, next) {
    res.sendFile(path.resolve(__dirname, '../views/login.html'));
});

module.exports = router;
