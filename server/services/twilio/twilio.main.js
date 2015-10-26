const client = require("twilio")(process.env.twilio_account_sid, process.env.twilio_auth_token)
const log = require("../../config/log.js")
const timesToRetry = 3

function send (to, from, body, attempts) {
  client.sendMessage({
    to: `+1${to}`,
    from: `+1${from}`,
    body
  }, error => {
    if (error) {
      log.error("Sending Monthly Options text using twilio falied", {error}, {to, from, message: body, resendAttempts: attempts})
      // Retry sending
      if (attempts < timesToRetry) {
        attempts = attempts + 1
        send(to, from, body, attempts)
      }
    } else {
      // TODO: log successful message sent in db
      log.info("Monthly Options text message was sent successfuly", {to, from, message: body, resendAttempts: attempts})
    }
  })
}

exports.send = send
