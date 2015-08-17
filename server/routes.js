'use strict';

var usersRequestHandlers = require('./api/users/users.main');
var addressesRequestHandlers = require('./api/addresses/addresses.main');

module.exports = routes;
    
function routes( app ){
    app.use('/users', usersRequestHandlers);
    app.use('/addresses', addressesRequestHandlers);
}