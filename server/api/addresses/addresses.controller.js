'use strict';

var Addresses = require('./addresses.query.js');
var async = require('async');
var log = require('../../config/winstonLogger.js');

exports.getAll = function(req, res, next) {
    async.waterfall([
        Addresses.getAll ], 
        function( err, addresses ){
            if( err ) {
                log.error( 'addresses.getAll query failed' );
                res.status(400).send( addresses );
                return;
            }
            log.info( 'addresses.getAll query was successfull' );
            res.status(200).send( addresses );
        })
    ;
}

exports.create = function(req, res, next) {
    var inserts = req.body.map( function(address){  
        return Addresses.create.bind( null, address );
    });

    async.parallel( inserts, function( err, addresses ) {
        if( err ) {
            log.error( 'addresses.create query failed' );
            res.status(400).send( addresses );
            return;
        }
        log.info( 'addresses.create query was successfull' );
        res.status(200).send( addresses );
    });
}

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}