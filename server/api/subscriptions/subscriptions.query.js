'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();

exports.getAll = function( callback ) {
    connection.query('SELECT * FROM subscriptions;', function(err, rows, fields) {
        callback( err, rows );
    });
}

exports.create = function( subscription, userInsertResult, callback ) { 
    subscription.user_id = userInsertResult.insertId;
    connection.query('INSERT INTO subscriptions SET ?', subscription, function(err, results){
        callback(err, results);
    });
}

exports.update = function( req, callback ) { 
    var values = [ req.body.deposit, Number( req.params.id )]; 
    connection.query('UPDATE subscriptions SET deposit = ? WHERE subscription_id = ?', values, function(err, results){
        callback(err, results);
    });
}
