'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
router.get('/signup', function(req, res){
    res.sendFile(__dirname + '/views/signup.html');
});

module.exports = router;