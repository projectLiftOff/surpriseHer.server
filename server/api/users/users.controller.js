'use strict';

var Users = require('./users.query.js');
var Addresses = require('../addresses/addresses.query.js');
var Transactions = require('../transactions/transactions.query.js');
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
            log.error( 'Users.create query failed', err );
            res.status(400).send( Users );
            return;
        }
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
    async.parallel( addressQueryFunctions, function( err, addresses ) {
        if( err ) {
            log.error( 'Users.finishRegistration.Addresses.create query failed' );
            res.status(500).send( addresses );
            return;
        }
        log.info( 'Users.finishRegistration.Addresses.create query was successful' );
        
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
        async.waterfall( userQueryFunctions, function(err, pendingTransaction){ 
            // console.log( 'pendingTransaction:', pendingTransaction );
            if( err ) {
                log.error( 'Users.finishRegistration query failed:', err );
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
                // update transaction status, and address
                var data = [req.body.transaction.shipToAddressCode, userId]
                // console.log( 'data', data );
                async.waterfall( [Addresses.ofUserAndCode.bind(null, data)], function(err, addresses){
                    // console.log( 'addresses', addresses);
                    if( err ) {
                        log.error( 'Users.finishRegistration - Addresses.ofUserAndCode query failed:', err );
                        res.status(500);
                        return;
                    }

                    var data = [{status: 'unfulfilled', paid: 1}, addresses[0].address_id];
                    async.waterfall( [ Transactions.update.bind(null, data)], function(err, transaction){
                        if( err ) {
                            log.error( 'Users.finishRegistration - Transactions.update query failed', err );
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

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}
