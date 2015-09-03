'use strict';

var usersRequestHandlers = require('./api/users/users.main');
var addressesRequestHandlers = require('./api/addresses/addresses.main');
var subscriptionsRequestHandlers = require('./api/subscriptions/subscriptions.main');
var transactionsRequestHandlers = require('./api/transactions/transactions.main');

module.exports = routes;
    
function routes( app ){
    app.use('/users', usersRequestHandlers);
    app.use('/addresses', addressesRequestHandlers);
    app.use('/subscriptions', subscriptionsRequestHandlers);
    app.use('/transactions', transactionsRequestHandlers);
}