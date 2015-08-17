'use strict';

var express = require('express');
var controller = require('./users.controller');
// var auth = ???

var router = express.Router();

router.get('/', controller.getAll );
router.post('/', controller.create );

module.exports = router;