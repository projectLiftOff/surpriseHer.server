/* test data */
USE gentleman;

insert into users ( phone, registration_complete, tos) values ( 5034282359, 0, 1 );
-- insert into users (first_name, last_name, email, dob, phone, registration_complete, tos) values ('Armando', 'Perez', 'aaa@aaa.com', NOW(), 5034282359, 1, 1);
insert into users (first_name, last_name, email, dob, phone, registration_complete, tos) values ('Travis', 'Ostergard', 'bbbb@bbb.com', 631958400000, 8157039039, 1, 1);
insert into users (first_name, last_name, email, dob, phone, registration_complete, tos) values ('Pedro', 'Marquez', '7438123@aaa.com', 631958400000, 7818910000, 1, 1);

insert into addresses(full_address, address, city, state, zip_code, country, code_name, user_id) values ('436.. full_address', '436 Clementina St', 'San Francisco', 'California', 94103, 'USA', 'Home', 1);
insert into addresses(full_address, address, city, state, zip_code, country, code_name, user_id) values ('407.. full_address', '407 E 11th Ave', 'Eugene', 'Oregon', 97401, 'USA', 'School Addresses', 2);
insert into addresses(full_address, address, city, state, zip_code, country, code_name, user_id) values ('234.. full_address', '407 E 11th Ave', 'Eugene', 'Oregon', 97401, 'USA', 'School Addresses', 3);

insert into gifts(gift_name, look_up, month_of, price) values ( 'The Really Cool Neckless', 'neckless', '8/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'Make Her Say WOW Picture Frame', 'frame', '8/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'Awesome Head Flower Head Ban', 'ban', '8/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'Some cool water bottle', 'bottle', '10/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'Another really cool gift', 'gift', '10/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'A f-ing amazing goldfish', 'fish', '10/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'The Best F-ing Coffee!', 'coffee', '0', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( "Love Me Some S'more", 'smores', '0', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'Bubbly Bath', 'bubbles', '0', 45);

-- insert into transactions(status, paid, gift_id, user_id) values ( 'pendingUserRegistration', 0, 1, 1 );
-- insert into transactions(status, paid, gift_id, user_id) values ( 'pendingUserRegistration', 0, 1, 4 );

