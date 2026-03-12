package com.accessmap.reportservice.models;

public enum Category {
    // Voirie
    STEP, RAMP, SIDEWALK, SIGNAGE, PARKING,
    // Transports — en panne
    ELEVATOR, ESCALATOR_BROKEN,
    // Transports — absent
    NO_ELEVATOR, NO_ESCALATOR,
    // Transports — accès
    INACCESSIBLE_ENTRY, INACCESSIBLE_PLATFORM, INACCESSIBLE_STOP, NARROW_PASSAGE
}
