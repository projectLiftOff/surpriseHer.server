'use strict';

var Users = require('./users.query.js');
var Addresses = require('../addresses/addresses.query.js');
var Transactions = require('../transactions/transactions.query.js');
var async = require('async');
var log = require('../../config/log.js');

exports.getAll = function(req, res, next) {
    async.waterfall([
        Users.getAll ],
        function( error, Users ){
            if( error ) {
                log.error( 'Users.getAll query failed', {error} );
                res.status(400).send(error);
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
    async.waterfall( queryFunctions, function(error, Users){
        if( error ) {
            log.error( 'Users.create query failed', {error} );
            res.status(400).send( Users );
            return;
        }
        // TODO: Send user first txt message with first gift options
        log.info( 'Users.create query was successfull' );
        res.status(200).send( Users );
    });
}

exports.finishRegistration = function(req, res, next) {
    // TODO: this is an open api so ability to protect against re-updateing and update
    //          data that is not the customers
    // TODO: handle customer who waits a month before registering
    // TODO: data validation

    var userId = Number( req.params.id );
    // C: Prepare addresses
    var addressQueryFunctions = req.body.addresses.map( function(address){
        address.user_id = userId;
        return Addresses.create.bind( null, address );
    });
    // C: Save all addresses to DB
    async.parallel( addressQueryFunctions, function( error, addresses ) {
        if (error) {
            log.error('Users.finishRegistration.Addresses.create query failed', {error});
            res.status(500).send(addresses);
            return;
        }
        log.info('Users.finishRegistration.Addresses.create query was successful');

        // C: Prepare user data
        req.body.user.registration_complete = 1;
        var userData = [req.body.user, userId];
        var userQueryFunctions = [
            Users.update.bind( null, userData ),
            function( results, callback ){
                callback( null, userId );
            },
            Transactions.pendingUserRegistration
        ];

        // C: Save all user data and query for pending transaction of user
        async.waterfall( userQueryFunctions, function(error, pendingTransaction){
            // log.debug('pendingTransaction:', {pendingTransaction});
            if (error) {
                log.error( 'Users.finishRegistration query failed:', {error} );
                res.status(500);
                return;
            }
            else if( pendingTransaction.length === 0 ) {
                log.info( 'Users.finishRegistration query was successfull and no pendingTransaction found' );
                res.status(200).send( {registration: true, transaction: false} );
            }
            else if( pendingTransaction.length > 0 ) {
                // TODO: handle multiple pendingTransactions
                // TODO: charge amount....  charge was successful!
                // C: update transaction status, and address
                var data = [req.body.transaction.shipToAddressCode, userId]
                // log.debug({data});
                async.waterfall( [Addresses.ofUserAndCode.bind(null, data)], function(error, addresses){
                    // log.debug({addresses});
                    if (error) {
                        log.error( 'Users.finishRegistration - Addresses.ofUserAndCode query failed:', {error} );
                        res.status(500);
                        return;
                    }

                    var data = [{status: 'unfulfilled', paid: 1}, addresses[0].address_id];
                    async.waterfall( [ Transactions.update.bind(null, data)], function(error, transaction){
                        if (error) {
                            log.error( 'Users.finishRegistration - Transactions.update query failed', {error} );
                            res.status(400).send( Users );
                            return;
                        }
                        log.info( 'Users.finishRegistration & Transactions.update query was successfull' );
                        res.status(200).send( {registration: true, transaction: true} );
                    });
                });
            }
        });
    });
}

function sendData(error, res, data) {
  if (error) {
    res.send(500, {error});
  } else {
    res.send(data);
  }
}
