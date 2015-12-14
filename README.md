gentleman.server [![Circle CI](https://circleci.com/gh/projectLiftOff/surpriseHer.server/tree/master.svg?style=svg)](https://circleci.com/gh/projectLiftOff/surpriseHer.server/tree/master)
================

Index
----------------
* [Dev Setup](#user-content-dev-setup)
* [APIs](#user-content-apis)
    * [/users](#user-content-users)
    * [/addresses](#user-content-addresses)

Dev Setup
----------------
0. `$ cd [repo]`
0. `$ npm install`
0. `$ brew install mysql`
0. `$ mysql.server start`
0. `$ mysqladmin -u root [password]`
0. `$ mysql -u root`
0. `mysql> CREATE DATABASE gentleman;`
0. `mysql> use gentleman;`
0. `mysql> source db/schema.sql; source db/testData.sql;`
0. create logs/all.LOG
0. add mysql password to config/dbConnection.js
0. `$ node server/server.js`
0. `$ curl localhost:6060/users`

Linting
----------------
- run eslint with `$ npm run lint`
- disable a specific rule for a line like so:
```javascript
const router = express.Router() // eslint-disable-line new-cap`
```

APIs
----------------
### POST /transactions
POST payload = `curl -X POST -H 'Content-Type: application/json' -d '{"From": 1234567890, "Body": "13 bottle home"}' http://localhost:6060/transactions`
```json
{
  "From": 5413124834,
  "Body": "13 bottle home"
}
```

### POST /users/incomplete
POST payload = `curl -X POST -H 'Content-Type: application/json' -d '{"tos": 1, "phone": 5413124834}' http://localhost:6060/users/incomplete`
```json
{
  "tos": 1,
  "phone": 5413124834
}
```
* Note payload.tos can be 1:agreed or 0:didn't agree. *

### POST /users/complete
POST payload = `curl -X POST -H 'Content-Type: application/json' -d '{"user": {"first_name": "Juan","last_name": "Don","email": "a@b.com","dob":  "2015-01-12","phone": "1234567890","tos": 1},"addresses": [{"full_address": "123 Main St San Francisco CA, 94103 USA","address": "123 Main St","city": "San Francisco","state": "California","zip_code": 94103,"country": "USA","code_name": "home"}],"transaction": {"shipToAddressCode": "home"},"payments": {"nonce": "fake-valid-nonce"}}' http://localhost:6060/users/complete`
```json
{
  "user": {
    "first_name": "Juan",
    "last_name": "Don",
    "email": "a@b.com",
    "dob":  "2015-01-12",
    "phone": "1234567890",
    "tos": 1
  },
  "addresses": [
    {
      "full_address": "123 Main St San Francisco CA, 94103 USA",
      "address": "123 Main St",
      "city": "San Francisco",
      "state": "California",
      "zip_code": "94103",
      "country": "USA",
      "code_name": "home"
    }
  ],
  "transaction": {
    "shipToAddressCode": "home"
  },
  "payments": {
    "nonce": "fake-valid-nonce"
  }
}
```
* Note payload.tos can be 1:agreed or 0:didn't agree. *

### PUT /users/:id
PUT payload = `curl -X PUT -H 'Content-Type: application/json' -d '{"user": {"first_name": "Tom","last_name": "Dooley","email": "tom@dooley.com","dob":  "2015-01-12"},"addresses": [{"full_address": "222 Wall St New York NY, 02111 USA","address": "222 Wall St","city": "New York","state": "New York","zip_code": "02111","country": "USA","code_name": "work"}],"transaction": {"shipToAddressCode": "work"},"payments": {"nonce": "fake-valid-nonce"}}' http://localhost:6060/users/1`
```json
{
  "user": {
      "first_name": "Tom",
      "last_name": "Dooley",
      "email": "tom@dooley.com",
      "dob":  "2015-01-12"
  },
  "addresses": [
    {
      "full_address": "222 Wall St New York NY, 02111 USA",
      "address": "222 Wall St",
      "city": "New York",
      "state": "New York",
      "zip_code": "02111",
      "country": "USA",
      "code_name": "work"
    }
  ],
  "transaction": {
    "shipToAddressCode": "work"
  },
  "payments": {
    "nonce": "fake-valid-nonce"
  }
}
```
* Notes: MISSING processor_customer_token in payload, assumes unregistered user & pending transaction have already been created*

### /addresses

POST payload = `curl -X POST -H 'Content-Type: application/json' -d '[ { "address": "006 Clemexntina St", "city": "San Francisco", "state": "California", "zip_code": 94103, "code_name": "Really Far006", "user_id": 1 }, { "address": "007 Clemexntina St", "city": "San Francisco", "state": "California", "zip_code": 94103, "code_name": "Really Far007", "user_id": 1 } ]' http://localhost:6060/addresses`
```json
[
    {
        "address": "006 Clemexntina St",
        "city": "San Francisco",
        "state": "California",
        "zip_code": 94103,
        "code_name": "Really Far006",
        "user_id": 1
    },
    {
        "address": "007 Clemexntina St",
        "city": "San Francisco",
        "state": "California",
        "zip_code": 94103,
        "code_name": "Really Far007",
        "user_id": 1
    }
]
```
