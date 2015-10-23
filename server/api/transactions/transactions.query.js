'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();
var log = require('./../../config/log.js')

exports.create = function( data, callback ) {
    connection.query('INSERT INTO transactions SET ?', data, function(error, results){
        if (error) { log.error('query failed: transactions.create', {error}) }
        callback(error, results);
    });
}

exports.forUserWithGiftIds = function( userId, giftIds, callback ) {
    var values = giftIds;
    values.unshift( userId );
    connection.query({
        sql: 'SELECT * FROM transactions WHERE user_id = ? AND gift_id = ? OR gift_id = ? OR gift_id = ?;',
        values: values
    }, function (error, results, fields){
        if (error) { log.error('query failed: transactions.forUserWithGiftIds', {error}) }
        callback(error, results, userId);
    });
}

exports.pendingUserRegistration = function( userId, callback ) {
    var values = [userId];
    connection.query( 'SELECT * FROM transactions WHERE status = "pendingUserRegistration" AND user_id = ?;', values, function (error, results, fields){
        if (error) { log.error('query failed: transactions.pendingUserRegistration', {error}) }
        callback(error, results);
    });
}

exports.update = function( data, callback ) {
    connection.query('UPDATE transactions SET ? WHERE transactions_id = ?;', data, function(error, results){
        if (error) { log.error('query failed: transactions.update', {error}) }
        callback(error, results);
    });
}
