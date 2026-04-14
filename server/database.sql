CREATE DATABASE IF NOT EXISTS crm_db;
USE crm_db;

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    source VARCHAR(255) DEFAULT 'Website Contact Form',
    status ENUM('new', 'contacted', 'in-progress', 'converted', 'closed') DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default admin (password: admin123)
-- In a real app, password should be hashed. We will handle registration/login in the app.
INSERT INTO admins (username, password) VALUES ('admin', '$2a$10$X8O5yK7L7K6K6K6K6K6K6Ou/O.L7L7L7L7L7L7L7L7L7L7L7L7L7'); -- Placeholder hash
