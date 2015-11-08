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
  // userText -> Gift, Date, Address
  const parsedText = data.userText.split(" ")
  data.dayOfMonth = parsedText[0]
  data.giftName = parsedText[1]
  data.addressName = parsedText[2]
  // async.parallel(dateFromDayOfMonth, giftFromName, addressFromName)
  data.date = `${data.dayOfMonth}/${(new Date()).getMonth() + 1}`
  Gifts.findByName(data.giftName, (giftError, gift) => {
    if (giftError) { return callback({message: "findGiftByName error", giftError, data}) }
    if (!gift.length) { return callback({message: `Gift with name ${data.giftName} does not exist`}) }
    data.gift = gift[0]
    Addresses.findByUserAndName(data.user.id, data.addressName, (addressError, address) => {
      if (addressError) { return callback({message: "findAddressByUserAndName error", addressError, data}) }
      if (!address.length) { return callback({message: `Address with from user ${data.user.id} and name ${data.giftName} does not exist`}) }
      data.address = address[0]
      return callback(null, data)
    })
  })
}
function validateDate (data, callback) { // TODO
  return callback(null, data)
}
function validateGift (data, callback) { // TODO
  return callback(null, data)
}
function createPendingTransaction (data, callback) {
  data.transaction = {
    status: "pending user registration",
    user_id: data.user.id,
    gift_id: data.gift.id,
    address_id: data.address.id,
    paid: 0
  }
  Transactions.create(data.transaction, (error, result) => {
    if (error) { return callback({message: "createTransaction error", error, data}) }
    data.transaction_id = result.insertId
    return callback(null, data)
  })
}
function finishRegistrationIfIncomplete (data, callback) { // TODO
  if (data.user.registration_complete === 0) {
    sendFinishRegistrationText()
    return callback({message: "user not fully registered", data})
  } else {
    return callback(null, data)
  }
}
function validateAddress (data, callback) { // TODO
  return callback(null, data)
}
function chargeUser (data, callback) {
  Payments.charge(data.user.braintree_id, data.gift.price, error => {
    if (error) { return callback({message: "payment failed", error, data}) }
    data.transaction.paid = 1
    return callback(null, data)
  })
}
function completeTransaction (data, callback) {
  data.transaction.status = "unfulfilled"
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
    createPendingTransaction,
    finishRegistrationIfIncomplete,
    validateAddress,
    chargeUser,
    completeTransaction
  )(data, error => {
    if (error) {
      log.error({error})
      res.status(httpStatus["Bad Request"].code).send(error)
    } else {
      log.debug("complete!")
      res.sendStatus(httpStatus.Created.code)
    }
  })
}
