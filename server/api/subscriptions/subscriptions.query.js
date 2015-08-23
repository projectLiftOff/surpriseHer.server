'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();

exports.getAll = function( req, res, sendData ) {
    connection.query('SELECT * FROM subscriptions;', function(err, rows, fields) {
        if (err) sendData( err, res );
        sendData( false, res, rows );
    });
}

exports.create = function( subscription ) { 
    function createSubscription(userInsertResult, callback) {
        subscription.user_id = userInsertResult.insertId;
        connection.query('INSERT INTO subscriptions SET ?', subscription, function(err, results){
            callback(err, results);
        });
    }
    return createSubscription;
}

exports.update = function( req, res, sendData ) { 
    var values = [ req.body.deposit, Number( req.params.id )]; 
    connection.query('UPDATE subscriptions SET deposit = ? WHERE subscription_id = ?', values, function(err, results){
        if (err) sendData( err, res );
        sendData( false, res, results );
    });
}