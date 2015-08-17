'use strict';

var Users = require('./users.query.js');


exports.getAll = function(req, res, next) {
    console.log( 'inside users.contoller.sendData' );
    Users.getAll( req, res, sendData );
}

exports.create = function(req, res, next) {
    console.log( 'inside users.contoller.create' );
    Users.create( req, res, sendData );
}

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}