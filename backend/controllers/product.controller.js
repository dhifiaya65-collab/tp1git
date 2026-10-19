const Product = require('../models/product.model');

const serverError = (res, err) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur', detail: err.message });
};

// GET /api/products?search=&category=
exports.getAll = async (req, res) => {
  try {
    res.json(await Product.findAll({ search: req.query.search, category: req.query.category }));
  } catch (err) { serverError(res, err); }
};

// GET /api/products/categories
exports.getCategories = async (_req, res) => {
  try { res.json(await Product.categories()); } catch (err) { serverError(res, err); }
};

// GET /api/products/:id
exports.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.id);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json(product);
  } catch (err) { serverError(res, err); }
};

// POST /api/products
exports.create = async (req, res) => {
  try { res.status(201).json(await Product.create(req.product)); } catch (err) { serverError(res, err); }
};

// PUT /api/products/:id
exports.update = async (req, res) => {
  try {
    const product = await Product.update(req.id, req.product);
    if (!product) return res.status(404).json({ message: 'Produit introuvable' });
    res.json(product);
  } catch (err) { serverError(res, err); }
};

// DELETE /api/products/:id
exports.remove = async (req, res) => {
  try {
    const ok = await Product.remove(req.id);
    if (!ok) return res.status(404).json({ message: 'Produit introuvable' });
    res.json({ message: 'Produit supprimé' });
  } catch (err) { serverError(res, err); }
};
