const Users = require("../../api/users/users.query.js")
const Gifts = require("../../api/gifts/gifts.query.js")
const TxtMessenger = require("../twilio/twilio.main.js")
const async = require("async")
const log = require("../../config/log.js")
const PRODUCT_URL = "IDK" // todo what's this?
const HOUR_11 = 11
const HOUR_12 = 12

function constructGiftOptionsString (gifts) {
  return gifts.reduce((string, gift) => {
    return `${string}${gift.gift_name}, code: ${gift.look_up + gift.gift_id}\n`
  }, "")
}

function constructAvailableGiftsMessages (user, gifts, month) {
  const message = `Hello ${user.first_name}!\n
  Just reminding you to do something for your special someone! Here is our curated gift selection for this month:\n\n
  ${constructGiftOptionsString(gifts) + PRODUCT_URL}\n\n
  txt back the gift code and the day in month you'd like us to ship (e.g 3/${month} ${gifts[0].look_up + gifts[0].gift_id}, 18/${month} ${gifts[1].look_up + gifts[1].gift_id}`
  return message
}

function sendTxtMessages (users, gifts, month) {
  users.forEach(user => {
    const message = constructAvailableGiftsMessages(user, gifts, month)
    log.info("Before sending the following message to the following user:", {user, message})
    TxtMessenger.send(user.phone, "4152148005", message, 0)
  })
}

function monthlyScheduler () {
  // Get current dateTime
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  const currentHour = currentDate.getHours()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1
  // if dateTime === 1st && 11am || 12pm
  if (currentDay === 1 && (currentHour === HOUR_11 || currentHour === HOUR_12)) {
    log.info("Beginning of the month has triggered mass-text of gifts")
    // Get all users [first_name, phone] WHERE deposit === 1 && gifts_ordered < gifts (join users, plans, subscriptions)
    // Get avalible gift options: select * from gifts where month/year === CURRENTMONTH/CURRENTYEAR
    const dateForGiftLookUp = `${currentMonth}/${currentYear}`
    const functions = [Users.availableForGifts, Gifts.forThisMonth.bind(null, dateForGiftLookUp)]
    async.parallel(functions, (error, results) => {
      if (error) { log.error("Query of Users and or Gifts for blast txt has faild:", {error}) }
      const users = results[0]
      const gifts = results[1]

      if (gifts.length === 0) {
        log.error("Gift query found no gifts")
        return
      }
      if (users.length === 0) { log.error("Users query found no Users") }
      // Setup cached Gifts
      // Construct Txt Message && Send Text Message to all users
      sendTxtMessages(users, gifts, currentMonth)
    })
  }
}

exports.monthlyScheduler = monthlyScheduler
