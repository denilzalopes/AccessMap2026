# 🗺️ AccessMap — Cartographie Collaborative de l'Accessibilité Urbaine

Application web et mobile collaborative pour signaler et visualiser les obstacles d'accessibilité urbaine.

---

## 🌐 Démo en ligne

| Service | URL |
|---------|-----|
| **Frontend** | https://app-accessmap.netlify.app |
| **auth-service** | https://accessmap-auth.onrender.com |
| **report-service** | https://report-service-154c.onrender.com |

---

## 🏗️ Stack Technique

- Java 21 + Spring Boot 4.0.1 + Spring Security 7
- PostgreSQL 16 + PostGIS (Supabase)
- React 18 + TypeScript + Vite 5 (PWA)
- Leaflet.js + OpenStreetMap + Photon API (adresses)
- Cloudinary (photos), Mailtrap (emails)
- Render (backend), Netlify (frontend)

---

## 📱 Fonctionnalités

### Carte
- Carte interactive Leaflet thème sombre
- Marqueurs colorés par catégorie
- Filtres : Voirie + Transports publics
- Recherche de lieu avec autocomplétion
- Flow : rechercher un lieu → cliquer "Signaler ici"

### Signalements
- Catégories **Voirie** : Marche, Rampe, Trottoir, Signalétique, Parking
- Catégories **Transports publics** : Ascenseur/Escalator en panne ou absent, Entrée/Quai/Arrêt inaccessible, Passage étroit
- Adresses réelles (Photon API) au lieu des coordonnées brutes
- Photo via Cloudinary, géolocalisation auto
- Modifier/supprimer ses propres signalements uniquement

### Communauté
- Feed des signalements **validés** uniquement
- Votes 👍 / 👎 (interdit sur ses propres signalements)
- Filtres par catégorie

### Admin / Modération
- Page dédiée ADMIN/MODERATOR
- Valider ou rejeter les signalements en attente
- Notifications email automatiques à l'auteur

### Profil
- Dashboard différent selon rôle (ADMIN vs CONTRIBUTOR)
- Statistiques personnelles
- Changement de mot de passe

---

## 🔌 Endpoints API
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/change-password

GET    /api/reports
GET    /api/reports/user/{userId}
GET    /api/reports/pending?requesterRole=ADMIN
POST   /api/reports
PUT    /api/reports/{id}
DELETE /api/reports/{id}?userId={userId}
POST   /api/reports/{id}/vote?userId=...&type=UP|DOWN
PATCH  /api/reports/{id}/status?status=...&requesterRole=...
```

---

## 🎨 Design System

| Variable | Valeur |
|----------|--------|
| Background | `#07071A` |
| Card | `#141435` |
| Primary | `#4B55E8` |
| Typographie | Plus Jakarta Sans |

---

## 🔐 Sécurité

- JWT access 15min + refresh 7j
- BCrypt facteur 12
- Modification/suppression réservée au propriétaire
- CORS configuré pour https://app-accessmap.netlify.app

---

*Développé avec ❤️ pour l'accessibilité urbaine — 100% open-source*
