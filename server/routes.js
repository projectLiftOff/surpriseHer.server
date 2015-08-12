'use strict';

module.exports = function( app ){
    app.route( '/users').get(function( req, res ){
        console.log('user was sent');
        res.send( 'You got a user Armando Perez' );
    });

    app.route('/*').get(function( req, res ){
        console.log('hit me!!');
        res.send('you hit me!!');
    });
}