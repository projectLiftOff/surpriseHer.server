USE gentleman;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS subscription_plans;
DROP TABLE IF EXISTS subscriptions;

CREATE TABLE users(
    user_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    email VARCHAR(40) NOT NULL UNIQUE,
    dob DATE NOT NULL,
    phone BIGINT NOT NULL UNIQUE,
    credit_card BIGINT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id)
);

CREATE TABLE addresses(
    address_id INT NOT NULL AUTO_INCREMENT,
    address VARCHAR(120) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code BIGINT NOT NULL,
    special_packageing BIT(1) NOT NULL,
    nick_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (address_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE subscription_plans(
    subscription_plans_id INT NOT NULL AUTO_INCREMENT,
    plan_name VARCHAR(120) NOT NULL,
    price BIGINT(100) NOT NULL,
    PRIMARY KEY (subscription_plans_id)
);

CREATE TABLE subscriptions(
    subscription_id INT NOT NULL AUTO_INCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(plan_id) REFERENCES subscription_plans(plan_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    PRIMARY KEY (subscription_id)
);

/* test data */
-- test users
-- insert into users (username, password, email, phone, credit_card) values ('armando', 'armando', 'aaa@aaa.com', 155555523, 2);
-- insert into users (username, password, email, phone, credit_card) values ('david', 'david', 'bbb@bbb.com', 325555551, 3);
-- insert into users (username, password, email, phone, credit_card) values ('mai', 'mai', 'ccc@ccc.com', 425555552, 4);
-- insert into users (username, password, email, phone, credit_card) values ('eddie', 'eddie', 'ddd@ddd.com', 255555535, 5);

-- -- test campagins
-- insert into campaigns( campaign_title, user_id, clicks, views, tablet, desktop, android, iphone, webmail ) values ( 'Winter Sale', 1, 4000, 10000, 400, 2000, 800, 700, 1000 );
-- insert into campaigns( campaign_title, user_id, clicks, views, tablet, desktop, android, iphone, webmail ) values ( 'Fall Sale', 1, 3000, 9000, 400, 1500, 600, 500, 700 );
-- insert into campaigns( campaign_title, user_id, clicks, views, tablet, desktop, android, iphone, webmail ) values ( 'Summer Sale', 1, 1000, 7000, 100, 600, 150, 130, 400 );

-- -- test ab_tests
-- insert into ab_tests( ab_test_title, campaign_id, start_time, milliseconds_after_start, milliseconds_pick_winner ) values ( 'Splash Photo', 1, '2014-11-27 11:00:00', 3600000, 500000000000 );
-- insert into ab_tests( ab_test_title, campaign_id, start_time, milliseconds_after_start, milliseconds_pick_winner ) values ( 'That One Product', 1, '2014-11-27 11:00:00', 3600000, 500000000000 );

-- -- test ab_imgs
-- -- Q: would the user rather know the number of clicks and views at the time the 'winner' was choosen
-- insert into ab_imgs( ab_test_id, clicks, views, asset_url, redirect_url ) values ( 1, 20, 100, 'https://www.google.com/logos/doodles/2014/first-day-of-autumn-2014-5193866277814272.2-res.png', 'www.google.com' );
-- insert into ab_imgs( ab_test_id, clicks, views, asset_url, redirect_url ) values ( 1, 30, 101, 'https://s.yimg.com/rz/l/yahoo_en-US_f_p_142x37.png', 'www.yahoo.com' );



