/* test data */

insert into users (first_name, last_name, email, dob, phone) values ('Armando', 'Perez', 'aaa@aaa.com', NOW(), 5034282359);
insert into users (first_name, last_name, email, dob, phone) values ('Travis', 'Ostergard', 'bbbb@bbb.com', NOW(), 8157039039);
insert into users (first_name, last_name, email, dob, phone) values ('Pedro', 'Marquez', '7438123@aaa.com', NOW(), 7818910000);

insert into addresses(address, city, state, zip_code, special_packageing, nick_name, user_id) values ('436 Clementina St', 'San Francisco', 'California', 94103, 0, 'Home', 1);
insert into addresses(address, city, state, zip_code, special_packageing, nick_name, user_id) values ('407 E 11th Ave', 'Eugene', 'Oregon', 97401, 1, 'School Addresses', 2);
insert into addresses(address, city, state, zip_code, special_packageing, nick_name, user_id) values ('407 E 11th Ave', 'Eugene', 'Oregon', 97401, 1, 'School Addresses', 3);

insert into plans(plan_id, plan_name, gifts, price) values (1, 'Entry', 1, 90);
insert into plans(plan_id, plan_name, gifts, price) values (2, 'Standard', 3, 180);
insert into plans(plan_id, plan_name, gifts, price) values (3, 'Premium', 6, 320);

insert into subscriptions(txt_interval, deposit, tos, plan_id, user_id) values ('monthly', 1, 1, 2, 1);
insert into subscriptions(txt_interval, deposit, tos, plan_id, user_id) values ('monthly', 1, 1, 1, 2);

insert into gifts(gift_name, look_up, month_of) values ( 'The Really Cool Neckless', 'neckless', '8/2015');
insert into gifts(gift_name, look_up, month_of) values ( 'Make Her Say WOW Picture Frame', 'frame', '8/2015');
insert into gifts(gift_name, look_up, month_of) values ( 'Awesome Head Flower Head Ban', 'ban', '8/2015');
insert into gifts(gift_name, look_up, month_of) values ( 'Some cool water bottle', 'bottle', '9/2015');
insert into gifts(gift_name, look_up, month_of) values ( 'Another really cool gift', 'gift', '9/2015');
insert into gifts(gift_name, look_up, month_of) values ( 'A f-ing amazing goldfish', 'fish', '9/2015');

insert into transactions(gift_id, user_id) values ( 1, 1 );