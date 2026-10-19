require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/products', require('./routes/product.routes'));

app.use((_req, res) => res.status(404).json({ message: 'Route introuvable' }));

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => app.listen(PORT, () => console.log(`🚀 API sur http://localhost:${PORT}/api/products`)))
  .catch((err) => {
    console.error('❌ Erreur MySQL :', err.message);
    console.error('   Vérifie que MySQL tourne (sudo service mysql start) et les infos du fichier .env');
    process.exit(1);
  });
