const path = require("path")
const express = require("express")
const addressesRequestHandlers = require("./api/addresses/addresses.main")
const usersRequestHandlers = require("./api/users/users.routes")
const paymentsRequestHandlers = require("./api/payments/payments.routes")
const transactionsRequestHandlers = require("./api/transactions/transactions.routes")
const statusRequestHandler = require("./api/status")

function routes (app) {
  app.use("/addresses", addressesRequestHandlers)
  app.use("/users", usersRequestHandlers)
  app.use("/payments", paymentsRequestHandlers)
  app.use("/transactions", transactionsRequestHandlers)
  app.use("/status", statusRequestHandler)
  app.use("/", express.static(path.join(__dirname, "../client")))
}

module.exports = routes
