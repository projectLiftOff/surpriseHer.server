"use strict"

const moment = require("moment")
const twilio = require("twilio")
const log = require("./../../config/log.js")
const httpStatus = require("../../../httpStatuses.json")
const userErrorMessageLookUp = {
  phoneNumberNotFound: "Hmm... we don't seem to recognize this number... to register for awesome gifts! go to surpriseher.com",
  wrongNumberArgumentsCompleteUser: "Please only send the following info: date, gift, address. In the following format: \n \n date gift address",
  wrongNumberArgumentsIncompleteUser: "Please only send the following info: date and gift. In the following format: \n \n date gift",
  // noAddress: "Hmm.. there seems to be a problem with your address.. please contact customer support",
  // secondTransaction: "You have already ordered a gift this month... If you want to change your order or order an additional gift please contact customer support",
  // missedOrderWindow: "Sorry but you missed the order window... but dont worry in about XXX days we are going to have another gift choice!!",
  generic: "oops.. looks like there was an error please try again or contact customer support: adfkjdf@ask.com or 444444444"
}
const url = "idk" // todo
const digitsInPhone = 10

exports.organizeDataCR = dataStr => {
  const data = {}
  if (!dataStr) {
    data.errorMessage = "Please send the following info: date, gift and address"
    log.error("empty user response to organizeDataCR", {dataStr})
    return data
  }
  const dataList = dataStr.split(" ")
  data.date = dataList[0]
  data.gift = dataList[1]
  data.address = dataList[2]
  data.giftsOfTheMonth = {}
  if (dataList.length !== ["date", "gift", "address"].length) {
    data.errorMessage = "Please only send the following info: date, gift and address."
    log.error("malformed user response to organizeDataCR", {dataList})
  }
  return data
}
exports.organizeDataIR = dataStr => {
  const data = {}
  if (!dataStr) {
    data.errorMessage = "Please send the following info: date, gift"
    log.error("empty user response to organizeDataIR", {dataStr})
    return data
  }
  const dataList = dataStr.split(" ")
  data.date = dataList[0]
  data.gift = dataList[1]
  data.giftsOfTheMonth = {}
  if (dataList.length !== 2) {
    data.errorMessage = "Please only send the following info: date, gift."
    log.error("malformed user response to organizeDataIR", {dataList})
  }
  return data
}
exports.verifyDate = data => {
  data.date = data.date.trim()
  for (let i = 0; i < data.date.length; i = i + 1) {
    if (!(/\d/).test(data.date[i])) { return "You have provided an invalid format for the selected date." }
  }
  if (data.date.length > 2) { return "You have provided an invalid format for the selected date." }
  const dateStr = `${moment().get("year")} ${data.date} ${(moment().get("month") + 1)}`
  const date = moment(dateStr, "YYYY DD MM")
  if (!date.isValid()) { return "You have provided an invalid date." }
  return ""
}
exports.createDate = () => {
  const date = {}
  const currentDate = new Date()
  date.day = currentDate.getDate()
  date.hour = currentDate.getHours()
  date.year = currentDate.getFullYear()
  date.month = currentDate.getMonth() + 1
  return date
}
exports.sendErrorMessage = (message, res) => {
  log.debug("---- Inside sendErrorMessage Message: \n", message, "\n")
  if (Boolean(errorMessageLookUp[message])) {
    message = errorMessageLookUp[message]
  } else {
    log.error("error message lookup failed", {message})
  }
  const twiml = twilio.TwimlResponse() // eslint-disable-line new-cap
  twiml.message(message)
  res.set("Content-Type", "text/xml")
  res.status(httpStatus["Bad Request"].code).send(twiml.toString())
}
exports.composeSuccessMessage = composeSuccessMessage
exports.formatPhoneForQuery = formatPhoneForQuery

function getErrorMessage( errorCode ) {
  errorCode = !errorCode ? 'generic' : errorCode;
  const twiml = twilio.TwimlResponse() // eslint-disable-line new-cap
  const message = userErrorMessageLookUp[errorCode]
  twiml.message(message)
  return twiml.toString()
}
function formatPhoneForQuery(phone) {
  const phoneFormated = []
  for (let i = 0; i < phone.length; i = i + 1) {
    if ((/\d/).test(phone[i])) { phoneFormated.push(phone[i]) }
  }
  if (phoneFormated.length === digitsInPhone + 1) {
    phoneFormated.shift()
  }
  if (phoneFormated.length !== digitsInPhone) {
    log.error("phone formatting failed", {phone, phoneFormated})
  }
  return Number(phoneFormated.join(""))
}
function composeSuccessMessage(data, userRegistered) {
  const twiml = twilio.TwimlResponse() // eslint-disable-line new-cap
  let message = "";
  if(userRegistered) message = `Your order of ${data.gift.gift_name} has been placed and will be shipped on ${data.date}. If there are any issues please email us: akjdlfj@kasdjfl.com or call us @ 555.555.5555` // Todo add real values
  else message = `Your order of ${data.gift.gift_name} has been placed! To finish up the process please complete your registration and provide a billing option by clicking on the following link: ${url}?u=${data.user.id}`
  twiml.message(message)
  return twiml.toString()
}
