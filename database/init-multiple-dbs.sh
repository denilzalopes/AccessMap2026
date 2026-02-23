#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "" --dbname "" <<-EOSQL
    CREATE DATABASE accessmap_auth;
    CREATE DATABASE accessmap_user;
    CREATE DATABASE accessmap_report;
    CREATE DATABASE accessmap_map;
EOSQL

for DB in accessmap_auth accessmap_user accessmap_report accessmap_map; do
  echo "Configuring PostGIS for "
  psql -v ON_ERROR_STOP=1 --username "" --dbname "" <<-EOSQL
        CREATE EXTENSION IF NOT EXISTS postgis;
EOSQL
done
