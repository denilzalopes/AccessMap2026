<<<<<<< HEAD
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
=======
_Ce README a été généré pour le projet AccessMap et remplace le contenu précédent._

# AccessMap - Application de Cartographie Collaborative de l'Accessibilité Urbaine

Bienvenue dans AccessMap, une application web et mobile collaborative dédiée à l'amélioration de l'accessibilité urbaine pour les personnes en situation de handicap.

## Table des Matières
1. [Stack Technique](#stack-technique)
2. [Architecture Microservices](#architecture-microservices)
3. [Modèle de Données Principal](#modèle-de-données-principal)
4. [Lancement Local avec Docker Compose](#lancement-local-avec-docker-compose)
5. [Accès aux APIs (Swagger)](#accès-aux-apis-swagger)
6. [Contraintes et Bonnes Pratiques](#contraintes-et-bonnes-pratiques)

## 1. Stack Technique

L'application est développée en utilisant les technologies suivantes, toutes en versions gratuites/open-source :

- **Back-end** : Java 17 + Spring Boot 3, API REST, architecture microservices
- **Front-end web** : React + TypeScript
- **Mobile** : PWA (Progressive Web App) depuis le front React
- **Base de données** : PostgreSQL + extension PostGIS (données géospatiales)
- **Cache** : Redis (Docker)
- **Stockage photos** : Cloudinary (free tier) - *Note: L'intégration de Cloudinary sera gérée côté front-end ou via un service dédié si nécessaire.*
- **Synthèse vocale** : Web Speech API native navigateur - *Côté front-end*
- **Cartographie** : Leaflet.js + OpenStreetMap - *Côté front-end*
- **Authentification** : Spring Security + JWT (access token 15min, refresh 7j)
- **DevOps** : Docker Compose pour lancer tout l'environnement local
- **Tests** : JUnit 5 (back), Jest (front), axe-core (accessibilité)

## 2. Architecture Microservices

Le back-end est structuré en microservices pour une meilleure modularité et scalabilité :

- **auth-service** (Port 8080) : Gère l'inscription, la connexion JWT, et les rôles utilisateurs (CONTRIBUTOR / MODERATOR / ADMIN).
- **user-service** (Port 8081) : Gère les profils utilisateurs, les préférences d'accessibilité et les statistiques.
- **report-service** (Port 8082) : Gère le CRUD (Create, Read, Update, Delete) des signalements avec coordonnées GPS (PostGIS POINT), ainsi que le système de votes.
- **map-service** (Port 8083) : Responsable de l'agrégation des données géospatiales, du clustering et des filtres pour l'affichage sur la carte.
- **notification-service** (Port 8084) : Envoie des emails de confirmation (via JavaMailSender et Mailtrap pour le développement).

## 3. Modèle de Données Principal

Voici le modèle de données principal utilisé par les microservices :

### Table `reports`
- `id` UUID PK
- `location` GEOGRAPHY(POINT, 4326) — PostGIS
- `category` ENUM (STEP, RAMP, ELEVATOR, SIDEWALK, SIGNAGE, PARKING)
- `description` TEXT nullable
- `photo_url` VARCHAR nullable (Cloudinary)
- `status` ENUM (PENDING, VALIDATED, REJECTED, RESOLVED)
- `created_by` UUID FK users
- `created_at` TIMESTAMP
- `votes_up` INT DEFAULT 0
- `votes_down` INT DEFAULT 0

### Table `users`
- `id` UUID PK
- `email` VARCHAR UNIQUE
- `password_hash` VARCHAR (BCrypt)
- `role` ENUM
- `display_name` VARCHAR
- `accessibility_prefs` JSONB
- `created_at` TIMESTAMP

### Table `votes`
- `id` UUID PK
- `report_id` UUID FK
- `user_id` UUID FK
- `type` ENUM (UP / DOWN)
- UNIQUE(`report_id`, `user_id`)

## 4. Lancement Local avec Docker Compose

Pour lancer l'ensemble de l'environnement (bases de données, Redis, et tous les microservices back-end) localement, suivez ces étapes :

1.  **Prérequis** :
    - Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine.
    - Java 17 et Maven doivent être installés pour compiler les microservices Spring Boot.

2.  **Cloner le dépôt** :
    ```bash
    git clone https://github.com/denilzalopes/AccessMap2026.git accessmap-project
    cd accessmap-project
    ```

3.  **Compiler les microservices Back-end** :
    Chaque microservice Spring Boot doit être compilé pour générer le fichier `.jar` qui sera utilisé par Docker.
    ```bash
    cd backend-microservices/auth-service
    mvn clean install
    cd ../user-service
    mvn clean install
    cd ../report-service
    mvn clean install
    cd ../map-service
    mvn clean install
    cd ../notification-service
    mvn clean install
    cd ../..
    ```

4.  **Lancer l'environnement avec Docker Compose** :
    ```bash
    docker-compose up --build
    ```
    Cette commande va construire les images Docker pour chaque microservice (si elles n'existent pas ou si le Dockerfile a changé), créer les conteneurs PostgreSQL et Redis, et lancer tous les services.

## 5. Accès aux APIs (Swagger)

Chaque microservice expose sa documentation API via Swagger UI. Une fois les services lancés, vous pouvez y accéder aux adresses suivantes :

- **auth-service** : `http://localhost:8080/swagger-ui.html`
- **user-service** : `http://localhost:8081/swagger-ui.html`
- **report-service** : `http://localhost:8082/swagger-ui.html`
- **map-service** : `http://localhost:8083/swagger-ui.html`
- **notification-service** : `http://localhost:8084/swagger-ui.html`

## 6. Contraintes et Bonnes Pratiques

- Tous les services utilisent des versions open-source et gratuites des technologies.
- Le code est commenté en français.
- Les variables d'environnement sensibles sont gérées via `.env` (ou directement dans `docker-compose.yml` pour les exemples locaux) et ne sont jamais codées en dur.
- L'application front-end (React + PWA) sera développée ultérieurement et s'intégrera avec ces microservices.
- L'approche mobile first, fonctionne aussi en desktop.
>>>>>>> 8dc75969daaaeb0db3191c2950f49b72f0e441ea
