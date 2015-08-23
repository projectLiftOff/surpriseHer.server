'use strict';

var usersRequestHandlers = require('./api/users/users.main');
var addressesRequestHandlers = require('./api/addresses/addresses.main');
var addressesRequestHandlers = require('./api/subscriptions/subscriptions.main');

module.exports = routes;
    
function routes( app ){
    app.use('/users', usersRequestHandlers);
    app.use('/addresses', addressesRequestHandlers);
    app.use('/subscriptions', addressesRequestHandlers);
}