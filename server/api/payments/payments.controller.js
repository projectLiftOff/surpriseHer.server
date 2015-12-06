const braintree = require("braintree")
const log = require("../../config/log")
const httpStatus = require("../../../httpStatuses.json")
global.Braintree = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.braintree_merchant_id,
  publicKey: process.env.braintree_public_key,
  privateKey: process.env.braintree_private_key
})

exports.gateway = global.Braintree

exports.createCustomer = (nonce, user, callback) => {
  global.Braintree.customer.create({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    paymentMethodNonce: nonce
  }, (error, result) => {
    if (error) {
      return callback(error)
    } else {
      log.info(`Created Braintree customer ${result.customer.id}`)
      return callback(null, result.customer.id)
    }
  })
}

exports.charge = (userBraintreeId, amount, callback) => {
  global.Braintree.transaction.sale({
    amount,
    customerId: userBraintreeId
  }, (error, result) => {
    if (error) {
      return callback({message: `payments.charge ${userBraintreeId} for $${amount} error`, error})
    } else if (!result.transaction || !result.transaction.status || result.transaction.status !== "authorized") {
      return callback({message: `payments.charge ${userBraintreeId} for $${amount} not authorized`, result})
    } else {
      log.info(`Attempted payment ${result.transaction.status}`)
      return callback()
    }
  })
}

exports.generateToken = (req, res) => {
  global.Braintree.clientToken.generate({}, (error, response) => {
    if (error) {
      const errorMessage = {message: "braintree failed to generate token", error}
      log.error(errorMessage)
      return res.send(httpStatus["Internal Server Error"].code, errorMessage)
    } else {
      res.send(response.clientToken)
    }
  })
}
