/**
 * Configuración: Boda (María & Carlos)
 * Tier: Premium (S/ 12)
 * Incluye: Música, Galería, Countdown, Mapa, RSVP WhatsApp (Sin Video)
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
    whatsappMessage: "¡Hola María y Carlos! Confirmo con mucha alegría mi asistencia a su Boda 💍. Nombre(s): ",
    heroImage: "../assets/images/boda_hero.svg",
    coverQuote: "El amor no es mirarse el uno al otro, sino mirar juntos en la misma dirección.",
    mainMessage: "Después de caminar juntos y construir una historia hermosa, hemos decidido unir nuestras vidas en matrimonio. Nos encantaría contar con tu presencia en este momento tan especial.",
    dressCode: "Rigurosa Etiqueta / Traje Oscuro y Vestido Largo",
    giftInfo: "Lo más importante es tu compañía. Si deseas obsequiarnos algo, agradeceremos lluvia de sobres en recepción.",
    
    // Feature Toggles (Premium - No Video)
    showMusic: true,
    music: "../assets/music/sample.mp3",
    showCountdown: true,
    showGallery: true,
    gallery: [
        { url: "../assets/images/gallery2.svg", caption: "Nuestra Historia de Amor" },
        { url: "../assets/images/gallery3.svg", caption: "El Compromiso" },
        { url: "../assets/images/gallery1.svg", caption: "Nuestros Viajes Juntos" }
    ],
    showMap: true,
    showVideo: false,
    video: null,
    finalMessage: "Esperamos compartir esta gran dicha contigo. ¡Te esperamos!"
};
