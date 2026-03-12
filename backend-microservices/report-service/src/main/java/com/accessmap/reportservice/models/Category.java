package com.accessmap.reportservice.models;

public enum Category {
    // Obstacles voirie
    STEP,           // Marche / escalier
    RAMP,           // Rampe manquante
    SIDEWALK,       // Trottoir inaccessible
    SIGNAGE,        // Signalétique inadaptée
    PARKING,        // Stationnement PMR

    // Transports publics
    ELEVATOR,           // Ascenseur en panne / absent
    ESCALATOR_BROKEN,   // Escalator en panne
    INACCESSIBLE_ENTRY, // Entrée inaccessible (station, gare)
    INACCESSIBLE_PLATFORM, // Quai inaccessible
    INACCESSIBLE_STOP,  // Arrêt de bus inaccessible
    NARROW_PASSAGE      // Couloir / passage trop étroit
}
