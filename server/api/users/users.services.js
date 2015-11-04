function constructGiftOptionsStr (gifts) {
  return gifts.reduce((str, gift) => {
    return `${str}${gift.gift_name}, code: ${gift.look_up}${gift.gift_id}\n`
  }, "")
}

exports.constructSignUpGiftOptionsMessages = gifts => {
  const message = `Hey! You have successfully signed up for SurpriseHer monthly limited gift lists! Here is our curated gift selection only avalible to new signups:\n\n
  ${constructGiftOptionsStr(gifts)} PRODUCT URL\n\n
  to begin the order process, txt back the gift code and the day in month you'd like us to ship (e.g 3 ${gifts[0].look_up}${gifts[0].gift_id}, 18 ${gifts[1].look_up}${gifts[1].gift_id})`
  return message
}
