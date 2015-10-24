'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();
var log = require('./../../config/log.js')

exports.getAll = function( callback ) {
    connection.query('SELECT * FROM gifts;', function(error, rows, fields) {
        if (error) { log.error('query failed: gifts.getAll', {error}) }
        callback(error, rows);
    });
}

exports.create = function( gift, callback ) {
    connection.query('INSERT INTO gifts SET ?;', gift, function(error, results){
        if (error) { log.error('query failed: gifts.create', {error}) }
        callback(error, results);
    });
}

exports.forThisMonth = function( date, callback ) {
    connection.query({
        sql: 'SELECT * FROM gifts WHERE month_of = ?;',
        values: [date]
    }, function (error, results, fields){
        if (error) { log.error('query failed: gifts.forThisMonth', {error}) }
        callback(error, results);
    });
}
