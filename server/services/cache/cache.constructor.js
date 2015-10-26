const memCache = {}
const giftsCache = {} // todo I think this does mutate in addGifts…

memCache.addGifts = gifts => {
  gifts.forEach(gift => {
    const lookupId = gift.look_up + gift.gift_id // todo chance of unintentional addition; use temples?
    giftsCache[lookupId] = gift
  })
}

memCache.getGift = lookupId => {
  return giftsCache[lookupId]
}

// memCache.hasGiftsOfMonth = monthOf => {
//   const giftsCacheKeys = Object.keys(giftsCache)
//   if (giftsCacheKeys.length === 0) { return false }
//   giftsCacheKeys.forEach(giftKey => {
//     const gift = giftsCache[giftKey]
//     if (gift.month_of !== monthOf) { return false }
//   })
//   return giftsCache[lookupId] // todo seems incomplete
// }

module.exports = memCache
