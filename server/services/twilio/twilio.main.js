var client = require('twilio')(process.env.twilio_account_sid, process.env.twilio_auth_token);
var log = require('../../config/log.js');

exports.send = send;

function send( to, from, body, attempts ) {
    client.sendMessage({
        to: '+1' + to,
        from: '+1' + from,
        body: body
    }, function( error, data ){
        if (error) {
            log.error('Sending Monthly Options text using twilio falied', {error}, {to, from, message: body, resendAttempts: attempts} );

            // C: Retry sending
            if( attempts < 3 ) {
                attempts++;
                send( to, from, body, attempts );
            }
        }
        else {
            // TODO: log successful message sent in db
            log.info( 'Monthly Options text message was sent successfuly', {to, from, message: body, resendAttempts: attempts} )
        }
    });
}
