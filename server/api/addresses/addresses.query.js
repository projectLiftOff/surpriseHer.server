'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();
var async = require('async');

exports.getAll = function( req, res, sendData ) {
    connection.query('SELECT * FROM addresses;', function(err, rows, fields) {
      if (err) sendData( err, res );
      sendData( false, res, rows );
    });
}

exports.create = function( req, res, sendData ) { 
    var inserts = req.body.map( function(address){  
        var insertOne = function(callback) {
            connection.query('INSERT INTO addresses SET ?', address, function(err, results){
                callback(err, results);
            });
        }
        return insertOne;
    });
    async.parallel( inserts, function( err, results ) {
        sendData( err, res, results );
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