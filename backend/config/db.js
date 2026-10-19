const mysql = require('mysql2/promise');

const cfg = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};
const DB_NAME = process.env.DB_NAME || 'pc_shop';

let pool;

const SEED = [
  ['Lenovo Legion 5', 'Lenovo', 'Laptop', 'Laptop gaming 15.6" Ryzen 7, 16 Go RAM, RTX 4060', 3299.0, 8, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'],
  ['HP Pavilion Desktop', 'HP', 'PC Bureau', 'PC de bureau Core i5, 8 Go RAM, SSD 512 Go', 1599.0, 12, 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600'],
  ['Logitech MX Master 3S', 'Logitech', 'Accessoires', 'Souris sans fil ergonomique haute précision', 289.0, 25, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'],
  ['Keychron K2', 'Keychron', 'Accessoires', 'Clavier mécanique sans fil 75%', 249.0, 0, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'],
];

async function initDb() {
  // 1) Création de la base si elle n'existe pas (ignoré si l'utilisateur n'a pas ce droit
  //    mais que la base existe déjà, cf. database/setup.sql)
  try {
    const conn = await mysql.createConnection(cfg);
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await conn.end();
  } catch (err) {
    if (err.code !== 'ER_DBACCESS_DENIED_ERROR') throw err;
  }

  // 2) Pool de connexions sur la base
  pool = mysql.createPool({ ...cfg, database: DB_NAME, waitForConnections: true, connectionLimit: 10, decimalNumbers: true });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(150)  NOT NULL,
      brand       VARCHAR(80)   NOT NULL DEFAULT '',
      category    VARCHAR(50)   NOT NULL DEFAULT 'Accessoires',
      description TEXT          NULL,
      price       DECIMAL(10,2) NOT NULL DEFAULT 0,
      stock       INT UNSIGNED  NOT NULL DEFAULT 0,
      image_url   VARCHAR(500)  NOT NULL DEFAULT '',
      created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  // 3) Données de démonstration si la table est vide
  const [[{ n }]] = await pool.query('SELECT COUNT(*) AS n FROM products');
  if (n === 0) {
    await pool.query(
      'INSERT INTO products (name, brand, category, description, price, stock, image_url) VALUES ?',
      [SEED]
    );
    console.log('🌱 Produits de démonstration insérés');
  }
  console.log(`✅ MySQL connecté (base: ${DB_NAME})`);
}

const getPool = () => pool;

module.exports = { initDb, getPool };
