"use strict"

const constructGiftOptionsStr = (gifts) => {
  return gifts.reduce((str, gift) => {
    return `${str}>${gift.gift_name} -- CODE: ${gift.look_up}\n`
  }, "")
}
const constructAddressCodesOptionsStr = (addressCodes) => {
  return addressCodes.reduce((str, code) => {
    return `${str}${code}\n`
  }, "Address Codes:\n")
}

const constructSignUpGiftOptionsMessages = (userRegistered, gifts, addresses) => {
  let message = 'Hi, this is SurpriseHer, we’re excited you signed up! SurpriseHer: a simple way to keep the spark alive and remind her she’s special. You will receive a text early January with our first-ever gift list. You can start surprising her as early as next month!'

  // TODO: after december
  // if( userRegistered ) {
  //   const addressCodes = addresses.map( address => address.code_name)
  //   message = `Hey! You have successfully signed up for SurpriseHer monthly limited gift lists! Here is our curated gift selection only avalible to new signups:
  //   \n${constructGiftOptionsStr(gifts)}PRODUCT URL 
  //   \nTo begin the order process, txt back the gift CODE, the day in month you'd like us to ship and the shipping address CODE (Your address CODEs are below) you want us to send the gift to (e.g 3 ${gifts[0].look_up} ${addressCodes[0]}, 18 ${gifts[1].look_up} ${addressCodes[0]}) 
  //   \n${constructAddressCodesOptionsStr(addressCodes)}` //'
  // }
  // else {
  //   message = `Hey! You have successfully signed up for SurpriseHer monthly limited gift lists! Here is our curated gift selection only avalible to new signups:
  //   \n${constructGiftOptionsStr(gifts)}PRODUCT URL
  //   \nTo begin the order process, txt back the gift CODE and the day in month you'd like us to ship (e.g 3 ${gifts[0].look_up}, 18 ${gifts[1].look_up})` //'
  // }
  return message
}

exports.constructSignUpGiftOptionsMessages = constructSignUpGiftOptionsMessages
