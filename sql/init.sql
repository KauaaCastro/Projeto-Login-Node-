SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS Users_db;

USE Users_db;

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT(UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
    users (name, email, password)
VALUES (
        'Kauã Ricardo',
        'kaua@gmail.com',
        '$2b$10$fZwc8NOXGDio6/w2Sc0Lxe0i83lIkX.dD9KW/kd7Uyyrg0W0EiTei'
    );

INSERT INTO
    users (name, email, password)
VALUES (
        'admTest',
        'teste@gmail.com',
        '$2b$10$fZwc8NOXGDio6/w2Sc0Lxe0i83lIkX.dD9KW/kd7Uyyrg0W0EiTei'
    );

ALTER TABLE users
ADD COLUMN reset_code CHAR(6) DEFAULT NULL,
ADD COLUMN reset_expires DATETIME;