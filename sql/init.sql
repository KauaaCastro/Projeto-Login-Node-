SET NAMES utf8mb4;

-- DataBase Users --
CREATE DATABASE IF NOT EXISTS Users_db;
USE Users_db;

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT(UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (name, email, password)
VALUES (
    'Kauã Ricardo',
    'kaua@gmail.com',
    '$2b$10$fZwc8NOXGDio6/w2Sc0Lxe0i83lIkX.dD9KW/kd7Uyyrg0W0EiTei'
);

ALTER TABLE users
ADD COLUMN reset_code CHAR(6) DEFAULT NULL,
ADD COLUMN reset_expires DATETIME;

-- DataBase Folders --
CREATE TABLE IF NOT EXISTS folders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    card_id INT NOT NULL
);

-- DataBase Cards --
CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    bank VARCHAR(50) NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- DataBase Purchases --
CREATE TABLE IF NOT EXISTS phFolders (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id CHAR(36) NOT NULL,
    folder_id INT NOT NULL,
    card_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id),
    FOREIGN KEY (card_id) REFERENCES cards(id)
);

-- View dinâmica (Apontando para a sua phFolders) --
CREATE OR REPLACE VIEW v_expenses_details AS
SELECT 
    p.id,
    p.user_id,
    p.description,
    p.amount,
    p.purchase_date,
    f.name AS folder_name,
    c.bank AS card_name
FROM phFolders p
JOIN folders f ON p.folder_id = f.id
JOIN cards c ON p.card_id = c.id;