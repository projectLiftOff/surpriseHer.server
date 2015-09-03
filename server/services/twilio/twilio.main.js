// TODO: Set as env variables
// Q: How the hell do I set up a process.ENV ????
var client = require('twilio')('', '');

exports.send = send;

function send( to, from, body, callback ) {
    console.log('twilio send function')
    client.sendMessage({
        to: '+1' + to,
        from: '+1' + from,
        body: body
    }, function( err, data ){
        if(err) {
            // TODO: Log all the data related to the fail: to, from, body
            //      Maybe retry logic???
            console.log( 'err', err);
        }
        else {
            // TODO: log successful message sent in db
            // Q: How should I log / track this data
            console.log( 'data', data);
        }
    });
}