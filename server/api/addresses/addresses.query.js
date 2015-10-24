'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();
var log = require('./../../config/log.js')

exports.getAll = function( callback ) {
    connection.query('SELECT * FROM addresses;', function(error, rows, fields) {
        if (error) { log.error('query failed: addresses.getAll', {error}) }
        callback(error, rows);
    });
}

exports.create = function( address, callback ) {
    connection.query('INSERT INTO addresses SET ?', address, function(error, results){
        if (error) { log.error('query failed: addresses.create', {error}) }
        callback(error, results);
    });
}

exports.ofUserWithPhone = function( phone, callback ){
    connection.query({
        sql: 'SELECT nick_name, user_id FROM addresses JOIN users USING(user_id) WHERE phone = ?;',
        values: [phone]
    }, function (error, results, fields){
        if (error) { log.error('query failed: addresses.ofUserWithPhone', {error}) }
        callback(error, results);
    });
}

exports.ofUserAndCode = function( data, callback ){
    connection.query( 'SELECT address_id FROM addresses WHERE code_name = ? AND user_id = ?;', data, function (error, results, fields){
        if (error) { log.error('query failed: addresses.ofUserAndCode', {error}) }
        callback(error, results);
    });
}
