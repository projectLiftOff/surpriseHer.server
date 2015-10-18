gentleman.server
================

Index
----------------
* [Dev Setup](#user-content-dev-setup)
* [APIs](#user-content-apis)
    * [/users](#user-content-users)
    * [/users](#user-content-users)

Dev Setup
----------------
0. `$ cd [repo]`
0. `$ npm install`
0. `$ brew install`
0. `$ mysql.server start`
0. `$ mysqladmin -u root password`
0. `$ mysql -u root`
0. `mysql> CREATE DATABASE gentleman;`
0. `mysql> use gentleman;`
0. `mysql> source db/schema.sql; source db/testData.sql;`
0. create logs/all.LOG
0. add mysql password to config/dbConnection.js
0. `$ node server/server.js`
0. `$ curl localhost:6060/users`

APIs
----------------
### /users

POST payload =
```json
{
    "tos": 1,
    "phone": 5413124834
}
```
* Note payload.tos can be 1:agreed or 0:didn't agree. *
