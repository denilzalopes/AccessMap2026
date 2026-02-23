CREATE DATABASE accessmap_auth;
CREATE DATABASE accessmap_user;
CREATE DATABASE accessmap_report;
CREATE DATABASE accessmap_map;

-- Connect to accessmap_auth and create extension if not exists
\c accessmap_auth;
CREATE EXTENSION IF NOT EXISTS postgis;

-- Connect to accessmap_user and create extension if not exists
\c accessmap_user;
CREATE EXTENSION IF NOT EXISTS postgis;

-- Connect to accessmap_report and create extension if not exists
\c accessmap_report;
CREATE EXTENSION IF NOT EXISTS postgis;

-- Connect to accessmap_map and create extension if not exists
\c accessmap_map;
CREATE EXTENSION IF NOT EXISTS postgis;

-- Initial data for auth-service (example user)
-- This will be handled by the auth-service itself or a dedicated migration tool
