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
    locationName: "Parroquia Santa María Reina & Salón de Recepciones",
    address: "Av. Los Conquistadores 1293, San Isidro, Lima, Perú",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Parroquia+Santa+Maria+Reina+San+Isidro+Lima+Peru",
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
        { time: "1:00 PM", title: "Almuerzo de Gala", description: "Recepción en el Salón Parroquial Los Conquistadores" },
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
        { url: "../imagenes/galeria1.jpg", caption: "Vela y Bendición de Bautizo" },
        { url: "../imagenes/galeria2.jpg", caption: "Mesa de Recepción & Flores" },
        { url: "../imagenes/galeria3.jpg", caption: "Torta Sagrada de Bautizo" }
    ],
    showMap: true,
    finalMessage: "¡Que Dios bendiga tu presencia en este día tan sagrado!"
};
