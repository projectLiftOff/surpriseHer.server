const client = require("twilio")(process.env.twilio_account_sid, process.env.twilio_auth_token)
const from = `+1${process.env.twilio_phone_number}`
// const timesToRetry = 3

sendTxt = (to, body, callback) => {
  to = `+1${to}`
  client.sendMessage({ to, from, body}, callback);
}
exports.sendTxt = sendTxt
