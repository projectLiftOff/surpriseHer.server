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
0. `mysql> source db/schema.sql;`
0. `mysql> source db/testData.sql;`
0. create logs/all.LOG
0. add mysql password to config/dbConnection.js
0. `$ node server/server.js`
0. `$ curl localhost:6060/users`

APIs
----------------
### /users
    
POST 
    
    payload: {
        "user": {
            "first_name": "fristName",
            "last_name": "LastName",
            "email": "someEmail@someDomain.com",
            "dob": "2015-01-12",
            "phone": 5413124834
        },
        "subscription": {
            "txt_interval": "monthly",
            "tos": 1, // 1: agreed, 0: didn't agree 
            "plan_id": 2
        }
    }

