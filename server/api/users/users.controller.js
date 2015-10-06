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
            log.info( 'Users.getAll query was successfull' );
            res.status(200).send( Users );
        })
    ;
}

exports.create = function(req, res, next) {
    // Validate user
    var insertFunctions = [ 
        Users.create.bind( null, req.body.user ), 
        Subscriptions.create.bind( null, req.body.subscription ) 
    ];
    async.waterfall( insertFunctions, function(err, Users){ 
        if( err ) {
            log.error( 'Users.create query failed' );
            res.status(400).send( Users );
            return;
        }
        log.info( 'Users.create query was successfull' );
        res.status(200).send( Users );
    });
}

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}