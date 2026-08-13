/**
 * Configuración: Bodas de Plata / Aniversario (Elena & Roberto)
 * Tier: Premium+ (S/ 20)
 * Incluye: Música, Galería, Countdown, Video, Itinerario, Testigos de Honor, Mapa y RSVP WhatsApp
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
    locationName: "Casona de Gala Los Virreyes & Salón Real",
    address: "Av. El Golf 540, San Isidro, Lima",
    mapUrl: "https://maps.google.com/?q=San+Isidro+Lima",
    whatsapp: "51955556666",
    whatsappMessage: "¡Hola Elena y Roberto! Confirmo mi presencia para celebrar sus Bodas de Plata. Nombre(s): ",
    heroImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
    coverQuote: "25 años construyendo una familia unida y compartiendo la alegría de vivir juntos.",
    mainMessage: "Hace 25 años dijimos 'sí' y comenzamos un camino maravilloso. Hoy queremos renovar nuestros votos y brindar por el amor junto a nuestros familiares y amigos más queridos.",
    dressCode: "Rigurosa Etiqueta / Vestido de Noche & Traje de Gala",
    giftInfo: "Cofre para Lluvia de Sobres en recepción",
    
    // Event Timeline
    timeline: [
        { time: "7:30 PM", title: "Misa de Renovación", description: "Renovación de votos matrimoniales en el Altar Mayor" },
        { time: "8:30 PM", title: "Recepción & Brindis", description: "Brindis de Plata por los 25 años juntos" },
        { time: "9:30 PM", title: "Cena de Gala & Video", description: "Cena ejecutiva y proyección del video de recuerdos" }
    ],

    // Padrinos / Testigos
    padrinos: [
        { role: "Esposos de Honor", name: "Elena & Roberto (1999 - 2026)" },
        { role: "Testigos de Honor", name: "Gonzalo & Martha" }
    ],

    // Feature Toggles (Premium+)
    showMusic: true,
    music: "../assets/music/sample.mp3",
    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80", caption: "25 Años de Amor" },
        { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80", caption: "Nuestra Familia" },
        { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80", caption: "Brindis de Aniversario" },
        { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80", caption: "Momentos Inolvidables" }
    ],
    showMap: true,
    showVideo: true,
    video: "../assets/video/README.txt",
    finalMessage: "¡Gracias por brindar con nosotros por estos 25 años de amor!"
};
