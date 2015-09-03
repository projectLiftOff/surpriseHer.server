'use strict';

var express = require('express');
var controller = require('./transactions.controller');
// var auth = ???


var router = express.Router();

// router.put('/:id', controller.update );
// router.get('/', controller.getAll );

// TODO: validate that reqest is from twilio
router.post('/', controller.create );

module.exports = router;