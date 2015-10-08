// TODO: Set as env variables
// Q: How the hell do I set up a process.ENV ????
var client = require('twilio')();
var log = require('../../config/winstonLogger.js');

exports.send = send;

function send( to, from, body, attempts ) {
    client.sendMessage({
        to: '+1' + to,
        from: '+1' + from,
        body: body
    }, function( err, data ){
        if( err ) {
            // C: Retry sending
            if( attempts < 3 ) {
                attempts++;
                send( to, from, body, attempts );
            }
            else log.error( 'Sending Monthly Options text using twilio falied', {to: to, from: from, message: body, resendAttempts: attempts} );
        }
        else {
            // TODO: log successful message sent in db
            log.info( 'Monthly Options text message was sent successfuly', {to: to, from: from, message: body, resendAttempts: attempts} )
        }
    });
}
