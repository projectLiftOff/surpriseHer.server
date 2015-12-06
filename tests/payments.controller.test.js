"use strict"
/* eslint-disable max-nested-callbacks */
/* eslint-disable handle-callback-err */
const expect = require("chai").expect
require("../server/config/environment.setup.js")()
const controller = require("./../server/api/payments/payments.controller")
const httpStatus = require("../httpStatuses.json")

describe("payments.controller.createCustomer", () => {
  it("creates the customer", done => {
    const req = {
      body: {
        payment_method_nonce: "fake-valid-nonce"
      }
    }
    const res = {
      send: results => {
        expect(results).to.equal(httpStatus.OK.code)
        done()
      }
    }
    controller.createCustomer(req, res)
  })
  xit("reports error if can`t create customer", done => {
    const req = {
      body: {
        payment_method_nonce: "fake-processor-declined-visa-nonce"
      }
    }
    const res = {
      send: results => {
        expect(results).to.equal(httpStatus["Bad Request"].code)
        done()
      }
    }
    controller.createCustomer(req, res)
  })
})

describe("payments.controller.checkout", () => {
  it("charges a customer", done => {
    const req = {
      body: {
        payment_method_nonce: "fake-valid-nonce"
      }
    }
    const res = {
      send: results => {
        expect(results).to.equal(httpStatus.OK.code)
        done()
      }
    }
    controller.checkout(req, res)
  })
  it("reports error if can`t checkout", done => {
    const req = {
      body: {
        payment_method_nonce: "fake-luhn-invalid-nonce" // "fake-processor-declined-visa-nonce"
      }
    }
    const res = {
      send: results => {
        expect(results).to.equal(httpStatus["Bad Request"].code)
        done()
      }
    }
    controller.checkout(req, res)
  })
})
