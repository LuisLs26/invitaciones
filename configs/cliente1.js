/**
 * Configuración: Boda (María & Carlos)
 * Tier: Premium (S/ 12)
 * Incluye: Música, Galería, Countdown, Itinerario, Padres/Padrinos, Mapa, RSVP WhatsApp
 */
const INVITATION_CONFIG = {
    id: "cliente1",
    type: "boda",
    theme: "theme-boda",
    personName: "María & Carlos",
    title: "Nuestra Boda",
    subtitle: "Con la bendición de Dios y nuestros padres",
    date: "2026-10-18T16:30:00",
    formattedDate: "Domingo, 18 de Octubre de 2026",
    time: "4:30 PM (Ceremonia Religiosa)",
    locationName: "Iglesia San Francisco & Casona Los Olivos",
    address: "Jr. Lampa 210, Centro Histórico / Av. Primavera 1200",
    mapUrl: "https://maps.google.com/?q=Iglesia+San+Francisco+Lima",
    whatsapp: "51911112222",
    whatsappMessage: "¡Hola María y Carlos! Confirmo con mucha alegría mi asistencia a su Boda. Nombre(s): ",
    heroImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
    coverQuote: "El amor no es mirarse el uno al otro, sino mirar juntos en la misma dirección.",
    mainMessage: "Después de caminar juntos y construir una historia hermosa, hemos decidido unir nuestras vidas en matrimonio. Nos encantaría contar con tu presencia en este momento tan especial.",
    dressCode: "Rigurosa Etiqueta / Traje Oscuro y Vestido Largo",
    giftInfo: "Lo más importante es tu compañía. Si deseas obsequiarnos algo, agradeceremos lluvia de sobres en recepción.",
    
    // Event Timeline
    timeline: [
        { time: "4:30 PM", title: "Ceremonia Religiosa", description: "Parroquia San Francisco de Asís" },
        { time: "6:30 PM", title: "Coctel de Bienvenida", description: "Jardines de la Casona Los Olivos" },
        { time: "7:30 PM", title: "Cena de Gala & Brindis", description: "Brindis de novios y palabras de honor" },
        { time: "9:00 PM", title: "Fiesta & Hora Loca", description: "Banda en vivo y celebración de noche" }
    ],

    // Padrinos & Padres
    padrinos: [
        { role: "Padres de la Novia", name: "Fernando Salazar & Carmen de Salazar" },
        { role: "Padres del Novio", name: "Jorge Carlos & Beatriz Morales" }
    ],

    // Feature Toggles (Premium - No Video)
    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80", caption: "Nuestra Historia de Amor" },
        { url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1000&q=80", caption: "El Compromiso & Anillos" },
        { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80", caption: "Noche de Fiesta & Recepción" }
    ],
    showMap: true,
    showVideo: false,
    video: null,
    finalMessage: "Esperamos compartir esta gran dicha contigo. ¡Te esperamos!"
};
