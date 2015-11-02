USE gentleman;

DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS gifts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS plans;

CREATE TABLE users(
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(40),
    last_name VARCHAR(40),
    email VARCHAR(40) UNIQUE,
    dob DATE,
    phone BIGINT NOT NULL UNIQUE,
    registration_complete INT(1) NOT NULL,
    tos INT(1) NOT NULL,
    braintree_id VARCHAR(40) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- processor_customer_token
    PRIMARY KEY(user_id)
);
CREATE TABLE gifts(
    gift_id BIGINT NOT NULL AUTO_INCREMENT,
    gift_name VARCHAR(60) NOT NULL,
    look_up VARCHAR(40) NOT NULL,
    month_of VARCHAR(10) NOT NULL,
    price DECIMAL(5, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (gift_id)
);
CREATE TABLE addresses(
    address_id BIGINT NOT NULL AUTO_INCREMENT,
    full_address VARCHAR(120) NOT NULL,
    address VARCHAR(120) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code BIGINT NOT NULL,
    country VARCHAR(100) NOT NULL,
    code_name VARCHAR(100) NOT NULL,
    suite VARCHAR(20),
    addressed_to VARCHAR(60),
    user_id BIGINT NOT NULL,
    PRIMARY KEY (address_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
CREATE TABLE transactions(
    transactions_id BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status VARCHAR(40) NOT NULL, -- pendingUserRegistration, unfulfilled, fulfilled, shippied, delivered
    paid INT(1) NOT NULL,
    -- refund_status
    -- charge_back
    gift_id BIGINT NOT NULL,
    address_id BIGINT,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (transactions_id),
    FOREIGN KEY(gift_id) REFERENCES gifts(gift_id),
    FOREIGN KEY(address_id) REFERENCES addresses(address_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
