/* test data */

insert into users (first_name, last_name, email, dob, phone) values ('Armando', 'Perez', 'aaa@aaa.com', NOW(), 5034282359);
insert into users (first_name, last_name, email, dob, phone) values ('Travis', 'Ostergard', 'bbbb@bbb.com', NOW(), 5055059999);
insert into users (first_name, last_name, email, dob, phone) values ('Pedro', 'Marquez', '7438123@aaa.com', NOW(), 7818910000);

insert into addresses(address, city, state, zip_code, special_packageing, nick_name, user_id) values ('436 Clementina St', 'San Francisco', 'California', 94103, 0, 'Home', 1);
insert into addresses(address, city, state, zip_code, special_packageing, nick_name, user_id) values ('407 E 11th Ave', 'Eugene', 'Oregon', 97401, 1, 'School Addresses', 3);
