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
        connection.query('INSERT INTO users SET ?', user, function(err, results){
            callback(err, results);
        });
    }
    return createUser;
}