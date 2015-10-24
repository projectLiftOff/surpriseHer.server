'use strict';

var Addresses = require('./addresses.query.js');
var async = require('async');
var log = require('../../config/log.js');

exports.getAll = function(req, res, next) {
    async.waterfall([
        Addresses.getAll ],
        function(error, addresses){
            if (error) {
                log.error('addresses.getAll query failed', {error});
                res.status(400).send( addresses );
                return;
            }
            log.info( 'addresses.getAll query was successful' );
            res.status(200).send( addresses );
        })
    ;
}

exports.create = function(req, res, next) {
    var inserts = req.body.map( function(address){
        return Addresses.create.bind( null, address );
    });

    async.parallel( inserts, function(error, addresses) {
        if (error) {
            log.error('addresses.create query failed', {error});
            res.status(400).send( addresses );
            return;
        }
        log.info('addresses.create query was successful');
        res.status(200).send( addresses );
    });
}

function sendData(error, res, data) { // TODO this function is duplicated by each controller.
  if (error) {
    log.error('addresses sendData failed', {error});
    res.send(500, {error: error});
  } else {
    res.send(data);
  }
}
