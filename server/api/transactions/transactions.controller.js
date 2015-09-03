'use strict';

var Transactions = require('./transactions.query.js');
var TransactionsServices = require('./transactions.services.js');
var Gifts = require('../gifts/gifts.query.js');
var Addresses = require('../addresses/addresses.query.js');
var async = require('async');
var _ = require('lodash');
// var inMemoryCache = require('../../services/cache/cache.constructor.js');

// exports.getAll = function(req, res, next) {
//     console.log( 'inside transactions.contoller.sendData' );
//     transactions.getAll( req, res, sendData );
// }
exports.create = function(req, res, next) {
    console.log( 'req.body -------------------------------------------------------- : \n', req.body, '\n' );
    var currentDate = TransactionsServices.createDate();

    //C: Check transaction came in before the 1am of the 5th
    // if( currentDate.day > 5 && currentDate.hour > 1 ) {
    //     TransactionsServices.sendErrorMessage( 'missedOrderWindow', res );
    //     return
    // }
    //C: Check that there are exactly 3 arguments in the req.body and organize the data
    var reqData = TransactionsServices.organizeReqData( req.body.Body );
    if( reqData.errorMessage !== '' ) {
        TransactionsServices.sendErrorMessage( reqData.errorMessage, res );
        return;
    }
    //C: Check format of date and make sure date exsist
    reqData.errorMessage += TransactionsServices.verifyDate( reqData );

    async.waterfall([
        //////////////////////////////////////////////////////////////////////////
        //C: Check if selected giftId is valid
        Gifts.forThisMonth( currentDate.month + '/' + currentDate.year ),
        function(gifts, callback) {
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
        if( err ) {
            //TODO: Log the error and ring the fucking bells!!
            console.log( 'err:', err );
            TransactionsServices.sendErrorMessage( 'generic', res );
        }
        else TransactionsServices.sendSuccessMessage( reqData, res );
    });
}


// exports.update = function(req, res, next) {
//     console.log( 'inside transactions.contoller.create' );
//     transactions.update( req, res, sendData );
// }

function sendData(err, res, data) {
    if(err) res.send(500, {error: err});
    res.send(data);
}