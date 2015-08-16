'use strict';
var connectToDB = require('./config/dbConnection');
var connection = connectToDB();
module.exports = routes;
function routes( app ){
    app.route( '/users' ).get(function( req, res ){
        console.log('users end point was hit');
        connection.query('SELECT * FROM users;', function(err, rows, fields) {
          if (err) throw err;
          console.log('rows and fields: ', rows );
          res.send( rows );
        });
    });

    app.route('/*').get(function( req, res ){
        console.log('hit me!!');
        res.send('you hit me!!');
    });
}