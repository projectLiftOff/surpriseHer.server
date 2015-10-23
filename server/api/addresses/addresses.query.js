'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();

exports.getAll = function( callback ) {
    connection.query('SELECT * FROM addresses;', function(err, rows, fields) {
        callback(err, rows);
    });
}

exports.create = function( address, callback ) { 
    connection.query('INSERT INTO addresses SET ?', address, function(err, results){
        callback(err, results);
    });
}

exports.ofUserWithPhone = function( phone, callback ){
    connection.query({ 
        sql: 'SELECT nick_name, user_id FROM addresses JOIN users USING(user_id) WHERE phone = ?;', 
        values: [phone]
    }, function (err, results, fields){
        callback(err, results);
    });
}

exports.ofUserAndCode = function( data, callback ){
    connection.query( 'SELECT address_id FROM addresses WHERE code_name = ? AND user_id = ?;', data, function (err, results, fields){
        callback(err, results);
    });
}
