/* eslint-disable max-nested-callbacks */
/* eslint-disable handle-callback-err */
const expect = require("chai").expect
const gifts = require("../server/api/gifts/gifts.query.js")
// NOTE: for DB tests that modify data, make sure the callback's 3rd arg is txn, and call txn.rollback().
describe("gifts", () => {
  it(".getAll", done => {
    const testGiftsCount = 6
    gifts.getAll((error, result) => {
      expect(error).to.equal(null)
      expect(result.length).to.equal(testGiftsCount)
      expect(result[0]).to.include({gift_name: "The Really Cool Neckless", look_up: "neckless", month_of: "8/2015", price: 45})
      done()
    })
  })

  it(".create", done => {
    const gift = {gift_name: "some trash I found", look_up: "trash", month_of: "12/2015", price: 2}
    gifts.create(gift, (error, result, transaction) => {
      transaction.rollback()
      expect(error).to.equal(null)
      expect(result.affectedRows).to.equal(1)
      done()
    })
  })

  it(".forThisMonth", done => {
    const date = "8/2015"
    const expectedGiftCount = 3
    gifts.forThisMonth(date, (error, result) => {
      expect(error).to.equal(null)
      expect(result.length).to.equal(expectedGiftCount)
      expect(result[0]).to.include({gift_name: "The Really Cool Neckless", look_up: "neckless", month_of: "8/2015", price: 45})
      done()
    })
  })
})
