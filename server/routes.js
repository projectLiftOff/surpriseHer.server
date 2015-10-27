const addressesRequestHandlers = require("./api/addresses/addresses.main")
const usersRequestHandlers = require("./api/users/users.main")
const paymentsRequestHandlers = require("./api/payments/payments.routes")
const subscriptionsRequestHandlers = require("./api/subscriptions/subscriptions.main")
const transactionsRequestHandlers = require("./api/transactions/transactions.main")
const viewsRequestHandlers = require("./public/views.routing")

function routes (app) {
  app.use("/addresses", addressesRequestHandlers)
  app.use("/users", usersRequestHandlers)
  app.use("/payments", paymentsRequestHandlers)
  app.use("/subscriptions", subscriptionsRequestHandlers)
  app.use("/transactions", transactionsRequestHandlers)
  app.use("/", viewsRequestHandlers)
}

module.exports = routes
