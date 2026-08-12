/**
 * Configuración: Cumpleaños #18 (Juan)
 * Tier: Básica (S/ 7)
 * Incluye: Datos principales, Foto principal, Diseño temático y RSVP WhatsApp (Sin música, galería, video ni countdown)
 */
const INVITATION_CONFIG = {
    id: "cumpleanos",
    type: "cumpleanos",
    theme: "theme-cumpleanos",
    personName: "Juan",
    title: "¡Mi Cumpleaños #18!",
    subtitle: "¡Llegó la mayoría de edad y hay que celebrarlo a lo grande!",
    date: "2026-09-05T21:00:00",
    formattedDate: "Viernes, 5 de Septiembre de 2026",
    time: "9:00 PM (Hasta que salga el sol)",
    locationName: "Terraza Lounge Club Bar",
    address: "Calle Los Pinos 340, Miraflores",
    mapUrl: "https://maps.google.com/?q=Miraflores+Lima",
    wazeUrl: "https://waze.com/ul?q=Miraflores+Lima",
    whatsapp: "51933334444",
    whatsappMessage: "¡Habla Juan! Confirmo mi asistencia a tu fiesta de 18 🔥. Mi nombre es: ",
    heroImage: "../assets/images/cumpleanos/hero.svg",
    coverQuote: "La vida es una sola y los 18 solo se cumplen una vez.",
    mainMessage: "Se armó la fiesta de mis 18 años. Música, tragos, buena vibra y el mejor ambiente. No puedes faltar, trae toda la actitud.",
    dressCode: "Sport Elegante / Dress to Impress",
    giftInfo: "¡Tu buena vibra y tu presencia son suficientes! (Si traes regalo, no me enojo 😉).",
    passInfo: "Pase Personal para la fiesta",

    // Feature Toggles (Básica - No extras)
    showMusic: false,
    music: null,
    showCountdown: false,
    showGallery: false,
    gallery: [],
    showMap: true,
    showVideo: false,
    video: null,
    finalMessage: "¡Nos vemos en la pista de baile! 🎉🥂"
};
