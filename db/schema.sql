USE gentleman;

DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS gifts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS plans;

CREATE TABLE users(
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(40) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    email VARCHAR(40) NOT NULL UNIQUE,
    dob DATE NOT NULL,
    phone BIGINT NOT NULL UNIQUE,
    credit_card BIGINT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY(user_id)
);
CREATE TABLE plans(
    plan_id BIGINT NOT NULL,
    plan_name VARCHAR(120) NOT NULL,
    gifts INT(2) NOT NULL,
    price BIGINT(100) NOT NULL,
    PRIMARY KEY (plan_id)
);
CREATE TABLE gifts(
    gift_id BIGINT NOT NULL AUTO_INCREMENT,
    gift_name VARCHAR(60) NOT NULL,
    look_up VARCHAR(40) NOT NULL,
    month_of VARCHAR(10) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (gift_id)
);
CREATE TABLE addresses(
    address_id BIGINT NOT NULL AUTO_INCREMENT,
    address VARCHAR(120) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code BIGINT NOT NULL,
    special_packageing INT(1) NOT NULL,
    nick_name VARCHAR(100) NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (address_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
CREATE TABLE subscriptions(
    subscription_id BIGINT NOT NULL AUTO_INCREMENT,
    txt_interval VARCHAR(40) NOT NULL,
    deposit INT(1),
    tos INT(1) NOT NULL,
    gifts_ordered BIGINT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    plan_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (subscription_id),
    FOREIGN KEY(plan_id) REFERENCES plans(plan_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
