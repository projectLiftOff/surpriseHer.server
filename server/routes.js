const addressesRequestHandlers = require("./api/addresses/addresses.main")
const usersRequestHandlers = require("./api/users/users.routes")
const paymentsRequestHandlers = require("./api/payments/payments.routes")
const transactionsRequestHandlers = require("./api/transactions/transactions.routes")
const viewsRequestHandlers = require("./public/views.routing")

function routes (app) {
  app.use("/addresses", addressesRequestHandlers)
  app.use("/users", usersRequestHandlers)
  app.use("/payments", paymentsRequestHandlers)
  app.use("/transactions", transactionsRequestHandlers)
  app.use("/", viewsRequestHandlers)
}

module.exports = routes
