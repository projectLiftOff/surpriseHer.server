/* test data */
USE gentleman;

insert into users ( phone, registration_complete, tos) values ( 1234567890, 0, 1 );
insert into users (first_name, last_name, email, dob, phone, registration_complete, tos) values ('Armando', 'Perez', 'Armando@Perez.com', CURDATE(), 5034282359, 1, 1);
insert into users (first_name, last_name, email, dob, phone, registration_complete, tos) values ('Travis', 'Ostergard', 'bbbb@bbb.com', '1999-09-09', 8157039039, 1, 1);
insert into users (first_name, last_name, email, dob, phone, registration_complete, tos) values ('Pedro', 'Marquez', '7438123@aaa.com', '1988-08-08', 7818910000, 1, 1);
insert into users (first_name, last_name, email, dob, phone, registration_complete, tos) values ('Mike', 'Luby', 'no@no.co', '1977-07-07', 1231231234, 0, 1);

insert into addresses(full_address, address, city, state, zip_code, country, code_name, user_id) values ('436.. full_address', '436 Clementina St', 'San Francisco', 'California', 94103, 'USA', 'home', 2);
insert into addresses(full_address, address, city, state, zip_code, country, code_name, user_id) values ('407.. full_address', '407 E 11th Ave', 'Eugene', 'Oregon', 97401, 'USA', 'school', 2);
insert into addresses(full_address, address, city, state, zip_code, country, code_name, user_id) values ('234.. full_address', '407 E 11th Ave', 'Eugene', 'Oregon', 97401, 'USA', 'school', 3);

insert into gifts(gift_name, look_up, month_of, price) values ( 'The Really Cool Neckless', 'neckless', '8/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'Make Her Say WOW Picture Frame', 'frame', '8/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'Awesome Head Flower Head Ban', 'ban', '8/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'Some cool water bottle', 'bottle', '10/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'Another really cool gift', 'gift', '10/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'A f-ing amazing goldfish', 'fish', '10/2015', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'The Best F-ing Coffee!', 'coffee', '0', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( "Love Me Some S'more", 'smores', '0', 45);
insert into gifts(gift_name, look_up, month_of, price) values ( 'Bubbly Bath', 'bubbles', '0', 45);

insert into transactions(status, paid, gift_id, user_id) values ( 'pending user registration', 1, 1, 1 );
insert into transactions(status, paid, gift_id, user_id) values ( 'pending user registration', 0, 2, 2 );
insert into transactions(status, paid, gift_id, user_id) values ( 'pending user registration', 0, 3, 3 );
