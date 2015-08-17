'use strict';

var Addresses = require('./addresses.query.js');


exports.getAll = function(req, res, next) {
    console.log( 'inside addresses.contoller.sendData' );
    Addresses.getAll( req, res, sendData );
}

exports.create = function(req, res, next) {
    console.log( 'inside addresses.contoller.create' );
    Addresses.create( req, res, sendData );
}

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}