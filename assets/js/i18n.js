const DICT = {
  en: {
    nav_home: "Home", nav_services: "Services", nav_gallery: "Gallery", nav_about: "About",
    nav_book: "Book", nav_manage: "Manage Appointment", nav_contact: "Contact",
    hero_title: "Sweet Mee Nails",
    hero_subtitle: "Precise, elegant nail care in a calm, welcoming studio.",
    book_cta: "Book an Appointment",
    featured_services: "Featured Services",
    recent_work: "Recent Work",
    hours: "Hours",
    testimonials: "What clients say",
    step_service: "Choose a service",
    step_datetime: "Choose a date & time",
    step_details: "Your details",
    step_review: "Review & confirm",
    name: "Full name",
    phone: "Phone number",
    email_optional: "Email (optional)",
    preferred_language: "Preferred language",
    notes: "Additional notes",
    inspiration_photo: "Inspiration photo (optional)",
    agree_policies: "I agree to the salon policies",
    submit_request: "Request appointment",
    pending_notice: "Your request has been received and is pending approval.",
    reference_label: "Your reference number",
    back: "Back", continue_label: "Continue",
    manage_title: "Manage My Appointment",
    lookup_prompt: "Enter your reference number and phone number",
    reference_number: "Reference number",
    lookup_submit: "Find my appointment",
    verify_prompt: "Enter the verification code we sent you",
    verify_code: "Verification code",
    verify_submit: "Verify",
    cancel_button: "Cancel appointment",
    chat_button: "Message the salon",
    status_pending: "Pending", status_accepted: "Accepted", status_rejected: "Rejected",
    status_confirmed: "Confirmed", status_cancelled_by_client: "Cancelled by you",
    status_cancelled_by_salon: "Cancelled by salon", status_completed: "Completed",
    status_no_show: "No-show", status_reschedule_requested: "Reschedule requested",
    contact_send: "Send message", contact_sent: "Thanks — we'll be in touch soon.",
    contact_error: "Something went wrong. Please try again or call us directly.",
    policies_title: "Salon Policies", about_title: "About Sweet Mee Nails",
    from_price: "From",
  },
  fr: {
    nav_home: "Accueil", nav_services: "Services", nav_gallery: "Galerie", nav_about: "À propos",
    nav_book: "Réserver", nav_manage: "Gérer mon rendez-vous", nav_contact: "Contact",
    hero_title: "Sweet Mee Nails",
    hero_subtitle: "Un soin des ongles précis et élégant dans un studio calme et accueillant.",
    book_cta: "Réserver un rendez-vous",
    featured_services: "Services vedettes",
    recent_work: "Réalisations récentes",
    hours: "Heures d'ouverture",
    testimonials: "Avis de nos clientes",
    step_service: "Choisir un service",
    step_datetime: "Choisir une date et une heure",
    step_details: "Vos coordonnées",
    step_review: "Vérifier et confirmer",
    name: "Nom complet",
    phone: "Numéro de téléphone",
    email_optional: "Courriel (facultatif)",
    preferred_language: "Langue préférée",
    notes: "Notes supplémentaires",
    inspiration_photo: "Photo d'inspiration (facultatif)",
    agree_policies: "J'accepte les politiques du salon",
    submit_request: "Demander un rendez-vous",
    pending_notice: "Votre demande a été reçue et est en attente d'approbation.",
    reference_label: "Votre numéro de référence",
    back: "Retour", continue_label: "Continuer",
    manage_title: "Gérer mon rendez-vous",
    lookup_prompt: "Entrez votre numéro de référence et votre numéro de téléphone",
    reference_number: "Numéro de référence",
    lookup_submit: "Trouver mon rendez-vous",
    verify_prompt: "Entrez le code de vérification que nous vous avons envoyé",
    verify_code: "Code de vérification",
    verify_submit: "Vérifier",
    cancel_button: "Annuler le rendez-vous",
    chat_button: "Écrire au salon",
    status_pending: "En attente", status_accepted: "Acceptée", status_rejected: "Refusée",
    status_confirmed: "Confirmé", status_cancelled_by_client: "Annulé par vous",
    status_cancelled_by_salon: "Annulé par le salon", status_completed: "Terminé",
    status_no_show: "Absence", status_reschedule_requested: "Changement demandé",
    contact_send: "Envoyer", contact_sent: "Merci — nous vous répondrons bientôt.",
    contact_error: "Une erreur est survenue. Réessayez ou appelez-nous directement.",
    policies_title: "Politiques du salon", about_title: "À propos de Sweet Mee Nails",
    from_price: "À partir de",
  },
};

function getLang() {
  return localStorage.getItem("smn_lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("smn_lang", lang);
  location.reload();
}

function t(key) {
  const lang = getLang();
  return (DICT[lang] && DICT[lang][key]) || DICT.en[key] || key;
}

// Applies translations to any element with data-i18n="key" in its DOM,
// and updates <html lang="">. Call after the page's own content loads.
function applyTranslations() {
  document.documentElement.lang = getLang();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
}
