/* eslint-disable max-nested-callbacks */
/* eslint-disable handle-callback-err */
const expect = require("chai").expect
const gifts = require("../server/api/gifts/gifts.query.js")
const pool = require("../server/config/dbPool.js")
// todo with all database tests, have to rollback after test

describe("gifts", () => {
  it(".getAll", done => {
    const testGiftsCount = 6
    gifts.getAll((error, rows) => {
      expect(error).to.equal(null)
      expect(rows.length).to.equal(testGiftsCount)
      expect(rows[0]).to.include({gift_name: "The Really Cool Neckless", look_up: "neckless", month_of: "8/2015", price: 45})
      done()
    })
  })

  it(".create", done => {
    const gift = {gift_name: "some trash I found", look_up: "trash", month_of: "12/2015", price: 2}
    gifts.create(gift, (error, rows) => {
      pool.query("DELETE FROM gifts WHERE gift_id = ?", rows.insertId, () => {}) // clean up created row
      expect(error).to.equal(null)
      expect(rows.affectedRows).to.equal(1)
      done()
    })
  })

  it(".forThisMonth", done => {
    const date = "8/2015"
    const expectedGiftCount = 3
    gifts.forThisMonth(date, (error, rows) => {
      expect(error).to.equal(null)
      expect(rows.length).to.equal(expectedGiftCount)
      expect(rows[0]).to.include({gift_name: "The Really Cool Neckless", look_up: "neckless", month_of: "8/2015", price: 45})
      done()
    })
  })
})
