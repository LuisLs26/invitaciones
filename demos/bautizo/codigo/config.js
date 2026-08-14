/**
 * Configuración: Bautizo (Lucía)
 * Ruta: demos/bautizo/codigo/config.js
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
    whatsapp: "51900000001",
    whatsappMessage: "¡Hola! Confirmo mi asistencia al Bautizo de Lucía. Nombre(s): ",
    heroImage: "../imagenes/hero.jpg",
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

    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "../imagenes/galeria1.jpg", caption: "Nuestra Pequeña Lucía" },
        { url: "../imagenes/galeria2.jpg", caption: "Recuerdos en Familia" },
        { url: "../imagenes/galeria3.jpg", caption: "Con Nuestros Padrinos" }
    ],
    showMap: true,
    finalMessage: "¡Que Dios bendiga tu presencia en este día tan sagrado!"
};
