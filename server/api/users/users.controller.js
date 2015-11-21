const Users = require("./users.query.js")
const UsersServices = require("./users.services.js")
const Addresses = require("../addresses/addresses.query.js")
const Transactions = require("../transactions/transactions.controller.js")
const Gifts = require("../gifts/gifts.query.js")
const payments = require("../payments/payments.controller.js")
const async = require("async")
const UserErrorMessageDictionary = require("../errorsMessages.js")
const TxtMessenger = require("../../services/twilio/twilio.main.js")
const log = require("../../config/log.js")
const httpStatus = require("../../../httpStatuses.json")

exports.getAll = (req, res) => {
  async.waterfall([Users.getAll],
    (error, users) => {
      if (error) {
        log.error("Users.getAll query failed", {error})
        res.status(httpStatus["Bad Request"].code).send(error)
        return
      }
      log.info("Users.getAll query was successful")
      res.status(httpStatus.OK.code).send(users)
    }
  )
}

function createUser (data, callback) { // data: {user, addresses, payments}
  Users.create(data.user, (error, results) => {
    if (error) { return callback({message: "Users.create error", error, data}) }
    log.info("Created user", data.user)
    data.user_id = results.insertId
    return callback(null, data)
  })
}
function getAvailableGifts(data, callback) {
  Gifts.availableAfterSignUp( (error, gifts) => {
    if (error) { return callback({message: "Gifts.availableAfterSignUp Error", error, data}) }
    if (!gifts.length) { return callback({message: "No permanent gifts found with Gifts.availableAfterSignUp", userMessageCode: 'contactSupport', error, data}) }
    data.availableGifts = gifts
    return callback( null, data )
  })
}
function sendTxtMessage(data, callback) {
  data.message = UsersServices.constructSignUpGiftOptionsMessages( data.user.registration_complete, data.availableGifts, data.addresses )
  TxtMessenger.sendTxt( data.user.phone, data.message, (error) => {
    if (error) { return callback({message: "TxtMessenger.sendTxt Error", userMessageCode: 'contactSupportTxtMessenger', error, data}) }
    return callback(null, data);
  })
}
function addAddresses (data, callback) {
  const pendingQueries = {count: 0}
  const codeNames = data.addresses.map(a => a.code_name)
  data.addresses.forEach(address => {
    pendingQueries.count = pendingQueries.count + 1
    address.user_id = address.user_id || data.user_id
    Addresses.create(address, error => {
      if (error) { return callback({message: "Addresses.create error", userMessageCode: 'contactSupportAddresses', error, address, data }) }
      pendingQueries.count = pendingQueries.count - 1
      if (pendingQueries.count === 0) {
        log.info(`Created addresses ${codeNames} for user ${data.user_id}`)
        return callback(null, data)
      }
    })
  })
}
function addBraintreeCustomer (data, callback) {
  payments.createCustomer(data.payments.nonce, (error, customerId) => {
    if (error) { return callback({message: "addBraintreeCustomer error", userMessageCode: 'contactSupportCreateBraintree', data, error}) }
    data.user.braintree_id = customerId
    return callback(null, data)
  })
}
function markCompleted (data, callback) {
  data.user.registration_complete = 1
  callback(null, data)
}
function updateUser (data, callback) {
  return Users.update([data.user, data.user_id], error => {
    if (error) { return callback({message: "Users.update error", userMessageCode: 'contactSupport', error, user: data.user, user_id: data.user_id, data}) }
    log.info(`Updated user ${data.user_id}`)
    return callback(null, data)
  })
}

exports.createIncomplete = (req, res) => {
  const data = {user: {phone: req.body.phone, tos: req.body.tos, registration_complete: 0}}
  async.seq(
    createUser,
    getAvailableGifts,
    sendTxtMessage
  )(data, error => {
    if (error) {
      log.error({error})
      res.status(httpStatus["Bad Request"].code).send( UserErrorMessageDictionary[ error.userMessageCode ] )
    } else {
      res.sendStatus(httpStatus.Created.code)
    }
  })
}

exports.createComplete = (req, res) => {
  async.seq(
    markCompleted,
    createUser,
    addAddresses,
    addBraintreeCustomer,
    updateUser,
    getAvailableGifts,
    sendTxtMessage
  )(req.body, error => {
    if (error) {
      log.error({error})
      res.status(httpStatus["Bad Request"].code).send( UserErrorMessageDictionary[ error.userMessageCode ] )
    } else {
      res.sendStatus(httpStatus.Created.code)
    }
  })
}

exports.finishRegistration = (req, res) => {
  const data = req.body
  data.user_id = req.params.id
  async.seq(
    markCompleted,
    addAddresses,
    addBraintreeCustomer,
    updateUser,
    Transactions.completePendingTransaction
  )(data, error => {
    if (error) {
      log.error({error})
      res.status(httpStatus["Bad Request"].code).send( UserErrorMessageDictionary[ error.userMessageCode ] )
    } else {
      res.sendStatus(httpStatus.Created.code)
    }
  })
}
