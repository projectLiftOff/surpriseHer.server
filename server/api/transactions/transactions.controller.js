"use strict"

const Transactions = require("./transactions.query.js")
const Payments = require("../payments/payments.controller.js")
const TransactionsServices = require("./transactions.services.js")
const Gifts = require("../gifts/gifts.query.js")
const Addresses = require("../addresses/addresses.query.js")
const Users = require("../users/users.query.js")
const async = require("async")
const moment = require("moment")
const log = require("../../config/log.js")
const httpStatus = require("../../../httpStatuses.json")

function validateOrderWindow (data, callback) {
  // if (~['+19785052128','+15034282359', '+18157039093'].indexOf(data.phone)) { return callback(null, data) } // skip validation for US
  function notWithinOrderWindow () {
    const startOfOrderWindowDay = 25
    const endOfOrderWindowDay = 29
    const endOfOrderWindowHour = 3
    const today = moment().date()
    const hour = moment().hour()
    return Boolean(today < startOfOrderWindowDay || today > endOfOrderWindowDay || (today === endOfOrderWindowDay && hour > endOfOrderWindowHour))
  }

  function availableGift (giftName, giftsAvailable) {
    for (let i = 0; i < giftsAvailable.length; i = i + 1) {
      if (giftsAvailable[i].look_up === giftName) { return true }
    }
    return false
  }

  Gifts.availableAfterSignUp((error, gifts) => {
    if (error) { return callback({message: "Gifts.availableAfterSignUp error", error}) }
    if (notWithinOrderWindow() && !availableGift(data.giftName, gifts)) {
      return callback({userMessageCode: "missedOrderWindow", message: "user missed order window", data})
    }
    return callback(null, data)
  })
}
function findUserFromPhone (data, callback) {
  const userPhone = TransactionsServices.formatPhoneForQuery(data.phone)
  Users.findByPhone(userPhone, (error, user) => {
    if (error) { return callback({message: "Users.findByPhone Error", error, data}) }
    if (!user.length) { return callback({userMessageCode: "phoneNumberNotFound", message: `User with phone ${data.phone} does not exist`, data}) }
    data.user = user[0]
    return callback(null, data)
  })
}
function organizeUserText (data, callback) {
  const dataList = data.userText.split(" ").filter(str => str !== "")
  if (dataList.length !== ["date", "gift", "address"].length && dataList.length !== ["date", "gift"].length) {
    const userMessageCode = data.user.registration_complete ? "wrongNumberArgumentsCompleteUser" : "wrongNumberArgumentsIncompleteUser"
    return callback({message: "Wrong Number of Arguments error", data, userMessageCode})
  }
  data.dayOfMonth = dataList[0]
  data.giftName = dataList[1]
  data.addressCodeName = dataList[2]
  callback(null, data)
}
function validateDate (data, callback) {
  const month = (moment().add(1, "month").get("month")) + 1
  const dateStr = `${moment().get("year")} ${month} ${data.dayOfMonth}`
  const date = moment(dateStr, "YYYY MM DD", true)
  if (!date.isValid()) { return callback({message: "User entered invalid date", data, userMessageCode: "invalidDate"}) }
  data.allowGiftsForMonthOf = `${month}/${moment().get("year")}`
  data.date = `${month}/${data.dayOfMonth}`
  return callback(null, data)
}
function validateGift (data, callback) {
  Gifts.findByName(data.giftName, (giftError, gift) => {
    if (giftError) { return callback({message: "findGiftByName error", giftError, data}) }
    if (!gift.length) { return callback({message: `Gift with name ${data.giftName} does not exist`, data, userMessageCode: "invalidGiftName"}) }
    if (gift[0].month_of !== data.allowGiftsForMonthOf && gift[0].month_of !== "0") {
      return callback({message: `Gift with name ${data.giftName} exist but is not avalible this month`, data, userMessageCode: "giftNotAvalible"})
    }
    data.gift = gift[0]
    return callback(null, data)
  })
}
function validateAddress (data, callback) {
  if (data.user.registration_complete) {
    Addresses.findByUserAndName(data.user.id, data.addressCodeName, (addressError, address) => {
      if (addressError) { return callback({message: "findAddressByUserAndName error", addressError, data}) }
      if (!address.length) {
        return callback({message: `Address with code name ${data.addressCodeName} for user ${data.user.id} does not exist`, data, userMessageCode: "invalidAddressCodeName"})
      }
      data.address = address[0]
      return callback(null, data)
    })
  } else {
    data.address = null
    return callback(null, data)
  }
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
function chargeUser (data, callback) {
  if (data.user.registration_complete) {
    Payments.charge(data.user.braintree_id, data.gift.price, error => {
      if (error) { return callback({message: "payment failed", error, data, userMessageCode: "paymentFaild"}) }
      data.transaction.paid = 1
      return callback(null, data)
    })
  } else { return callback(null, data) }
}
function updateTransaction (data, callback) {
  if (data.transaction) {
    return Transactions.update(data.transaction_id, data.transaction, error => {
      if (error) { return callback({message: "transaction update failed", error, data}) }
      return callback(null, data)
    })
  } else { return callback(null, data) }
}

// TODO: handle multiple transactions per month
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
    organizeUserText,
    validateOrderWindow,
    validateDate,
    validateGift,
    validateAddress,
    createTransaction,
    chargeUser,
    updateTransaction
  )(data, error => {
    // C: assumes res is always a response to a txting service (twilio)
    res.set("Content-Type", "text/xml")
    if (error) {
      log.error({error})
      const errorTxtMessage = TransactionsServices.getErrorMessage(error.userMessageCode)
      // C: status must be 200 for twilio to send message??
      res.status(httpStatus.OK.code).send(errorTxtMessage)
    } else {
      log.info("Completed transaction created for registered user!")
      const message = TransactionsServices.composeSuccessMessage(data, data.user.registration_complete)
      res.status(httpStatus.OK.code).send(message)
    }
  })
}

