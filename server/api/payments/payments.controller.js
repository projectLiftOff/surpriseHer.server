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
      log.info("payment", {result})
      res.send(httpStatus.OK.code)
    }
  })
}
