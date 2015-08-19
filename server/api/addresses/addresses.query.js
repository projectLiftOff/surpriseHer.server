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