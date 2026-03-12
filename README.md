# 🗺️ AccessMap — Cartographie Collaborative de l'Accessibilité Urbaine

Application web et mobile collaborative pour signaler et visualiser les obstacles d'accessibilité urbaine pour les personnes en situation de handicap.

---

## 🌐 Démo en ligne

| Service | URL |
|---------|-----|
| **Frontend (Netlify)** | https://app-accessmap.netlify.app |
| **auth-service** | https://accessmap-auth.onrender.com |
| **user-service** | https://user-service-btbv.onrender.com |
| **report-service** | https://report-service-154c.onrender.com |
| **map-service** | https://map-service-y7zb.onrender.com |
| **notification-service** | https://notification-service-hhbj.onrender.com |

> Les services backend sont sur Render (free tier). Ils peuvent mettre quelques secondes à démarrer après inactivité.

---

## 🏗️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Back-end** | Java 21 + Spring Boot 4.0.1 + Spring Security 7 |
| **Base de données** | PostgreSQL 16 + PostGIS 3.3.7 (Supabase) |
| **Cache** | Redis 7.4 |
| **Front-end** | React 18 + TypeScript + Vite 5 |
| **Mobile** | PWA (Progressive Web App) |
| **Cartographie** | Leaflet.js + OpenStreetMap + CARTO Dark tiles |
| **Auth** | JWT (access 15min + refresh 7j) + BCrypt 12 |
| **Stockage photos** | Cloudinary (cloud: djp4phexi, preset: accessmap_unsigned) |
| **Emails** | Mailtrap (sandbox SMTP) |
| **Déploiement backend** | Render (Docker multi-stage) |
| **Déploiement frontend** | Netlify |

---

## 🏛️ Architecture Microservices

| Service | Port local | URL Render |
|---------|-----------|------------|
| **auth-service** | 8080 | https://accessmap-auth.onrender.com |
| **user-service** | 8081 | https://user-service-btbv.onrender.com |
| **report-service** | 8082 | https://report-service-154c.onrender.com |
| **map-service** | 8083 | https://map-service-y7zb.onrender.com |
| **notification-service** | 8084 | https://notification-service-hhbj.onrender.com |

---

## 📱 Fonctionnalités

### Carte
- Carte interactive Leaflet + OpenStreetMap (thème sombre CARTO)
- Marqueurs colorés par catégorie
- Filtres par catégorie (Marches, Rampes, Ascenseurs, Trottoirs, Signalétique, Parking)
- Bouton FAB pour créer un signalement

### Signalements
- Création avec photo (Cloudinary), description, catégorie, géolocalisation auto
- Modifier et supprimer ses propres signalements uniquement
- Statuts : En attente / Validé / Rejeté

### Communauté
- Feed de tous les signalements
- Votes 👍 / 👎 (interdit sur ses propres signalements)
- Filtres par catégorie

### Profil & Dashboard
- Statistiques : signalements créés, votes reçus, catégories, date inscription
- Paramètres : changement de mot de passe, déconnexion

---

## 🔌 Endpoints API principaux

### Auth Service
```
POST /api/auth/register
POST /api/auth/login           → accessToken, refreshToken, userId, displayName
POST /api/auth/change-password
POST /api/auth/refresh
```

### Report Service
```
GET    /api/reports
GET    /api/reports/user/{userId}
POST   /api/reports
PUT    /api/reports/{id}            (propriétaire uniquement)
DELETE /api/reports/{id}            (propriétaire uniquement)
POST   /api/reports/{id}/vote       (UP/DOWN, interdit sur ses propres signalements)
PATCH  /api/reports/{id}/status     (MODERATOR/ADMIN)
```

---

## 🚀 Démarrage local
```bash
git clone https://github.com/denilzalopes/AccessMap2026.git
cd AccessMap2026
cp .env.example .env
docker-compose up --build
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Sécurité

- JWT access 15min + refresh 7j
- BCrypt facteur 12
- Modification/suppression réservée au propriétaire
- Vote interdit sur ses propres signalements
- CORS configuré pour https://app-accessmap.netlify.app uniquement

---

## 🎨 Design System

| Variable | Valeur |
|----------|--------|
| Background | `#07071A` |
| Card | `#141435` |
| Primary | `#4B55E8` |
| Typographie | Plus Jakarta Sans |

---

## 📁 Structure
```
AccessMap2026/
├── backend-microservices/
│   ├── auth-service/
│   ├── user-service/
│   ├── report-service/
│   ├── map-service/
│   └── notification-service/
├── frontend/
│   └── src/pages/
│       ├── MapPage.tsx
│       ├── ReportFormPage.tsx
│       ├── MyReportsPage.tsx
│       ├── CommunityPage.tsx
│       ├── ProfilePage.tsx
│       └── SplashScreen.tsx
├── docker-compose.yml
└── README.md
```

---

*Développé avec ❤️ pour l'accessibilité urbaine — 100% open-source*
