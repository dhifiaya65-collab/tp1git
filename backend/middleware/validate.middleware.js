// Valide et normalise le corps de la requête pour POST / PUT
exports.validateProduct = (req, res, next) => {
  const b = req.body || {};
  const errors = [];

  const name = String(b.name ?? '').trim();
  if (!name) errors.push('Le nom est obligatoire');
  if (name.length > 150) errors.push('Le nom est trop long (150 max)');

  const price = Number(b.price);
  if (b.price === undefined || b.price === '' || Number.isNaN(price) || price < 0)
    errors.push('Le prix doit être un nombre >= 0');

  const stock = Number(b.stock ?? 0);
  if (!Number.isInteger(stock) || stock < 0) errors.push('Le stock doit être un entier >= 0');

  if (errors.length) return res.status(400).json({ message: 'Données invalides', errors });

  req.product = {
    name,
    brand: String(b.brand ?? '').trim(),
    category: String(b.category ?? 'Accessoires').trim() || 'Accessoires',
    description: String(b.description ?? '').trim(),
    price,
    stock,
    image_url: String(b.image_url ?? '').trim(),
  };
  next();
};

// Vérifie que :id est un entier positif
exports.validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'ID invalide' });
  req.id = id;
  next();
};
