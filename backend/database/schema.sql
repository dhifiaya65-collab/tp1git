-- Création de la base et de la table (exécuté aussi automatiquement au démarrage du backend)
CREATE DATABASE IF NOT EXISTS pc_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pc_shop;

CREATE TABLE IF NOT EXISTS products (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150)   NOT NULL,
  brand       VARCHAR(80)    NOT NULL DEFAULT '',
  category    VARCHAR(50)    NOT NULL DEFAULT 'Accessoires',
  description TEXT           NULL,
  price       DECIMAL(10,2)  NOT NULL DEFAULT 0,
  stock       INT UNSIGNED   NOT NULL DEFAULT 0,
  image_url   VARCHAR(500)   NOT NULL DEFAULT '',
  created_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
