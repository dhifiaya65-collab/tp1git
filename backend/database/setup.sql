-- À exécuter UNE FOIS avec : sudo mysql < backend/database/setup.sql
-- Crée la base + un utilisateur dédié (évite le problème d'auth_socket de root sous Ubuntu/WSL2)
CREATE DATABASE IF NOT EXISTS pc_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'pcshop'@'localhost' IDENTIFIED BY 'pcshop123';
CREATE USER IF NOT EXISTS 'pcshop'@'127.0.0.1' IDENTIFIED BY 'pcshop123';
GRANT ALL PRIVILEGES ON pc_shop.* TO 'pcshop'@'localhost';
GRANT ALL PRIVILEGES ON pc_shop.* TO 'pcshop'@'127.0.0.1';
FLUSH PRIVILEGES;
