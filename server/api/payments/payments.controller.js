const braintree = require("braintree")
const log = require("../../config/log")
// const httpStatus = require("../../../httpStatuses.json")
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.braintree_merchant_id,
  publicKey: process.env.braintree_public_key,
  privateKey: process.env.braintree_private_key
})
// const Users = require("../users/users.query.js")

exports.gateway = gateway

exports.createCustomer = (nonce, callback) => {
  gateway.customer.create({
    firstName: "Charity",
    lastName: "Smith",
    paymentMethodNonce: nonce
  }, (error, result) => {
    if (error) {
      return callback(error)
    } else {
      log.debug("created braintree customer", {
        status: result.success, // true
        customerId: result.customer.id, // e.g 160923
        paymentMethodToken: result.customer.paymentMethods[0].token // e.g f28wm
      })
      return callback(null, result.customer.id)
    }
  })
}

exports.charge = (userBraintreeId, amount, callback) => {
  gateway.transaction.sale({
    amount,
    customerId: userBraintreeId
  }, (error, result) => {
    if (error) {
      return callback({message: `payments.charge ${userBraintreeId} for $${amount} error`, error})
    } else if (!result.transaction || !result.transaction.status || result.transaction.status !== "authorized") {
      return callback({message: `payments.charge ${userBraintreeId} for $${amount} not authorized`, result})
    } else {
      log.debug("payment received", {charge: result.transaction.status})
      return callback()
    }
  })
}
