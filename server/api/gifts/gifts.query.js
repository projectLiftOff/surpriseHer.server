'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();

exports.getAll = function( req, res, sendData ) {
    connection.query('SELECT * FROM gifts;', function(err, rows, fields) {
        if (err) sendData( err, res );
        sendData( false, res, rows );
    });
}

exports.create = function( user ) {
    function createGifts(callback) {
        connection.query('INSERT INTO gifts SET ?;', user, function(err, results){
            callback(err, results);
        });
    }
    return createGifts;
}

exports.forThisMonth = function( date ) {
    function getGifts(callback) {
        connection.query({ 
            sql: 'SELECT * FROM gifts WHERE month_of = ?;', 
            values: [date]
        }, function (err, results, fields){
            callback(err, results);
        });
    }
    return getGifts;
}