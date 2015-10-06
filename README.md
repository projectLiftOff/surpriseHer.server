# gentleman.server

## Dev Setup
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
0. create logs/all.log
0. add mysql password to config/dbConnection.js
0. `$ node server/server.js`
0. `$ curl localhost:6060/users`
