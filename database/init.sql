-- ═══════════════════════════════════════════════════════════════════════════
--  AccessMap — Script d'initialisation PostgreSQL + PostGIS
--  Exécuté automatiquement au démarrage du conteneur PostgreSQL
-- ═══════════════════════════════════════════════════════════════════════════

-- Créer les bases de données pour chaque microservice
CREATE DATABASE accessmap_user;
CREATE DATABASE accessmap_report;
CREATE DATABASE accessmap_map;
CREATE DATABASE accessmap_notification;

-- ── Base auth ────────────────────────────────────────────────────────────────
\c accessmap_auth;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS users (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email            VARCHAR(255) UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    role             VARCHAR(20)  NOT NULL DEFAULT 'CONTRIBUTOR'
                        CHECK (role IN ('CONTRIBUTOR','MODERATOR','ADMIN')),
    display_name     VARCHAR(100) NOT NULL,
    accessibility_prefs JSONB DEFAULT '{}'::jsonb,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_users_email ON users(email);

-- ── Base user ────────────────────────────────────────────────────────────────
\c accessmap_user;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Même schéma users que auth (partagé, mais chaque service a sa propre BDD)
CREATE TABLE IF NOT EXISTS users (
    id               UUID PRIMARY KEY,
    email            VARCHAR(255) UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    role             VARCHAR(20)  NOT NULL DEFAULT 'CONTRIBUTOR',
    display_name     VARCHAR(100) NOT NULL,
    accessibility_prefs JSONB DEFAULT '{}'::jsonb,
    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW()
);

-- ── Base report ──────────────────────────────────────────────────────────────
\c accessmap_report;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS reports (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- GEOMETRY(POINT,4326) — WGS84 standard GPS
    location     GEOMETRY(POINT, 4326) NOT NULL,
    category     VARCHAR(20) NOT NULL
                    CHECK (category IN ('STEP','RAMP','ELEVATOR','SIDEWALK','SIGNAGE','PARKING')),
    description  TEXT,
    photo_url    VARCHAR(500),
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING','VALIDATED','REJECTED','RESOLVED')),
    created_by   UUID NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW(),
    votes_up     INTEGER NOT NULL DEFAULT 0 CHECK (votes_up >= 0),
    votes_down   INTEGER NOT NULL DEFAULT 0 CHECK (votes_down >= 0)
);

-- Index spatial GIST pour les requêtes géographiques
CREATE INDEX IF NOT EXISTS idx_reports_location   ON reports USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_reports_status     ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category   ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON reports(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

CREATE TABLE IF NOT EXISTS votes (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id  UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL,
    type       VARCHAR(4) NOT NULL CHECK (type IN ('UP','DOWN')),
    UNIQUE (report_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_report ON votes(report_id);

-- ── Base map ─────────────────────────────────────────────────────────────────
\c accessmap_map;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- ── Base notification ─────────────────────────────────────────────────────────
\c accessmap_notification;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Historique des notifications envoyées
CREATE TABLE IF NOT EXISTS notification_logs (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient  VARCHAR(255) NOT NULL,
    subject    VARCHAR(200) NOT NULL,
    type       VARCHAR(50),
    sent_at    TIMESTAMP DEFAULT NOW(),
    success    BOOLEAN DEFAULT true
);

-- ── Données de test (développement) ─────────────────────────────────────────
\c accessmap_auth;

-- Utilisateur de test (mot de passe : Test1234! — BCrypt)
INSERT INTO users (id, email, password_hash, role, display_name, accessibility_prefs)
VALUES
    ('00000000-0000-0000-0000-000000000001',
     'admin@accessmap.app',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NLr.2RSqy',
     'ADMIN',
     'Admin AccessMap',
     '{"highVisibility":false,"voiceReading":false,"textSize":"medium"}'),
    ('00000000-0000-0000-0000-000000000002',
     'denilza@accessmap.app',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NLr.2RSqy',
     'CONTRIBUTOR',
     'Denilza Lopes',
     '{"highVisibility":false,"voiceReading":false,"textSize":"medium"}')
ON CONFLICT (email) DO NOTHING;

\c accessmap_report;

-- Signalements de test à Paris
INSERT INTO reports (id, location, category, description, status, created_by, votes_up)
VALUES
    (gen_random_uuid(), ST_SetSRID(ST_MakePoint(2.3522, 48.8566), 4326), 'RAMP',     'Rampe d''accès dégradée devant la mairie',    'VALIDATED', '00000000-0000-0000-0000-000000000002', 5),
    (gen_random_uuid(), ST_SetSRID(ST_MakePoint(2.3400, 48.8600), 4326), 'STEP',     'Marche non signalée à l''entrée du métro',   'PENDING',   '00000000-0000-0000-0000-000000000002', 2),
    (gen_random_uuid(), ST_SetSRID(ST_MakePoint(2.3600, 48.8520), 4326), 'ELEVATOR', 'Ascenseur hors service depuis 2 semaines',   'VALIDATED', '00000000-0000-0000-0000-000000000001', 8),
    (gen_random_uuid(), ST_SetSRID(ST_MakePoint(2.3440, 48.8580), 4326), 'PARKING',  'Emplacement PMR occupé par un véhicule non autorisé', 'PENDING', '00000000-0000-0000-0000-000000000002', 3),
    (gen_random_uuid(), ST_SetSRID(ST_MakePoint(2.3580, 48.8640), 4326), 'SIDEWALK', 'Trottoir obstrué par des travaux sans déviatio', 'RESOLVED', '00000000-0000-0000-0000-000000000001', 12)
ON CONFLICT DO NOTHING;
