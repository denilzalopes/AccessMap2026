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
    git clone https://github.com/denilzalopes/rebijoux-regold-dashboard.git accessmap-project
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
