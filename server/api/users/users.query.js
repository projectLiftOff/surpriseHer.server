'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();

exports.getAll = function( req, res, sendData ) {
    connection.query('SELECT * FROM users;', function(err, rows, fields) {
        if (err) sendData( err, res );
        sendData( false, res, rows );
    });
}

exports.create = function( user ) {
    function createUser(callback) {
        connection.query('INSERT INTO users SET ?;', user, function(err, results){
            callback(err, results);
        });
    }
    return createUser;
}

exports.availableForGifts = function( callback ) {
    connection.query('SELECT first_name, phone FROM users JOIN subscriptions USING(user_id) JOIN plans USING(plan_id) WHERE gifts > gifts_ordered AND deposit=1;', function(err, results){
        callback(err, results);
    });
}