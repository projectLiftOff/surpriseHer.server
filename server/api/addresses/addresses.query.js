'use strict';
var connectToDB = require('../../config/dbConnection');
var connection = connectToDB();

exports.getAll = function( req, res, sendData ) {
    connection.query('SELECT * FROM addresses;', function(err, rows, fields) {
      if (err) sendData( err, res );
      sendData( false, res, rows );
    });
}

exports.create = function( req, res, sendData ) {
    connection.query('INSERT INTO addresses SET ?', req.body, function(err, results){
        if (err) sendData( err, res );
        sendData( false, res, results );
    });
}

// exports.create = function( req, res, sendData ) {
//     var listOfAddresses = req.body;
//     var numOfAddresses = listOfAddresses.length;
//     insertAddress( listOfAddresses.pop(), 1 )

//     function insertAddress( address, addressInsert ) {
//         connection.query('INSERT INTO addresses SET ?', address, function(err, results){
//             if( addressInsert <= numOfAddresses ) insertAddress( listOfAddresses.pop(), ++addressInsert  );
//             else {
//                 if (err) sendData( err, res );
//                 sendData( false, res, results );
//             }
//         });
//     }
// }