'use strict';

var moment = require('moment');
var twilio = require('twilio');
var log = require('./../../config/log.js')
var errorMessageLookUp = {
    noAddress: 'Hmm.. there seems to be a problem with your address.. please contact customer support',
    secondTransaction: 'You have already ordered a gift this month... If you want to change your order or order an additional gift please contact customer support',
    missedOrderWindow: 'Sorry but you missed the order window... but dont worry in about XXX days we are going to have another gift choice!!',
    generic: 'oops.. looks like there was an error please try again or contact customer support: adfkjdf@ask.com or 444444444'
}

exports.organizeDataCR = function( dataStr ) {
    var data = {};
    if( !dataStr ) {
        data.errorMessage = 'Please send the following info: date, gift and address';
        log.error('empty user response to organizeDataCR', {dataList})
        return data;
    }
    var dataList = dataStr.split(' ');
    data.date = dataList[0];
    data.gift = dataList[1];
    data.address = dataList[2];
    data.giftsOfTheMonth = {};
    if (dataList.length !== 3) {
      data.errorMessage = 'Please only send the following info: date, gift and address.'
      log.error('malformed user response to organizeDataCR', {dataList})
    }
    return data;
}
exports.organizeDataIR = function( dataStr ) {
    var data = {};
    if( !dataStr ) {
        data.errorMessage = 'Please send the following info: date, gift';
        log.error('empty user response to organizeDataIR', {dataList})
        return data;
    }
    var dataList = dataStr.split(' ');
    data.date = dataList[0];
    data.gift = dataList[1];
    data.giftsOfTheMonth = {};
    if (dataList.length !== 2) {
      data.errorMessage = 'Please only send the following info: date, gift.'
      log.error('malformed user response to organizeDataIR', {dataList})
    }
    return data;
}
exports.verifyDate = function( data ){
    data.date = data.date.trim();
    for( var i = 0; i < data.date.length; i++ ){
        if(  !(/\d/.test( data.date[i] )) ) return ' You have provided an invalid format for the selected date.';
    }
    if( data.date.length > 2 ) return ' You have provided an invalid format for the selected date.';
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
    log.debug( '---- Inside sendErrorMessage Message: \n', message, '\n' );
    if (!!errorMessageLookUp[message]) {
      message = errorMessageLookUp[message];
    } else {
      log.error('error message lookup failed', {message})
    }
    var twiml = twilio.TwimlResponse();
    twiml.message( message );
    res.set('Content-Type', 'text/xml');
    res.status(400).send( twiml.toString() );
}
exports.sendSuccessMessageCR = function( reqData, res ) {
    var twiml = twilio.TwimlResponse();
    var message = "You're order of " + reqData.giftsOfTheMonth[ reqData.gift ].gift_name +
        " has been placed and will be shipped on " + reqData.date + '. if there are any ' +
        'issues please email us: akjdlfj@kasdjfl.com or call us @ 555555555';
    twiml.message( message );
    res.set('Content-Type', 'text/xml');
    res.status(200).send( twiml.toString() );
}

exports.sendSuccessMessageIR = function( reqData, res ) {
    var twiml = twilio.TwimlResponse();
    var message = "You're order of " + reqData.giftsOfTheMonth[ reqData.gift ].gift_name +
        " has been placed!  To finish up the process please complete your registration and provide a " +
        "billing option by clicking on the following link: _URL_?uId="+ reqData.userId + "&giftId=" +reqData.giftsOfTheMonth[ reqData.gift ].gift_id;
    // twiml.message( message );
    // res.set('Content-Type', 'text/xml');
    // res.status(200).send( twiml.toString() );
    res.status(200).send( message );
}
exports.formatPhoneForQuery = function( phone ) {
    var phoneFormated = '';
    for( var i = 0; i < phone.length; i++ ){
        if( /\d/.test( phone[i] ) ) phoneFormated += phone[i];
    }
    if( phoneFormated.length === 11 ) phoneFormated = phoneFormated.slice(1)
    if (phoneFormated.length !== 10) {
      log.error('phone formatting failed', {phone, phoneFormated})
    }
    return Number( phoneFormated );
}
