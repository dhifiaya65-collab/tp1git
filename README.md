# 🖥️ PC Shop — TP1 CRUD Full Stack (WSL2)

Application de gestion de produits (CRUD) : **Angular 20** + **Node.js / Express** + **MySQL**.

```
pc-shop-mysql/
├── backend/    API REST (Express + mysql2)
│   ├── config/db.js            connexion MySQL + création auto de la table + données de démo
│   ├── models/                 requêtes SQL (paramétrées)
│   ├── controllers/            logique des endpoints
│   ├── routes/                 définition des routes REST
│   ├── middleware/             validation des données
│   ├── database/               schema.sql + setup.sql
│   └── .env                    configuration (port, accès MySQL)
└── frontend/   Angular (liste, détail, formulaire ajout/modification)
```

## API REST

| Méthode | URL                    | Action                          |
|---------|------------------------|---------------------------------|
| GET     | /api/products          | Liste (`?search=` `&category=`) |
| GET     | /api/products/:id      | Consulter un produit            |
| POST    | /api/products          | Ajouter                         |
| PUT     | /api/products/:id      | Modifier                        |
| DELETE  | /api/products/:id      | Supprimer                       |

## Installation dans WSL2 Ubuntu

### 1. Prérequis
```bash
sudo apt update
sudo apt install -y mysql-server curl
# Node.js 20+ (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc && nvm install 20
```

### 2. Démarrer MySQL et créer la base + l'utilisateur
```bash
sudo service mysql start
sudo mysql < backend/database/setup.sql
```
> Cela crée la base `pc_shop` et l'utilisateur `pcshop` / `pcshop123` (identiques à `backend/.env`).

### 3. Backend
```bash
cd backend
npm install
npm start          # http://localhost:5000
```
Au premier démarrage la table `products` est créée et 4 produits de démo sont insérés.

### 4. Frontend (nouveau terminal)
```bash
cd frontend
npm install
npx ng serve       # http://localhost:4200
```
Ouvrir **http://localhost:4200** dans le navigateur Windows (WSL2 redirige localhost automatiquement).

## Tests CRUD avec curl
```bash
A=http://localhost:5000/api/products
curl $A                                                     # lister
curl $A/1                                                   # consulter
curl -X POST $A -H 'Content-Type: application/json' \
  -d '{"name":"RTX 4070","brand":"Nvidia","category":"Composants","price":1899.5,"stock":3}'   # ajouter
curl -X PUT $A/5 -H 'Content-Type: application/json' \
  -d '{"name":"RTX 4070 Super","brand":"Nvidia","category":"Composants","price":2099,"stock":7}' # modifier
curl -X DELETE $A/5                                         # supprimer
```
Vérifier dans MySQL : `mysql -upcshop -ppcshop123 pc_shop -e "SELECT * FROM products;"`

## Dépannage
- `ECONNREFUSED 3306` → MySQL n'est pas lancé : `sudo service mysql start`
- `Access denied` → relancer `sudo mysql < backend/database/setup.sql`
- Le frontend affiche « Impossible de contacter le backend » → vérifier que `npm start` tourne dans `backend/`
# tp111git
