'use strict';

var Users = require('./users.query.js');
var Subscriptions = require('../subscriptions/subscriptions.query.js');
var async = require('async');
var log = require('../../config/winstonLogger.js');

exports.getAll = function(req, res, next) {
    async.waterfall([
        Users.getAll ], 
        function( err, Users ){
            if( err ) {
                log.error( 'Users.getAll query failed', {error: err} );
                res.status(400).send( err );
                return;
            }
            log.info( 'Users.getAll query was successful' );
            res.status(200).send( Users );
        })
    ;
}

exports.create = function(req, res, next) {
    // Create User
    req.body.registration_complete = 0;
    var queryFunctions = [ 
        Users.create.bind( null, req.body )
    ];
    async.waterfall( queryFunctions, function(err, Users){ 
        if( err ) {
            log.error( 'Users.create query failed' );
            res.status(400).send( Users );
            return;
        }
        log.info( 'Users.create query was successful' );
        res.status(200).send( Users );
    });
}

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}