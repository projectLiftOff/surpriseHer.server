global.Twilio = require("twilio")(process.env.twilio_account_sid, process.env.twilio_auth_token)
const from = `+1${process.env.twilio_phone_number}`
// const timesToRetry = 3

function sendTxt (to, body, callback) {
  to = `+1${to}`
  global.Twilio.sendMessage({to, from, body}, callback)
}

module.exports = {sendTxt}
