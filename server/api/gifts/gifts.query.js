'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();

exports.getAll = function( callback ) {
    connection.query('SELECT * FROM gifts;', function(err, rows, fields) {
        callback(err, rows);
    });
}

exports.create = function( gift, callback ) {
    connection.query('INSERT INTO gifts SET ?;', gift, function(err, results){
        callback(err, results);
    });
}

exports.forThisMonth = function( date, callback ) {
    connection.query({
        sql: 'SELECT * FROM gifts WHERE month_of = ?;', 
        values: [date]
    }, function (err, results, fields){
        callback(err, results);
    });
}
