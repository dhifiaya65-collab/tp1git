const { getPool } = require('../config/db');

const COLUMNS = 'id, name, brand, category, description, price, stock, image_url, created_at, updated_at';

exports.findAll = async ({ search, category } = {}) => {
  const where = [];
  const params = [];
  if (search) {
    where.push('(name LIKE ? OR brand LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    where.push('category = ?');
    params.push(category);
  }
  const sql =
    `SELECT ${COLUMNS} FROM products` +
    (where.length ? ` WHERE ${where.join(' AND ')}` : '') +
    ' ORDER BY id DESC';
  const [rows] = await getPool().query(sql, params);
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await getPool().query(`SELECT ${COLUMNS} FROM products WHERE id = ?`, [id]);
  return rows[0] || null;
};

exports.create = async (p) => {
  const [result] = await getPool().query(
    'INSERT INTO products (name, brand, category, description, price, stock, image_url) VALUES (?,?,?,?,?,?,?)',
    [p.name, p.brand, p.category, p.description, p.price, p.stock, p.image_url]
  );
  return exports.findById(result.insertId);
};

exports.update = async (id, p) => {
  const [result] = await getPool().query(
    `UPDATE products
        SET name = ?, brand = ?, category = ?, description = ?, price = ?, stock = ?, image_url = ?
      WHERE id = ?`,
    [p.name, p.brand, p.category, p.description, p.price, p.stock, p.image_url, id]
  );
  if (result.affectedRows === 0) return null;
  return exports.findById(id);
};

exports.remove = async (id) => {
  const [result] = await getPool().query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

exports.categories = async () => {
  const [rows] = await getPool().query('SELECT DISTINCT category FROM products ORDER BY category');
  return rows.map((r) => r.category);
};
