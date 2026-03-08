# 🗺️ AccessMap — Cartographie Collaborative de l'Accessibilité Urbaine

Application web et mobile collaborative pour signaler et visualiser les obstacles d'accessibilité urbaine pour les personnes en situation de handicap.

## 🚀 Démarrage rapide (une seule commande)

```bash
# 1. Cloner le projet
git clone https://github.com/denilzalopes/AccessMap2026.git
cd AccessMap2026

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env et remplir JWT_SECRET (obligatoire) et les credentials Mailtrap

# 3. Générer le JWT secret
openssl rand -base64 64

# 4. Lancer tout l'environnement
docker-compose up --build
```

L'application sera disponible sur **http://localhost:3000** 🎉

---

## 🏗️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Back-end** | Java 21 + Spring Boot 4.0.1 + Spring Security 7 |
| **Base de données** | PostgreSQL 16 + PostGIS 3.4 |
| **Cache** | Redis 7.4 |
| **Front-end** | React 18 + TypeScript + Vite |
| **Mobile** | PWA (Progressive Web App) |
| **Cartographie** | Leaflet.js + OpenStreetMap (gratuit) |
| **Auth** | JWT (access 15min + refresh 7j) |
| **Emails dev** | Mailtrap (gratuit) |
| **Stockage photos** | Cloudinary (free tier) |
| **DevOps** | Docker Compose |

---

## 🏛️ Architecture Microservices

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend React PWA                        │
│                  http://localhost:3000                       │
└──────────────┬──────────────────────────────────────────────┘
               │ Nginx reverse proxy
       ┌───────▼────────────────────────────────────────┐
       │              API Gateway (Nginx)                │
       └──┬──────┬──────┬──────┬──────────────────────┘
          │      │      │      │
    ┌─────▼─┐ ┌──▼──┐ ┌▼────┐ ┌▼─────┐ ┌────────────┐
    │ auth  │ │user │ │reprt│ │ map │ │notification│
    │ :8080 │ │:8081│ │:8082│ │:8083│ │    :8084   │
    └───┬───┘ └──┬──┘ └──┬──┘ └──┬──┘ └─────┬──────┘
        │        │        │        │           │
        └────────┴────────┴────┬───┘           │
                               ▼               │
                    ┌──────────────────┐       │
                    │   PostgreSQL     │       │
                    │  + PostGIS 16    │    Redis
                    └──────────────────┘
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **auth-service** | 8080 | Inscription, connexion JWT, rôles |
| **user-service** | 8081 | Profils, préférences accessibilité |
| **report-service** | 8082 | CRUD signalements + votes + PostGIS |
| **map-service** | 8083 | Agrégation géospatiale pour Leaflet |
| **notification-service** | 8084 | Emails via JavaMailSender + Mailtrap |

---

## 📚 API Documentation (Swagger)

Une fois les services lancés :

| Service | Swagger UI |
|---------|-----------|
| auth-service | http://localhost:8080/swagger-ui.html |
| user-service | http://localhost:8081/swagger-ui.html |
| report-service | http://localhost:8082/swagger-ui.html |
| map-service | http://localhost:8083/swagger-ui.html |
| notification-service | http://localhost:8084/swagger-ui.html |

---

## 🗄️ Modèle de Données

### Table `reports` (accessmap_report)
```sql
id           UUID PK
location     GEOMETRY(POINT, 4326)  -- PostGIS WGS84
category     ENUM (STEP, RAMP, ELEVATOR, SIDEWALK, SIGNAGE, PARKING)
description  TEXT nullable
photo_url    VARCHAR nullable (Cloudinary)
status       ENUM (PENDING, VALIDATED, REJECTED, RESOLVED)
created_by   UUID FK
created_at   TIMESTAMP
votes_up     INT DEFAULT 0
votes_down   INT DEFAULT 0
```

### Table `users` (accessmap_auth)
```sql
id                   UUID PK
email                VARCHAR UNIQUE
password_hash        VARCHAR (BCrypt 12)
role                 ENUM (CONTRIBUTOR, MODERATOR, ADMIN)
display_name         VARCHAR
accessibility_prefs  JSONB
created_at           TIMESTAMP
```

---

## 📱 Fonctionnalités Front-End

- **Onboarding** — 3 slides de présentation
- **Carte principale** — Leaflet + OpenStreetMap, marqueurs colorés par statut
- **Filtres** — chips de filtre par catégorie d'obstacle
- **FAB** — bouton flottant "+" pour signaler
- **Formulaire de signalement** — géolocalisation auto + grille catégories + micro (Web Speech API)
- **Mes signalements** — liste + stats personnelles
- **Communauté** — leaderboard des contributeurs
- **Profil** — préférences d'accessibilité (haute visibilité, lecture vocale, taille texte)
- **PWA** — installable sur mobile, cache offline des tuiles OSM

---

## ♿ Accessibilité (WCAG 2.1 AAA)

- ARIA labels sur tous les éléments interactifs
- Navigation clavier complète (tabindex, focus visible)
- Mode haute visibilité (toggle profil)
- Lecture vocale via Web Speech API
- Taille de texte dynamique (3 niveaux : S / M / L)
- Touch targets minimum 44×44px
- Contraste ≥ 7:1 (AAA)
- Labels visibles au-dessus des champs de formulaire

---

## 🔧 Développement local (sans Docker)

### Backend
```bash
# Prérequis : Java 21, Maven, PostgreSQL 16 + PostGIS

cd backend-microservices/auth-service
export APP_JWT_SECRET=$(openssl rand -base64 64)
mvn spring-boot:run

# Répéter pour les autres services
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## 🔐 Sécurité

- Tokens JWT — access 15min + refresh 7j
- BCrypt avec facteur de coût 12
- Credentials via variables d'environnement (jamais en dur)
- Spring Security 7 avec stateless sessions
- CORS configuré pour le frontend uniquement
- `.env` dans `.gitignore`

---

## 📁 Structure du Monorepo

```
AccessMap2026/
├── backend-microservices/
│   ├── auth-service/          Java 21 + Spring Boot 4.0.1
│   ├── user-service/
│   ├── report-service/        + PostGIS / JTS
│   ├── map-service/           + WebFlux
│   └── notification-service/  + JavaMailSender
├── frontend/                  React 18 + TypeScript + Vite + PWA
├── database/
│   └── init.sql               Schéma PostgreSQL + données de test
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 👤 Compte de test

Après `docker-compose up`, deux comptes sont disponibles :

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@accessmap.app | Test1234! | ADMIN |
| denilza@accessmap.app | Test1234! | CONTRIBUTOR |

---

*Développé avec ❤️ pour l'accessibilité urbaine — 100% open-source*
