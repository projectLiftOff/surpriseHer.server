"use strict"

const moment = require("moment")
const twilio = require("twilio")
const log = require("./../../config/log.js")
const httpStatus = require("../../../httpStatuses.json")
const UserErrorMessageLookUp = require("./transactions.errors.js")
const url = "idk" // todo
const digitsInPhone = 10

exports.composeSuccessMessage = composeSuccessMessage
exports.formatPhoneForQuery = formatPhoneForQuery
exports.getErrorMessage = getErrorMessage

function getErrorMessage( errorCode ) {
  errorCode = !errorCode ? 'generic' : errorCode;
  const twiml = twilio.TwimlResponse() // eslint-disable-line new-cap
  const message = UserErrorMessageLookUp[errorCode]
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
