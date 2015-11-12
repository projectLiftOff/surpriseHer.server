const Transactions = require("./transactions.query.js")
const Payments = require("../payments/payments.controller.js")
// const TransactionsServices = require("./transactions.services.js")
const Gifts = require("../gifts/gifts.query.js")
const Addresses = require("../addresses/addresses.query.js")
const Users = require("../users/users.query.js")
const async = require("async")
// const txtMessenger = require("../../services/twilio/twilio.main.js")
const log = require("../../config/log.js")
const httpStatus = require("../../../httpStatuses.json")
const finishRegistrationUrl = process.env.NODE_ENV === "production" ? "http://testsurpriseher.azurewebsites.net/signup" : "http://localhost:6060/signup"

function findUserFromPhone (data, callback) {
  // phone -> User
  Users.findByPhone(data.phone, (error, user) => {
    if (error) { return callback({message: "findUserFromPhone error", error, data}) }
    if (!user.length) { return callback({message: `User with phone ${data.phone} does not exist`}) }
    data.user = user[0]
    return callback(null, data)
  })
}
function parseUserText (data, callback) {
  const parsedText = data.userText.split(" ")
  data.dayOfMonth = parsedText[0]
  data.giftName = parsedText[1]
  data.addressName = parsedText[2]
  // async.parallel(dateFromDayOfMonth, giftFromName, addressFromName)
  data.date = `${(new Date()).getMonth() + 1}/${data.dayOfMonth}`
  Gifts.findByName(data.giftName, (giftError, gift) => {
    if (giftError) { return callback({message: "findGiftByName error", giftError, data}) }
    if (!gift.length) { return callback({message: `Gift with name ${data.giftName} does not exist`}) }
    data.gift = gift[0]
    if (data.addressName) {
      Addresses.findByUserAndName(data.user.id, data.addressName, (addressError, address) => {
        if (addressError) { return callback({message: "findAddressByUserAndName error", addressError, data}) }
        if (!address.length) { return callback({message: `Address with name ${data.addressName} for user ${data.user.id} does not exist`}) }
        data.address = address[0]
        return callback(null, data)
      })
    } else {
      data.address = null
      return callback(null, data)
    }
  })
}
function validateDate (data, callback) { // TODO
  return callback(null, data)
}
function validateGift (data, callback) { // TODO
  return callback(null, data)
}
function validateAddress (data, callback) { // TODO
  // if user.registration_complete && address bad, fail out else continue
  return callback(null, data)
}
function createTransaction (data, callback) {
  data.transaction = {
    status: data.user.registration_complete ? "unfilfilled" : "pending user registration",
    user_id: data.user.id,
    gift_id: data.gift.id,
    address_id: data.address ? data.address.id : null,
    paid: 0
  }
  Transactions.create(data.transaction, (error, result) => {
    if (error) { return callback({message: "createTransaction error", error, data}) }
    data.transaction_id = result.insertId
    return callback(null, data)
  })
}
function sendFinishRegistrationText (data) {
  const message = `We'll get your '${data.gift.gift_name}' ready for ${data.date}! To confirm your order, please enter your shipping address and payment here: ${finishRegistrationUrl}?u=${data.user.id}`
  log.error({message})
}
function finishRegistrationIfIncomplete (data, callback) { // TODO
  if (data.user.registration_complete === 0) {
    sendFinishRegistrationText(data)
    return callback({message: "user not fully registered", data})
  } else {
    return callback(null, data)
  }
}
function chargeUser (data, callback) {
  Payments.charge(data.user.braintree_id, data.gift.price, error => {
    if (error) { return callback({message: "payment failed", error, data}) }
    data.transaction.paid = 1
    return callback(null, data)
  })
}
function completeTransaction (data, callback) {
  data.transaction.status = "unfilfilled"
  return callback(null, data)
}
function updateTransaction (data, callback) {
  return Transactions.update(data.transaction_id, data.transaction, error => {
    if (error) { return callback({message: "transaction update failed", error, data}) }
    return callback(null, data)
  })
}

exports.create = (req, res) => {
  const data = {
    phone: req.body.From,
    userText: req.body.Body,
    user: null,
    date: null,
    gift: null,
    address: null
  }
  async.seq(
    findUserFromPhone,
    parseUserText,
    validateDate,
    validateGift,
    validateAddress,
    createTransaction,
    finishRegistrationIfIncomplete,
    chargeUser,
    updateTransaction
  )(data, error => {
    if (error) {
      log.error({error})
      res.status(httpStatus["Bad Request"].code).send(error)
    } else {
      log.debug("Completed transaction created for registered user!")
      res.sendStatus(httpStatus.Created.code)
    }
  })
}

function latestPendingTransactionForUser (data, callback) {
  Transactions.pendingUserRegistration(data.user_id, (error, transactions) => {
    if (error) { return callback({message: `error finding latest pending transaction for user ${data.user_id}`, error, data}) }
    if (transactions.length !== 1) { return callback({message: `Latest pending transactions for user ${data.user_id} returned wrong number of results`}) } // TODO handle multiple pending transactions
    data.transaction = transactions[0]
    log.debug("Found transaction", data.transaction)
    return callback(null, data)
  })
}

function selectTransactionGift (data, callback) {
  Gifts.findById(data.transaction.gift_id, (error, results) => {
    if (error) { return callback({message: `error finding gift by id ${data.transaction.gift_id}`, error, data}) }
    if (results.length !== 1) { return callback({message: `Gift ${data.transaction.gift_id} returned wrong number of results`, results}) }
    data.gift = results[0]
    log.debug(`Found gift ${data.gift.gift_name}`)
    callback(null, data)
  })
}

function selectTransactionAddress (data, callback) {
  Addresses.findByUserAndName(data.user_id, data.address_name, (error, results) => {
    if (error) { return callback({message: `error finding address for user ${data.user_id} with name ${data.address_name}`, error, data}) }
    if (results.length !== 1) { return callback({message: `Address for user ${data.user_id} with name ${data.address_name} returned wrong number of results`, results}) }
    data.address = results[0]
    log.debug(`Found address ${data.address.full_address}`)
    callback(null, data)
  })
}

exports.completePendingTransaction = (data, callback) => {
  data.user.id = data.user_id
  data.address_name = data.transaction.shipToAddressCode
  data.transaction = {} // because transaction will be used to update
  async.seq(
    latestPendingTransactionForUser,
    selectTransactionGift,
    selectTransactionAddress,
    completeTransaction,
    chargeUser,
    updateTransaction
  )(data, error => {
    if (error) { return callback({message: `error completing pending transaction for user ${data.user_id}`, error}) }
    log.debug("Pending transaction completed for registering user!")
    return callback(null, data)
  })
}
