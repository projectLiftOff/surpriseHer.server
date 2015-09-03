'use strict';

var moment = require('moment');
var twilio = require('twilio');
var errorMessageLookUp = {
    noAddress: 'Hmm.. there seems to be a problem with your address.. please contact customer support',
    secondTransaction: 'You have already ordered a gift this month... If you want to change your order or order an additional gift please contact customer support',
    missedOrderWindow: 'Sorry but you missed the order window... but dont worry in about XXX days we are going to have another gift choice!!',
    generic: 'oops.. looks like there was an error please try again or contact customer support: adfkjdf@ask.com or 444444444'
}

exports.organizeReqData = function( dataStr ) {
    var data = {};
    if( !dataStr ) {
        data.errorMessage = 'Please only send the following info: date, gift and address.';
        return data;
    }
    var dataList = dataStr.split(' ');
    data.date = dataList[0];
    data.gift = dataList[1];
    data.address = dataList[2];
    data.giftsOfTheMonth = {};
    data.errorMessage = dataList.length === 3 ? '' : 'Please only send the following info: date, gift and address.';
    return data;
}
exports.verifyDate = function( data ){
    data.date = data.date.trim();
    for( var i = 0; i < data.date.length; i++ ){
        if(  !(/\d/.test( data.date[i] )) ) return ' You have provided an invalide format for the selected date.';
    }
    if( data.date.length > 2 ) return ' You have provided an invalide format for the selected date.';
    var dateStr = moment().get('year') + ' ' + data.date + ' ' + (moment().get('month')+1);
    var date = moment( dateStr, 'YYYY DD MM' );
    if( !date.isValid() ) return ' You have provided an invalid date.';
    return '';
}
exports.createDate = function() {
    var date = {};
    var currentDate = new Date();
    date.day = currentDate.getDate();
    date.hour = currentDate.getHours();
    date.year = currentDate.getFullYear();
    date.month = currentDate.getMonth() + 1;
    return date;
}
exports.sendErrorMessage = function( message, res ) {
    console.log( '---- Inside sendErrorMessage Message: \n', message, '\n' );
    if( !!errorMessageLookUp[message] ) message = errorMessageLookUp[message];
    var twiml = twilio.TwimlResponse();
    twiml.message( message );
    res.set('Content-Type', 'text/xml');
    res.status(400).send( twiml.toString() );
}
exports.sendSuccessMessage = function( reqData, res ) {
    var twiml = twilio.TwimlResponse();
    var message = "You're order of " + reqData.giftsOfTheMonth[ reqData.gift ].gift_name + 
        " has been placed and will be shipped on " + reqData.date + '. if there are any ' + 
        'issues please email us: akjdlfj@kasdjfl.com or call us @ 555555555';
    twiml.message( message );
    res.set('Content-Type', 'text/xml');
    res.status(200).send( twiml.toString() );
}
exports.formatPhoneForQuery = function( phone ) {
    var phoneFormated = '';
    for( var i = 0; i < phone.length; i++ ){
        if( /\d/.test( phone[i] ) ) phoneFormated += phone[i];
    }
    if( phoneFormated.length === 11 ) phoneFormated = phoneFormated.slice(1)
    return Number( phoneFormated );
}
