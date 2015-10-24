'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();
var log = require('./../../config/log.js')

exports.getAll = function( callback ) {
    connection.query('SELECT * FROM users;', function(error, rows, fields) {
        if (error) { log.error('query failed: users.getAll', {error}) }
        callback(error, rows );
    });
}

exports.update = function( data, callback ) {
    connection.query('UPDATE users SET ? WHERE user_id = ?;', data, function(error, results){
        if (error) { log.error('query failed: users.update', {error}) }
        callback(error, results);
    });
}

exports.create = function( user, callback ) {
    connection.query('INSERT INTO users SET ?;', user, function(error, results){
        if (error) { log.error('query failed: users.create', {error}) }
        callback(error, results);
    });
}

exports.availableForGifts = function( callback ) {
    connection.query('SELECT first_name, phone FROM users JOIN subscriptions USING(user_id) JOIN plans USING(plan_id) WHERE gifts > gifts_ordered AND deposit=1;', function(error, results){
        if (error) { log.error('query failed: users.availableForGifts', {error}) }
        callback(error, results);
    });
}

exports.withPhoneNumber = function( date, callback ) {
    connection.query('SELECT * FROM users WHERE phone = ?;', date, function (error, results, fields){
        if (error) { log.error('query failed: users.withPhoneNumber', {error}) }
        callback(error, results);
    });
}
