const Transactions = require("./transactions.query.js")
const TransactionsServices = require("./transactions.services.js")
const Gifts = require("../gifts/gifts.query.js")
const Addresses = require("../addresses/addresses.query.js")
const Users = require("../users/users.query.js")
const async = require("async")
// const txtMessenger = require("../../services/twilio/twilio.main.js")
const log = require("../../config/log.js")
const httpStatus = require("../../../httpStatuses.json")
const monthCutoff = 5
// var inMemoryCache = require("../../services/cache/cache.constructor.js")

function sendData (error, res, data) {
  if (error) {
    log.error("addresses sendData failed", {error})
    res.send(httpStatus["Internal Server Error"].code, {error})
  } else {
    res.send(data)
  }
}

exports.getAll = (req, res) => {
  Transactions.getAll(req, res, sendData)
}

exports.create = (req, res) => {
  log.debug("req.body -------------------------------------------------------- :\n", req.body, "\n")
  const currentDate = TransactionsServices.createDate()

  // C: Check transaction came in before the 1am of the 5th of the month OR that gift ordered is from signup text
  const coffeeGift = req.body.Body.indexOf("coffee") >= 0
  const smoresGift = req.body.Body.indexOf("smores") >= 0
  const bubblesGift = req.body.Body.indexOf("bubbles") >= 0
  if (currentDate.day > monthCutoff && currentDate.hour > 1 && !coffeeGift && !smoresGift && !bubblesGift) {
    log.error("Transactions.create controller failed: Missed order window", req.body.Body)
    TransactionsServices.sendErrorMessage("missedOrderWindow", res)
    return
  }

  const phoneNumber = TransactionsServices.formatPhoneForQuery(req.body.From)
  async.waterfall([Users.withPhoneNumber.bind(null, phoneNumber)], (error, users) => {
    const user = users.pop()
    // TODO: handle error
    log.error("transactions controller create failed", {error})
    //  If User is fully registered
    if (Boolean(user.registration_complete)) {
      // Check that there are exactly 3 arguments in the req.body and organize the data
      const reqData = TransactionsServices.organizeDataCR(req.body.Body)
      if (reqData.errorMessage !== "") {
        TransactionsServices.sendErrorMessage(reqData.errorMessage, res)
        return
      }
      // Check format of date and make sure date exsist
      reqData.errorMessage = `${reqData.errorMessage}${TransactionsServices.verifyDate(reqData)}`

      async.waterfall([
        // Check if selected giftId is valid
        Gifts.availableForCurrentMonth.bind(null, `${currentDate.month}/${currentDate.year}`),
        (gifts, callback) => {
          // TODO: Also hadle "first txt" gift options that are always offered
          gifts.forEach(gift => {
            const lookupId = gift.look_up + gift.gift_id
            reqData.giftsOfTheMonth[lookupId] = gift
          })
          if (Boolean(reqData.giftsOfTheMonth[reqData.gift])) {
            reqData.selectedGiftInfo = reqData.giftsOfTheMonth[reqData.gift]
          } else {
            reqData.errorMessage = `${reqData.errorMessage} Gift Id format is incorrect`
          }
          // Check if address is valid
          const userPhone = TransactionsServices.formatPhoneForQuery(req.body.From)
          callback(null, userPhone)
        },
        Addresses.ofUserWithPhone,
        (results, callback) => {
          if (results.length === 0) {
            TransactionsServices.sendErrorMessage("noAddress", res)
            return
          }
          const userAddressesLookUp = results.reduce((addresses, address) => {
            addresses[address.nick_name] = address
          }, {})
          const giftIds = reqData.giftsOfTheMonth.map(gift => { // todo possible to do without lodash?
            return gift.gift_id
          })
          if (!userAddressesLookUp[reqData.address]) {
            reqData.errorMessage = `${reqData.errorMessage} Address nick name is incorrect`
            TransactionsServices.sendErrorMessage(reqData.errorMessage, res)
            return
          }
          // Check if user has already ordred a gift this month
          callback(null, userAddressesLookUp[reqData.address].user_id, giftIds)
        },
        Transactions.forUserWithGiftIds,
        (transactions, userId, callback) => {
          if (transactions.length !== 0 || reqData.errorMessage !== "") {
            if (transactions.length > 0) {
              TransactionsServices.sendErrorMessage("secondTransaction", res)
            } else {
              TransactionsServices.sendErrorMessage(reqData.errorMessage, res)
            }
            return
          } else {
            // Save transaction
            const transactionCreationData = {user_id: userId, gift_id: reqData.selectedGiftInfo.gift_id} // eslint-disable-line camelcase
            return callback(null, transactionCreationData) // eslint-disable-line consistent-return
          }
        },
        Transactions.create
      ], error1 => {
        // TODO: Charge for the gift
        if (error1) {
          log.error("transactions controller error when user completed registration:", {error})
          TransactionsServices.sendErrorMessage("generic", res)
        } else {
          TransactionsServices.sendSuccessMessageCR(reqData, res)
        }
      })
    } else {
      //  If User is NOT fully registered
      //  Check that there are exactly 2 arguments (date, giftId) in the req.body and organize the data
      const reqData = TransactionsServices.organizeDataIR(req.body.Body)
      if (reqData.errorMessage !== "") {
        TransactionsServices.sendErrorMessage(reqData.errorMessage, res)
        return
      }
      async.waterfall([
        // Check if selected giftId is valid
        Gifts.availableForCurrentMonth.bind(null, `${currentDate.month}/${currentDate.year}`),
        (gifts, callback) => {
          // TODO: Also hadle "first txt" gift options that are always offered
          gifts.forEach(gift => {
            const lookupId = gift.look_up + gift.gift_id
            reqData.giftsOfTheMonth[lookupId] = gift
          })
          if (Boolean(reqData.giftsOfTheMonth[reqData.gift])) {
            reqData.selectedGiftInfo = reqData.giftsOfTheMonth[reqData.gift]
          } else {
            reqData.errorMessage = `${reqData.errorMessage} Gift Id format is incorrect`
            TransactionsServices.sendErrorMessage(reqData.errorMessage, res)
            return
          }
          // Create transaction with pending status
          const transactionCreationData = {
            user_id: user.user_id, // eslint-disable-line camelcase
            gift_id: reqData.selectedGiftInfo.gift_id, // eslint-disable-line camelcase
            status: "pending user registration",
            paid: 0
          }
          callback(null, transactionCreationData)
        },
        Transactions.create
        // Check if user has already tried to order a gift but didn"t finish registration
        // Check if user already has a transaction with pending status
        // if true send register link again
        // NOTE: handle above situation in the registration endpoint by only completing the most recent transaction
      ], error1 => {
        reqData.userId = user.user_id
        if (error1) {
          log.error("transactions controller error when user not completely registered:", {error})
          TransactionsServices.sendErrorMessage("generic", res)
        } else {
          // TODO: Construct link to signup page with query param that contains userId, (maybe giftLookUp)
          TransactionsServices.sendSuccessMessageIR(reqData, res)
        }
      })
    }
  })
}

// exports.update = function(req, res, next) {
//     log.debug("inside transactions.controller.create")
//     transactions.update(req, res, sendData)
// }
