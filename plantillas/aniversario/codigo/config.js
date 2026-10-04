/**
 * Configuración: Aniversario (Elena & Roberto)
 * Ruta: demos/aniversario/codigo/config.js
 */
const INVITATION_CONFIG = {
    id: "aniversario",
    type: "aniversario",
    theme: "theme-aniversario",
    personName: "Elena & Roberto",
    title: "Bodas de Plata (25 Años)",
    subtitle: "Celebrando 25 años de amor, complicidad y vida juntos",
    date: "2026-11-28T19:30:00",
    formattedDate: "Sábado, 28 de Noviembre de 2026",
    time: "7:30 PM (Misa de Renovación & Gala)",
    locationName: "Club Suizo del Perú — Salón Principal de Gala",
    address: "Calle Manuel Ugarteche 270, Miraflores, Lima, Perú",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Club+Suizo+Miraflores+Lima+Peru",
    whatsapp: "51900000001",
    whatsappMessage: "¡Hola Elena y Roberto! Confirmo mi presencia para celebrar sus Bodas de Plata. Nombre(s): ",
    heroImage: "../imagenes/hero.jpg",
    coverQuote: "25 años construyendo una familia unida y compartiendo la alegría de vivir juntos.",
    mainMessage: "Hace 25 años dijimos 'sí' y comenzamos un camino maravilloso. Hoy queremos renovar nuestros votos y brindar por el amor junto a nuestros familiares y amigos más queridos.",
    dressCode: "Rigurosa Etiqueta / Vestido de Noche & Traje de Gala",
    giftInfo: "Cofre para Lluvia de Sobres en recepción",
    
    // Event Timeline
    timeline: [
        { time: "7:30 PM", title: "Misa de Renovación", description: "Renovación de votos matrimoniales en el Altar Mayor" },
        { time: "8:30 PM", title: "Recepción & Brindis", description: "Brindis de Plata en el Salón Principal Club Suizo" },
        { time: "9:30 PM", title: "Cena de Gala & Video", description: "Cena ejecutiva y proyección del video de recuerdos" }
    ],

    // Padrinos / Testigos
    padrinos: [
        { role: "Esposos de Honor", name: "Elena & Roberto (1999 - 2026)" },
        { role: "Testigos de Honor", name: "Gonzalo & Martha" }
    ],

    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "../imagenes/galeria1.jpg", caption: "25 Años de Amor & Baile" },
        { url: "../imagenes/galeria2.jpg", caption: "Brindis de Bodas de Plata" },
        { url: "../imagenes/galeria3.jpg", caption: "Torta Conmemorativa" },
        { url: "../imagenes/galeria4.jpg", caption: "Álbum de Recuerdos & Alianzas" }
    ],
    showMap: true,
    finalMessage: "¡Gracias por brindar con nosotros por estos 25 años de amor!"
};
