package com.accessmap.authservice.models;

/** Rôles disponibles dans l'application AccessMap */
public enum Role {
    CONTRIBUTOR,   // Contributeur standard
    MODERATOR,     // Modérateur (valide/rejette les signalements)
    ADMIN          // Administrateur complet
}
