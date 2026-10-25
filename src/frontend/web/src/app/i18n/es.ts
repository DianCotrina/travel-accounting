// Spanish copy: neutral Latin American Spanish, informal "tú". Must match `Messages` exactly.
import type { Messages } from "./en";

const plural = (n: number, one: string, other: string) => (n === 1 ? one : other);

export const es: Messages = {
  locale: { label: "Idioma", switchTo: "English", switchToLabel: "Switch to English" },
  common: {
    brand: "Sacatucuenta",
    tryPreview: "Pruébalo ahora",
    close: "Cerrar",
    cancel: "Cancelar",
    tryAgain: "Reintentar",
    saving: "Guardando…",
  },

  // ── Landing ──
  nav: {
    siteHeader: "Encabezado del sitio",
    brandHome: "Sacatucuenta, volver al inicio",
    features: "Funciones",
    howItWorks: "Cómo funciona",
    pricing: "Precios",
    faq: "Preguntas",
    openMenu: "Abrir menú de navegación",
    closeMenu: "Cerrar menú de navegación",
    mobileMenu: "Navegación móvil",
    primary: "Navegación principal",
  },
  hero: {
    titleRegular: "Tus gastos de viaje con ",
    titleAccent: "las cuentas claras.",
    description:
      "Registra lo que gastas en moneda local, mira cuánto representa en tu moneda y exporta resúmenes listos para finanzas, antes de que llegue el cierre de mes.",
    secondaryCta: "Mira cómo funciona",
  },
  sample: {
    figureLabel: "Viaje de ejemplo: Buenos Aires en pesos, convertido a dólares",
    label: "Viaje de ejemplo",
    name: "Buenos Aires, enero",
    meta: "ARS → USD · tipo de cambio guardado en cada gasto",
    notConvertedYet: (n) => `${n} sin convertir todavía`,
    caption: "Datos de ejemplo que muestran cómo se ven los gastos en la app.",
    notes: {
      taxi: "Taxi desde el aeropuerto",
      dinner: "Cena en Palermo",
      museum: "Entradas al museo",
      coffee: "Café y medialunas",
    },
  },
  howItWorks: {
    title: "Cómo se mantienen ordenadas tus cuentas de viaje",
    description: "Desde que creas el viaje hasta que exportas, cada paso deja registros útiles para revisar con finanzas.",
    steps: [
      {
        title: "Define el viaje",
        description: "Elige tu moneda y la del destino antes de empezar a gastar, para que cada registro sea trazable.",
      },
      {
        title: "Registra gastos por categoría",
        description: "Anota tus gastos del día por categoría, con notas que sirvan para revisar reembolsos.",
      },
      {
        title: "Revisa y exporta",
        description: "Mira los totales del viaje, el desglose por categoría y exporta CSV para finanzas o contabilidad.",
      },
    ],
  },
  benefits: {
    title: "Hecho para las cuentas reales de un viaje",
    gridLabel: "Beneficios principales del producto",
    description:
      "Pensado para el paso entre quien viaja y quien revisa: registra el gasto diario, conserva el contexto de moneda y genera registros listos para revisar.",
    cards: [
      {
        title: "Deja de reconstruir el viaje con recibos al volver",
        body: "Registra los gastos mientras viajas para que la revisión se base en datos reales, no en memoria ni capturas de pantalla.",
      },
      {
        title: "Ve el gasto local y su impacto en tu moneda en el mismo lugar",
        body: "Mantén juntas la moneda del destino y la tuya, para que tus decisiones de viaje y la revisión contable coincidan.",
      },
      {
        title: "Exporta resúmenes que finanzas sí puede usar",
        body: "Los totales por categoría y del viaje están pensados para reembolsos y contabilidad, no para notas de presupuesto personal.",
      },
    ],
  },
  pricing: {
    title: "Precios para viajeros y equipos",
    description:
      "Empieza simple con tus viajes personales y crece hacia viajes frecuentes con totales por viaje y reportes listos para exportar.",
    recommended: "Recomendado",
    comingSoon: "Próximamente",
    perMonth: "Por mes",
    plans: {
      starter: {
        name: "Starter",
        subtitle: "Para viajes ocasionales",
        highlights: ["1 viaje activo", "Revisión manual", "Registro básico de gastos"],
      },
      pro: {
        name: "Traveler Pro",
        highlights: ["Viajes ilimitados", "Totales por viaje", "Exportación CSV", "Tipo de cambio visible", "Soporte prioritario"],
      },
      team: {
        name: "Team",
        highlights: ["Viajes compartidos", "Exportaciones listas para auditoría", "Visibilidad para el equipo", "Acompañamiento inicial"],
      },
    },
  },
  faq: {
    title: "Respuestas para evaluar el flujo",
    description: "Mejores registros de viaje, con menos limpieza al final.",
    items: [
      {
        question: "¿Sacatucuenta reemplaza a mi software contable?",
        answer:
          "No. Se enfoca en registrar gastos de viaje, conservar el contexto de moneda y exportar resúmenes que encajan en tu proceso contable.",
      },
      {
        question: "¿Puedo registrar en moneda local y aun así ver el impacto en mi moneda?",
        answer:
          "Sí. Cada viaje guarda tu moneda y la del destino, así puedes seguir el gasto local y su equivalente al mismo tiempo.",
      },
      {
        question: "¿Sirve para reembolsos y contabilidad?",
        answer:
          "Sí. El producto está pensado alrededor de gastos categorizados, totales por viaje y exportaciones CSV que apoyan reembolsos y contabilidad.",
      },
      {
        question: "¿Lo usan equipos o solo viajeros individuales?",
        answer:
          "Ambos. Quien viaja solo mantiene sus registros ordenados, y los equipos pueden usar la dirección multiusuario actual para viajes compartidos.",
      },
    ],
  },
  finalCta: {
    title: "Ten tus gastos de viaje bajo control antes del cierre de mes",
    description:
      "Empieza con el flujo del viajero y súmale una revisión pensada para finanzas, con registros categorizados y resúmenes listos para exportar.",
    tagline: "Cuentas de viaje, sin complicaciones.",
    footerNav: "Navegación del pie de página",
    siteFooter: "Pie de página",
    product: "Producto",
    rights: (year) => `© ${year} Sacatucuenta. Todos los derechos reservados.`,
  },
  signIn: {
    title: "Prueba la versión preliminar",
    description: "Registra viajes y gastos en moneda local, mira su valor en tu moneda y exporta resúmenes en CSV.",
    notice:
      "Sacatucuenta está en versión preliminar: entra con cualquier email y contraseña. Las cuentas personales y el acceso con Google, Apple, teléfono y passkey llegarán pronto.",
    email: "Email",
    emailPlaceholder: "tu@ejemplo.com",
    password: "Contraseña",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    submit: "Entrar a la versión preliminar",
    required: "Ingresa tu email y contraseña.",
    missingToken: "Falta VITE_AUTH_BEARER_TOKEN. Configura un JWT válido para acceder a la API.",
  },

  // ── App ──
  shell: {
    logout: "Cerrar sesión",
    offline: "No hay conexión con el servidor. Los cambios están desactivados hasta que vuelva.",
  },
  errors: {
    sessionExpired: "Tu sesión expiró. Vuelve a entrar.",
    network: "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
    server: "El servidor no pudo completar la solicitud. Inténtalo de nuevo.",
    notFound: "No encontramos eso.",
    generic: "Algo salió mal. Inténtalo de nuevo.",
    request: (status) => `La solicitud falló (${status}).`,
  },
  categories: {
    Transport: "Transporte",
    Meal: "Comida",
    Lodging: "Alojamiento",
    TouristActivity: "Actividad turística",
    Museum: "Museo",
    Snack: "Snack",
    Other: "Otro",
  },
  money: { rate: "tipo de cambio", notConverted: "Sin convertir" },
  trips: {
    title: "Tus viajes",
    newTrip: "Nuevo viaje",
    loading: "Cargando viajes…",
    activeLabel: "Viajes activos",
    archived: "Archivados",
    archivedLabel: "Viajes archivados",
    emptyTitle: "Crea tu primer viaje",
    emptyBody: "Un viaje guarda tus gastos en moneda local y los convierte a tu moneda.",
  },
  tripForm: {
    newTitle: "Nuevo viaje",
    editTitle: "Editar viaje",
    backToTrips: "Tus viajes",
    backToTrip: "Volver al viaje",
    name: "Nombre del viaje",
    namePlaceholder: "Buenos Aires, enero",
    destination: "Destino",
    chooseCountry: "Elige un país",
    localCurrency: "Moneda local",
    localHint: "La moneda en la que pagas en este viaje",
    homeCurrency: "Tu moneda",
    homeHint: "La moneda a la que se convierten los totales",
    startDate: "Fecha de inicio",
    endDate: "Fecha de fin",
    endBeforeStart: "La fecha de fin no puede ser anterior a la de inicio.",
    create: "Crear viaje",
    save: "Guardar viaje",
    offlineHint: "No puedes guardar mientras no haya conexión con el servidor.",
    created: "Viaje creado",
    updated: "Viaje actualizado",
  },
  trip: {
    loading: "Cargando viaje…",
    notFound: "No encontramos ese viaje.",
    totalLabel: "Total del viaje",
    notConverted: (n) => `${n} sin convertir`,
    edit: "Editar viaje",
    archive: "Archivar",
    archivedChip: "Archivado",
    sections: "Secciones del viaje",
    tabs: { expenses: "Gastos", summary: "Resumen", export: "Exportar" },
    archiveTitle: "¿Archivar este viaje?",
    archiveBody:
      "Los viajes archivados quedan de solo lectura: puedes verlos y exportarlos, pero no agregar ni editar gastos. Por ahora no se puede deshacer.",
    keepActive: "Mantener activo",
    archiveConfirm: "Archivar viaje",
    archiving: "Archivando…",
    archivedToast: "Viaje archivado. Ahora es de solo lectura.",
  },
  expenseForm: {
    addTitle: "Agregar gasto",
    editTitle: "Editar gasto",
    amount: "Monto",
    amountInvalid: "Ingresa un monto mayor que 0.",
    currency: "Moneda",
    what: "¿En qué fue?",
    whatHint: "Se muestra en el gasto y en las exportaciones.",
    whatPlaceholder: "Taxi al aeropuerto",
    category: "Categoría",
    when: "Cuándo",
    add: "Agregar gasto",
    save: "Guardar gasto",
    added: "Gasto agregado",
    updated: "Gasto actualizado",
  },
  expenses: {
    title: "Gastos",
    addButton: "Agregar gasto",
    archivedNote: "Este viaje está archivado. Los gastos son de solo lectura.",
    archivedReason: "Este viaje está archivado, así que es de solo lectura.",
    offlineReason: "No puedes agregar gastos mientras no haya conexión con el servidor.",
    emptyTitle: "Registra tu primer gasto",
    emptyBody: (local, home) => `Anota lo que pagaste en ${local}; se convierte a ${home} con el tipo de cambio de ese día.`,
    edit: "Editar",
    delete: "Eliminar",
    editLabel: (note) => `Editar ${note}`,
    deleteLabel: (note) => `Eliminar ${note}`,
    deleted: (note) => `Eliminaste "${note}"`,
    undo: "Deshacer",
    deleteFailed: (note, reason) => `No pudimos eliminar "${note}". ${reason}`,
    refreshFailed: (reason) => `Guardado, pero no pudimos actualizar los totales. ${reason}`,
  },
  summary: {
    emptyTitle: "Todavía no hay nada que resumir",
    emptyBody: "Los totales por categoría y por día aparecen cuando registras gastos.",
    totalIn: (currency) => `Total en ${currency}`,
    converted: "Convertidos",
    convertedOf: (converted, total) => `${converted} de ${total}`,
    missingNote: (n, home) =>
      `${n} ${plural(n, "gasto todavía no está convertido", "gastos todavía no están convertidos")}, así que el total en ${home} no ${plural(n, "lo incluye", "los incluye")}.`,
    byCategory: "Por categoría",
    byDay: "Por día",
    category: "Categoría",
    day: "Día",
    expensesCol: "Gastos",
    notConverted: "Sin convertir",
    someNotConverted: (n) => `${n} sin convertir`,
  },
  exportView: {
    title: "Exportar gastos",
    from: "Desde",
    to: "Hasta",
    rangeInvalid: "La fecha final no puede ser anterior a la inicial.",
    category: "Categoría",
    allCategories: "Todas las categorías",
    download: "Descargar CSV",
    preparing: "Preparando CSV…",
    preview: "Ver totales",
    loadingPreview: "Cargando…",
    downloaded: (file) => `Descargaste ${file}`,
    fallbackFile: (trip) => `${trip}-gastos.csv`,
    count: (n) => `${n} ${plural(n, "gasto", "gastos")}`,
  },
};
