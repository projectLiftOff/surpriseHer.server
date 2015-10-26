/* eslint-disable max-nested-callbacks */
/* eslint-disable handle-callback-err */
const expect = require("chai").expect
const pool = require("../server/config/dbPool.js")

describe("queries", () => {
  describe("with a sqlString and callback", () => {
    it("passes rows to callback", done => {
      pool.query("SELECT * FROM gifts", (error, rows) => { // eslint-disable-line handle-callback-err
        expect(rows.length > 0).to.equal(true)
        done()
      })
    })

    it("handles a bad query", done => {
      pool.query("SELECT * FROM doesnt_exist", error => {
        expect(error).not.to.equal(null)
        done()
      })
    })
  })

  describe("with sqlString, values, and callback", () => {
    it("passes rows to callback", done => {
      pool.query("SELECT * FROM gifts where gift_id = ?", 2, (error, rows) => { // eslint-disable-line handle-callback-err
        expect(rows.length > 0).to.equal(true)
        done()
      })
    })

    it("handles a bad query", done => {
      pool.query("SELECT * FROM doesnt_exist", error => {
        expect(error).not.to.equal(null)
        done()
      })
    })
  })

  describe("with options and callback", () => {
    it("passes rows to callback", done => {
      pool.query({sql: "SELECT * FROM gifts where gift_id = ?", values: [2]}, (error, rows) => { // eslint-disable-line handle-callback-err
        expect(rows.length > 0).to.equal(true)
        done()
      })
    })

    it("handles a bad query", done => {
      pool.query("SELECT * FROM doesnt_exist", error => {
        expect(error).not.to.equal(null)
        done()
      })
    })
  })
})
