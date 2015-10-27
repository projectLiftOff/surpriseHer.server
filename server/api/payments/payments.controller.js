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

exports.createCustomer = (req, res) => {
  const nonceFromTheClient = req.body.payment_method_nonce
  gateway.customer.create({
    firstName: "Charity",
    lastName: "Smith",
    paymentMethodNonce: nonceFromTheClient
  }, (error, result) => {
    if (error) {
      res.send(httpStatus["Internal Server Error"].code)
      throw error
    } else {
      log.info({
        status: result.success, // true
        customerId: result.customer.id, // e.g 160923
        paymentMethodToken: result.customer.paymentMethods[0].token // e.g f28wm
      })
      res.send(httpStatus.OK.code)
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
