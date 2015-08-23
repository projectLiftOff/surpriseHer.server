'use strict';

var subscriptions = require('./subscriptions.query.js');


exports.getAll = function(req, res, next) {
    console.log( 'inside subscriptions.contoller.sendData' );
    subscriptions.getAll( req, res, sendData );
}

exports.create = function(req, res, next) {
    console.log( 'inside subscriptions.contoller.create' );
    subscriptions.create( req, res, sendData );
}

exports.update = function(req, res, next) {
    console.log( 'inside subscriptions.contoller.create' );
    subscriptions.update( req, res, sendData );
}

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}