// TODO: should handle multiple pending transactions
function latestPendingTransactionForUser (data, callback) {
  Transactions.pendingUserRegistration(data.user_id, (error, transactions) => {
    if (error) { return callback({message: `error finding latest pending transaction for user ${data.user_id}`, error, data}) }
    if (transactions.length !== 1) { return callback({message: `Latest pending transactions for user ${data.user_id} returned wrong number of results`, data}) } // TODO handle multiple pending transactions
    log.debug("Found transaction", data.transaction)
    data.transaction_id = transactions[0].id
    delete transactions[0].id
    data.transaction = transactions[0]
    return callback(null, data)
  })
}
function selectTransactionGift (data, callback) {
  Gifts.findById(data.transaction.gift_id, (error, results) => {
    if (error) { return callback({message: `error finding gift by id ${data.transaction.gift_id}`, error, data}) }
    if (results.length !== 1) { return callback({message: `Gift ${data.transaction.gift_id} returned wrong number of results`, results, data}) }
    data.gift = results[0]
    log.debug(`Found gift ${data.gift.gift_name}`)
    callback(null, data)
  })
}
function selectTransactionAddress (data, callback) {
  Addresses.findByUserAndName(data.user_id, data.address_name, (error, results) => {
    if (error) { return callback({message: `error finding address for user ${data.user_id} with name ${data.address_name}`, error, data}) }
    if (results.length !== 1) { return callback({message: `Address for user ${data.user_id} with name ${data.address_name} returned wrong number of results`, results, data}) }
    data.address = results[0]
    log.debug(`Found address ${data.address.full_address}`)
    callback(null, data)
  })
}
function completeTransaction (data, callback) {
  data.transaction.status = "unfilfilled"
  data.transaction.address_id = data.address.id
  return callback(null, data)
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
    if (error) { return callback({message: `error completing pending transaction for user ${data.user_id}`, error, data}) }
    log.info("Pending transaction completed for registering user!")
    return callback(null, data)
  })
}
