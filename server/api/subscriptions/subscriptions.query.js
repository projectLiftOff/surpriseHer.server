'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();
var log = require('./../../config/log.js')

exports.getAll = function( callback ) {
    connection.query('SELECT * FROM subscriptions;', function(error, rows, fields) {
        if (error) { log.error('query failed: subscriptions.getAll', {error}) }
        callback( error, rows );
    });
}

exports.create = function( subscription, userInsertResult, callback ) {
    subscription.user_id = userInsertResult.insertId;
    connection.query('INSERT INTO subscriptions SET ?', subscription, function(error, results){
        if (error) { log.error('query failed: subscriptions.create', {error}) }
        callback(error, results);
    });
}

exports.update = function( req, callback ) {
    var values = [ req.body.deposit, Number( req.params.id )];
    connection.query('UPDATE subscriptions SET deposit = ? WHERE subscription_id = ?', values, function(error, results){
        if (error) { log.error('query failed: subscriptions.update', {error}) }
        callback(error, results);
    });
}
