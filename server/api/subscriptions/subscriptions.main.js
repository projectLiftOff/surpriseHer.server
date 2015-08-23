'use strict';

var express = require('express');
var controller = require('./subscriptions.controller');
// var auth = ???

var router = express.Router();

router.put('/:id', controller.update );
router.get('/', controller.getAll );
// router.post('/', controller.create );

module.exports = router;