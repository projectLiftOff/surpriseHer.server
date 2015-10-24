'use strict';

var Subscriptions = require('./subscriptions.query.js');
var async = require('async');
var log = require('../../config/log.js');

exports.getAll = function(req, res, next) {
    async.waterfall([
        Subscriptions.getAll ],
        function( error, subscriptions ){
            if (error) {
                log.error('subscriptions.getAll query failed', {error});
                res.status(400).send( subscriptions );
                return;
            }
            log.info('subscriptions.getAll query was successful');
            res.status(200).send( subscriptions );
        })
    ;
}

exports.create = function(req, res, next) {
    async.waterfall([
        Subscriptions.create.bind( null, req.body.subscription ) ],
        function( error, subscriptions ){
            if (error) {
                log.error('subscriptions.create query failed', {error});
                res.status(400).send( subscriptions );
                return;
            }
            log.info('subscriptions.create query was successful');
            res.status(200).send( subscriptions );
        })
    ;
}

exports.update = function(req, res, next) {
    // TODO: validate req
    async.waterfall([
        Subscriptions.update.bind( null, req ) ],
        function(error, subscriptions ){
            if (error) {
                log.error('subscriptions.update query failed', {error});
                res.status(400).send( subscriptions );
                return;
            }
            log.info('subscriptions.update query was successful');
            res.status(200).send( subscriptions );
        })
    ;
}

function sendData(error, res, data) {
  if (error) {
    log.error('subscriptions controller sendData failed', {error});
    res.send(500, {error: error});
  } else {
    res.send(data);
  }
}
