/* eslint-disable max-nested-callbacks */
const expect = require("chai").expect
const request = require("superagent")
const baseUrl = "http://localhost:6060"
const log = require("../../../configlog.js")
const connection = require("../../../config/dbConnection.js").connectToTestDB
const httpStatus = require("../../../httpStatuses.json")

connection.connect(error => {
  if (error) {
    log.error("db connection.connect error", {error})
  } else {
    log.debug("connected to local db")
  }
})

describe("Transactions API", () => {
  describe("When empty POST request.body: {} at /transactions", () => {
    it("should respond with error and 400", done => {
      request.post(`${baseUrl}/transactions`).end((error, res) => {
        expect(error).to.be.ok()
        expect(res).to.have.property("status", httpStatus["Bad Request"].code)
        // TODO: test error message
        done()
      })
    })
  })

  describe("When POST request.body has incorrect date", () => {
    it("should respond with error and 400", done => {
      // const data = { "Body": "32 neckless1 Home", "From": "+15034282359" }
      request.post(`${baseUrl}/transactions`).send().end((error, res) => {
        expect(error).to.be.ok()
        expect(res).to.have.property("status", httpStatus["Bad Request"].code)
        // TODO: test error message
        done()
      })
    })
  })
})
