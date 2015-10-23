'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();

exports.getAll = function( callback ) {
    connection.query('SELECT * FROM users;', function(err, rows, fields) {
        callback( err, rows );
    });
}

exports.update = function( data, callback ) {
    connection.query('UPDATE users SET ? WHERE user_id = ?;', data, function(err, results){
        callback(err, results);
    });
}

exports.create = function( user, callback ) {
    connection.query('INSERT INTO users SET ?;', user, function(err, results){
        callback(err, results);
    });
}

exports.availableForGifts = function( callback ) {
    connection.query('SELECT first_name, phone FROM users JOIN subscriptions USING(user_id) JOIN plans USING(plan_id) WHERE gifts > gifts_ordered AND deposit=1;', function(err, results){
        callback(err, results);
    });
}

exports.withPhoneNumber = function( date, callback ) {
    connection.query('SELECT * FROM users WHERE phone = ?;', date, function (err, results, fields){
        callback(err, results);
    });
}
