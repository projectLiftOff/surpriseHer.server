'use strict';

var Users = require('./users.query.js');
var Addresses = require('../addresses/addresses.query.js');
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
        log.info( 'Users.create query was successfull' );
        res.status(200).send( Users );
    });
}

exports.finishRegistration = function(req, res, next) {
    var userId = Number( req.params.id );
    var addressQueryFunctions = req.body.addresses.map( function(address){
        address.user_id = userId;
        return Addresses.create.bind( null, address );
    });

    async.parallel( addressQueryFunctions, function( err, addresses ) {
        if( err ) {
            log.error( 'Users.finishRegistration.Addresses.create query failed' );
            res.status(400).send( addresses );
            return;
        }
        log.info( 'Users.finishRegistration.Addresses.create query was successful' );
        
        req.body.user.registration_complete = 1;
        var userData = [req.body.user, userId];
        var userQueryFunctions = [ Users.update.bind( null, userData ) ];

        async.waterfall( userQueryFunctions, function(err, Users){ 
            if( err ) {
                log.error( 'Users.finishRegistration query failed:', err );
                res.status(400).send( Users );
                return;
            }
            log.info( 'Users.finishRegistration query was successfull' );
            res.status(200).send( Users );
            // TODO: check for pending transactions & complete if found
        });
    });

}

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}
