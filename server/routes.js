const usersRequestHandlers = require("./api/users/users.main")
const addressesRequestHandlers = require("./api/addresses/addresses.main")
const subscriptionsRequestHandlers = require("./api/subscriptions/subscriptions.main")
const transactionsRequestHandlers = require("./api/transactions/transactions.main")
const viewsRequestHandlers = require("./public/views.routing")

function routes (app) {
  app.use("/users", usersRequestHandlers)
  app.use("/addresses", addressesRequestHandlers)
  app.use("/subscriptions", subscriptionsRequestHandlers)
  app.use("/transactions", transactionsRequestHandlers)
  app.use("/", viewsRequestHandlers)
}

module.exports = routes
