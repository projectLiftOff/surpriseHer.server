'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();

exports.create = function( data, callback ) { 
    connection.query('INSERT INTO transactions SET ?', data, function(err, results){
        callback(err, results);
    });
}

exports.forUserWithGiftIds = function( userId, giftIds, callback ) {
    var values = giftIds;
    values.unshift( userId );
    connection.query({ 
        sql: 'SELECT * FROM transactions WHERE user_id = ? AND gift_id = ? OR gift_id = ? OR gift_id = ?;', 
        values: values
    }, function (err, results, fields){
        callback(err, results, userId);
    });
}

exports.pendingUserRegistration = function( userId, callback ) {
    var values = [userId];
    connection.query( 'SELECT * FROM transactions WHERE status = "pendingUserRegistration" AND user_id = ?;', values, function (err, results, fields){
        callback(err, results);
    });
}

exports.update = function( data, callback ) {
    connection.query('UPDATE transactions SET ? WHERE transactions_id = ?;', data, function(err, results){
        callback(err, results);
    });
}
