"use strict"

/* eslint-disable max-nested-callbacks */
/* eslint-disable handle-callback-err */
// const OK = 200 // httpStatus = require("../httpStatuses.json")
// const app = require("express")()
// const request = require("supertest")
// const addressRoutes = require("../server/api/addresses/addresses.routes")
// app.use("/addresses", addressRoutes)
const controller = require("./../server/api/addresses/addresses.controller")
const expect = require("chai").expect
// NOTE: for DB tests that modify data, make sure the callback's 3rd arg is txn, and call txn.rollback().

// describe("address routes", () => {
//   describe("GET /", () => {
//     it("returns addresses", done => {
//       request(app)
//             .get("/addresses")
//             .set("Accept", "application/json")
//             .expect("Content-Type", /json/)
//             .expect(OK, done)
//     })
//   })
// })
xdescribe("GET addresses", () => {
  it("returns addresses", done => {
    const addressesCount = 3
    const res = {status: () => {
      return {send: results => {
        expect(results.length).to.equal(addressesCount)
        expect(results[0]).to.include({address: "436 Clementina St"})
        done()
      }
    } }}
    controller.getAll(() => {}, res)
  })
})
