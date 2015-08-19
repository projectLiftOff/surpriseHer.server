'use strict';

var Users = require('./users.query.js');
var Subscriptions = require('../subscriptions/subscriptions.query.js');
var async = require('async');

exports.getAll = function(req, res, next) {
    console.log( 'inside users.contoller.sendData' );
    Users.getAll( req, res, sendData );
}

exports.create = function(req, res, next) {
    var insertFunctios = [ Users.create( req.body.user ), Subscriptions.create( req.body.subscription ) ];
    async.waterfall( insertFunctios, function(err, results){ 
        sendData( err, res, results ) } 
    );
}

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}
