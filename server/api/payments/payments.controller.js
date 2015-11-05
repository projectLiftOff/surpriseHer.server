const braintree = require("braintree")
const log = require("../../config/log")
const httpStatus = require("../../../httpStatuses.json")
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.braintree_merchant_id,
  publicKey: process.env.braintree_public_key,
  privateKey: process.env.braintree_private_key
})

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

exports.checkout = (req, res) => {
  const nonceFromTheClient = req.body.payment_method_nonce
  // Use payment method nonce here
  gateway.transaction.sale({
    amount: "10.00",
    paymentMethodNonce: nonceFromTheClient
  }, (error, result) => {
    if (error) {
      res.send(httpStatus["Internal Server Error"].code)
      throw error
    } else {
      log.info("payment received", {statusHistory: result.transaction.statusHistory})
      res.send(httpStatus.OK.code)
    }
  })
}
