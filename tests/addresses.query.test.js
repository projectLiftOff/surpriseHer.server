/* eslint-disable max-nested-callbacks */
/* eslint-disable handle-callback-err */
const expect = require("chai").expect
const addresses = require("../server/api/addresses/addresses.query.js")
// NOTE: for DB tests that modify data, make sure the callback's 3rd arg is txn, and call txn.rollback().
describe("addresses", () => {
  it(".getAll", done => {
    const expectedAddressesCount = 3
    addresses.getAll((error, result) => {
      expect(error).to.equal(null)
      expect(result.length).to.equal(expectedAddressesCount)
      expect(result[0]).to.include({address: "436 Clementina St"})
      done()
    })
  })

  it(".create", done => {
    const address = {
      user_id: 1,
      code_name: "H/R",
      address: "944 market st",
      city: "san francisco",
      state: "CA",
      zip_code: 94103
    }
    addresses.create(address, (error, result, transaction) => {
      transaction.rollback()
      expect(error).to.equal(null)
      expect(result.affectedRows).to.equal(1)
      done()
    })
  })

  it(".ofUserWithPhone", done => {
    const phone = 5034282359
    addresses.ofUserWithPhone(phone, (error, result) => {
      expect(error).to.equal(null)
      expect(result[0].code_name).to.equal("Home")
      expect(result[0].user_id).to.equal(1)
      done()
    })
  })

  it(".ofUserAndCode", done => {
    const data = ["Home", 1]
    addresses.ofUserAndCode(data, (error, result) => {
      expect(error).to.equal(null)
      expect(result[0].address_id).to.equal(1)
      done()
    })
  })
})
