'use strict';
var Users = require('../../api/users/users.query.js');
var Gifts = require('../../api/gifts/gifts.query.js');
var TxtMessenger = require('../twilio/twilio.main.js');
var async = require('async');
var log = require('../../config/winstonLogger.js');
// C: initate interval

function monthlyScheduler() {
    // C: Get current dateTime
    var currentDate = new Date();
    var currentDay = currentDate.getDate();
    var currentHour = currentDate.getHours();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth() + 1;
    // C: if dateTime === 1st && 11am || 12pm
    if( currentDay === 1 && (currentHour === 11 || currentHour === 12 ) ) {
    // if( 1 ) {
        log.info('Beginning of the month has triggered mas-text of gifts');
        // C: Get all users [first_name, phone] WHERE deposit === 1 && gifts_ordered < gifts (join users, plans, subscriptions)
        // C: Get avalible gift options: select * from gifts where month/year === CURRENTMONTH/CURRENTYEAR
        var dateForGiftLookUp = currentMonth + '/' + currentYear;
        var functions = [ Users.availableForGifts, Gifts.forThisMonth.bind( null, dateForGiftLookUp ) ];
        async.parallel( functions, function(err, results){ 
            if( err ) log.error( 'Query of Users and or Gifts for blast txt has faild:' , err );
            var users = results[0];
            var gifts = results[1];
            
            if( gifts.length === 0 ) {
                log.error( 'Gift query found no gifts' );
                return;
            }
            if( users.length === 0 ) log.error( 'Users query found no Users' );
            // C: Setup cached Gifts

            // C: Construct Txt Message && Send Text Message to all users
            sendTxtMessages( users, gifts, currentMonth );
        });
        
    }
}

function sendTxtMessages( users, gifts, month ){
    var usersMessages = [];
    users.forEach(function( user ){
        var message = constuctAvalibleGiftsMessages( user, gifts, month );
        log.info( 'Before sending the following message to the following user:', {user: user, message: message} );
        TxtMessenger.send( user.phone, '4152148005', message, 0 );
    });
}
function constuctAvalibleGiftsMessages( user, gifts, month ){ 
    var message = 'Hello '+ user.first_name +'! \n' +
        'Just reminding you to do something for your special someone! ' +
        'Here is our curated gift selection for this month: \n \n' + 
        constructGiftOptionsStr( gifts ) + 'PRDUCT URL' + '\n \n' +
        "txt back the gift code and the day in month you'd like us to ship " +
        '(e.g 3/'+month+' '+ gifts[0].look_up + gifts[0].gift_id +', 18/'+ month + 
        ' '+ gifts[1].look_up + gifts[1].gift_id +')';
    
    return message;
}
function constructGiftOptionsStr( gifts ){
    var str = '';
    gifts.forEach(function(gift){
        str += gift.gift_name + ', code: ' + gift.look_up + gift.gift_id + '\n';
    });
    return str;
}

exports.monthlyScheduler = monthlyScheduler;