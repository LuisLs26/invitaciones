/**
 * Configuración: Bautizo de Lucía
 * Tier: Premium (S/ 12)
 * Incluye: Música, Galería, Countdown, Itinerario, Padrinos, Iglesia/Recepción, Mapa y RSVP WhatsApp
 */
const INVITATION_CONFIG = {
    id: "bautizo",
    type: "bautizo",
    theme: "theme-bautizo",
    personName: "Bautizo de Lucía",
    title: "Mi Santo Bautizo",
    subtitle: "Con la gracia de Dios y el amor de nuestros padres y padrinos",
    date: "2026-10-25T11:00:00",
    formattedDate: "Domingo, 25 de Octubre de 2026",
    time: "11:00 AM (Misa de Bautismo)",
    locationName: "Parroquia Nuestra Señora del Pilar & Recepción Casona",
    address: "Av. Arequipa 3400, San Isidro / Villa Floral",
    mapUrl: "https://maps.google.com/?q=Parroquia+Nuestra+Senora+del+Pilar+Lima",
    whatsapp: "51944445555",
    whatsappMessage: "¡Hola! Confirmo mi asistencia al Bautizo de Lucía. Nombre(s): ",
    heroImage: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80",
    coverQuote: "Señor, protege a nuestra hija Lucía en este día bendito y guía siempre sus pasos.",
    mainMessage: "Tenemos el honor de invitarte al Santo Bautismo de nuestra amada hija Lucía. Agradecemos a Dios por su vida y nos llenaría de gozo contar con tu compañía.",
    dressCode: "Formal / Traje de Etiqueta (Colores Blancos o Claros)",
    giftInfo: "Tu presencia y bendición son nuestro mejor regalo.",
    
    // Event Timeline
    timeline: [
        { time: "11:00 AM", title: "Misa de Bautismo", description: "Parroquia Nuestra Señora del Pilar" },
        { time: "1:00 PM", title: "Almuerzo de Gala", description: "Recepción en Casona Villa Floral" },
        { time: "3:00 PM", title: "Torta & Recuerdos", description: "Bendición y brindis en honor a Lucía" }
    ],

    // Padrinos de Bautismo
    padrinos: [
        { role: "Padres de Lucía", name: "Gabriel & Milagros" },
        { role: "Padrinos de Bautismo", name: "Javier Mendoza & Andrea de Mendoza" }
    ],

    // Feature Toggles (Premium)
    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80", caption: "Nuestra Pequeña Lucía" },
        { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80", caption: "Recuerdos en Familia" },
        { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80", caption: "Con Nuestros Padrinos" }
    ],
    showMap: true,
    showVideo: false,
    video: null,
    finalMessage: "¡Que Dios bendiga tu presencia en este día tan sagrado!"
};
