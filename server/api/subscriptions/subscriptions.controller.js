'use strict';

var Subscriptions = require('./subscriptions.query.js');
var async = require('async');
var log = require('../../config/winstonLogger.js');

exports.getAll = function(req, res, next) {
    async.waterfall([
        Subscriptions.getAll ], 
        function( err, subscriptions ){
            if( err ) {
                log.error( 'subscriptions.getAll query failed' );
                res.status(400).send( subscriptions );
                return;
            }
            log.info( 'subscriptions.getAll query was successfull' );
            res.status(200).send( subscriptions );
        })
    ;
}

exports.create = function(req, res, next) {
    async.waterfall([
        Subscriptions.create.bind( null, req.body.subscription ) ], 
        function( err, subscriptions ){
            if( err ) {
                log.error( 'subscriptions.create query failed' );
                res.status(400).send( subscriptions );
                return;
            }
            log.info( 'subscriptions.create query was successfull' );
            res.status(200).send( subscriptions );
        })
    ;
}

exports.update = function(req, res, next) {
    // TODO: validate req
    async.waterfall([
        Subscriptions.update.bind( null, req ) ], 
        function( err, subscriptions ){
            if( err ) {
                log.error( 'subscriptions.update query failed' );
                res.status(400).send( subscriptions );
                return;
            }
            log.info( 'subscriptions.update query was successfull' );
            res.status(200).send( subscriptions );
        })
    ;
}

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}