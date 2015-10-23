'use strict';

var Transactions = require('./transactions.query.js');
var TransactionsServices = require('./transactions.services.js');
var Gifts = require('../gifts/gifts.query.js');
var Addresses = require('../addresses/addresses.query.js');
var Users = require('../users/users.query.js');
var async = require('async');
var log = require('../../config/winstonLogger.js');
var _ = require('lodash');
// var inMemoryCache = require('../../services/cache/cache.constructor.js');

exports.getAll = function(req, res, next) {
    transactions.getAll( req, res, sendData );
}
exports.create = function(req, res, next) {
    console.log( 'req.body -------------------------------------------------------- : \n', req.body, '\n' );
    var currentDate = TransactionsServices.createDate();

    //C: Check transaction came in before the 1am of the 5th of the month
    // if( currentDate.day > 5 && currentDate.hour > 1 ) {
    //     log.error('Transactions.create controller faild: Missed order window', req.body.Body);
    //     TransactionsServices.sendErrorMessage( 'missedOrderWindow', res );
    //     return;
    // }
    var phoneNumber = TransactionsServices.formatPhoneForQuery( req.body.From );
    async.waterfall([ Users.withPhoneNumber.bind( null, phoneNumber ) ], function(err, users){
        // TODO: handle error

        ////////////////////////////////////////////////////////////////////////// 
        // C: If User is fully registered 
        var _user = users.pop()
        if( !!_user.registration_complete ) {
            //C: Check that there are exactly 3 arguments in the req.body and organize the data
            var reqData = TransactionsServices.organizeDataCR( req.body.Body );
            if( reqData.errorMessage !== '' ) {
                TransactionsServices.sendErrorMessage( reqData.errorMessage, res );
                return;
            }
            //C: Check format of date and make sure date exsist
            reqData.errorMessage += TransactionsServices.verifyDate( reqData );

            async.waterfall([
                //////////////////////////////////////////////////////////////////////////
                //C: Check if selected giftId is valid
                Gifts.forThisMonth.bind(null, currentDate.month + '/' + currentDate.year),
                function(gifts, callback) {
                    // TODO: Also hadle 'first txt' gift options that are always offered
                    gifts.forEach(function(gift){
                        var lookupId = gift.look_up + gift.gift_id;
                        reqData.giftsOfTheMonth[ lookupId ] = gift;
                    });
                    if( !!reqData.giftsOfTheMonth[ reqData.gift ] ) reqData.selectedGiftInfo = reqData.giftsOfTheMonth[ reqData.gift ];
                    else reqData.errorMessage += ' Gift Id format is incorrect';
                //////////////////////////////////////////////////////////////////////////
                //C: Check if address is valid
                    var userPhone = TransactionsServices.formatPhoneForQuery( req.body.From );
                    callback(null, userPhone);
                },
                Addresses.ofUserWithPhone,
                function( results, callback ) {
                    if( results.length === 0 ) {
                        TransactionsServices.sendErrorMessage( 'noAddress', res );
                        return;
                    }
                    var userAddressesLookUp = {};
                    results.forEach(function(address){
                        userAddressesLookUp[ address.nick_name ] = address;
                    });
                    var giftIds = _.map( reqData.giftsOfTheMonth, function(gift) {
                        return gift.gift_id;
                    });
                    if( !userAddressesLookUp[ reqData.address ] ){
                        reqData.errorMessage += ' Address nick name is incorrect';
                        TransactionsServices.sendErrorMessage( reqData.errorMessage, res );
                        return;
                    }
                //////////////////////////////////////////////////////////////////////////
                //C: Check if user has already ordred a gift this month 
                    callback( null, userAddressesLookUp[ reqData.address ].user_id, giftIds);
                },
                Transactions.forUserWithGiftIds,
                function( transactions, userId, callback ) {
                    if( transactions.length !== 0 || reqData.errorMessage !== '' ) {
                        if(transactions.length !== 0) TransactionsServices.sendErrorMessage( 'secondTransaction', res );
                        else TransactionsServices.sendErrorMessage( reqData.errorMessage, res );
                        return;
                    }
                //////////////////////////////////////////////////////////////////////////
                //C: Save transaction        
                    else {
                        var transactionCreationData = { user_id: userId, gift_id: reqData.selectedGiftInfo.gift_id };
                        callback( null, transactionCreationData);
                    }
                },
                Transactions.create
            ], function (err, result) {
                //TODO: Charge for the gift 
                if( err ) {
                    //TODO: Log the error and ring the fucking bells!!
                    console.log( 'err:', err );
                    TransactionsServices.sendErrorMessage( 'generic', res );
                }
                else TransactionsServices.sendSuccessMessageCR( reqData, res );
            });
        }
        ////////////////////////////////////////////////////////////////////////// 
        // C: If User is NOT fully registered 
        else {
            // C: Check that there are exactly 2 arguments (date, giftId) in the req.body and organize the data
            var reqData = TransactionsServices.organizeDataIR( req.body.Body );
            if( reqData.errorMessage !== '' ) {
                TransactionsServices.sendErrorMessage( reqData.errorMessage, res );
                return;
            }
            async.waterfall([
                //////////////////////////////////////////////////////////////////////////
                //C: Check if selected giftId is valid
                Gifts.forThisMonth.bind(null, currentDate.month + '/' + currentDate.year),
                function(gifts, callback) {
                    // TODO: Also hadle 'first txt' gift options that are always offered
                    gifts.forEach(function(gift){
                        var lookupId = gift.look_up + gift.gift_id;
                        reqData.giftsOfTheMonth[ lookupId ] = gift;
                    });
                    if( !!reqData.giftsOfTheMonth[ reqData.gift ] ) reqData.selectedGiftInfo = reqData.giftsOfTheMonth[ reqData.gift ];
                    else {
                        reqData.errorMessage += ' Gift Id format is incorrect';
                        TransactionsServices.sendErrorMessage( reqData.errorMessage, res );
                        return;
                    }
                
                //////////////////////////////////////////////////////////////////////////
                //C: Create transaction with pending status
                    var transactionCreationData = { 
                        user_id: _user.user_id, 
                        gift_id: reqData.selectedGiftInfo.gift_id, 
                        status: 'pendingUserRegistration', 
                        paid: 0 
                    };
                    callback( null, transactionCreationData);
                },
                Transactions.create
                // C: Check if user has already tried to order a gift but didn't finish registration
                // Check if user already has a transaction with pending status
                // if true send register link again
                // NOTE: handle above situation in the registration endpoint by only completing the most recent transaction
            ], function (err, result) {
                reqData.userId = _user.user_id;
                if( err ) {
                    //TODO: Log the error and ring the fucking bells!!
                    console.log( 'err:', err );
                    TransactionsServices.sendErrorMessage( 'generic', res );
                }
                // TODO: Construct link to signup page with query param that contains userId, (maybe giftLookUp)
                else TransactionsServices.sendSuccessMessageIR( reqData, res );
            });            
        }
    });
}


// exports.update = function(req, res, next) {
//     console.log( 'inside transactions.contoller.create' );
//     transactions.update( req, res, sendData );
// }
