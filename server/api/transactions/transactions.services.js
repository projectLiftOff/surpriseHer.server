"use strict"

const moment = require("moment")
const twilio = require("twilio")
const log = require("./../../config/log.js")
const httpStatus = require("../../../httpStatuses.json")
const userErrorMessageLookUp = {
  phoneNumberNotFound: "Hmm... we don't seem to recognize this number... to register for awesome gifts! go to surpriseher.com",
  wrongNumberArgumentsCompleteUser: "Please only send the following info: date, gift, address. In the following format: \n \n date gift address",
  wrongNumberArgumentsIncompleteUser: "Please only send the following info: date and gift. In the following format: \n \n date gift",
  invalidDate: "You have provided an invalid date. Please correct the error and text us back!",
  invalidGiftName: "You have provided an invalid gift. Please correct the error and text us back!",
  invalidAddressCodeName: "You have provided an invalid gift. Please correct the error and text us back!",
  paymentFaild: "Hmm.. Seems like there was a problem charging your card... please contact customer support: adfkjdf@ask.com or 444444444 ",
  giftNotAvalible: "Hmm... the gift you ordered is not avalible this month, please order one of the gifts provided in this months list",
  // secondTransaction: "You have already ordered a gift this month... If you want to change your order or order an additional gift please contact customer support",
  missedOrderWindow: "Sorry but you missed the order window... but don't worry we send out a new gift list on the 25th of each month!",
  generic: "oops.. looks like there was an error please try again or contact customer support: adfkjdf@ask.com or 444444444"
}
const url = "idk" // todo
const digitsInPhone = 10

exports.createDate = () => {
  const date = {}
  const currentDate = new Date()
  date.day = currentDate.getDate()
  date.hour = currentDate.getHours()
  date.year = currentDate.getFullYear()
  date.month = currentDate.getMonth() + 1
  return date
}
exports.composeSuccessMessage = composeSuccessMessage
exports.formatPhoneForQuery = formatPhoneForQuery
exports.getErrorMessage = getErrorMessage

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
