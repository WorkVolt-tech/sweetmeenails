function renderSiteHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const lang = getLang();
  const navItems = [
    ["index.html", t("nav_home")],
    ["services.html", t("nav_services")],
    ["gallery.html", t("nav_gallery")],
    ["about.html", t("nav_about")],
    ["manage-appointment.html", t("nav_manage")],
    ["contact.html", t("nav_contact")],
  ];
  const navLinksHtml = navItems.map(([href, label]) => `<a href="${href}">${label}</a>`).join("");
  const socialsHtml = `
    <div class="header-socials">
      <a href="https://instagram.com/sweetmeenails" aria-label="Instagram" title="Instagram">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
      </a>
      <a href="https://facebook.com" aria-label="Facebook" title="Facebook">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>
      </a>
    </div>`;
  const langToggleHtml = `
    <div class="lang-toggle">
      <button class="${lang === "en" ? "active" : ""}" onclick="setLang('en')">EN</button>
      <button class="${lang === "fr" ? "active" : ""}" onclick="setLang('fr')">FR</button>
    </div>`;

  el.innerHTML = `
    <header class="site-header">
      <div class="container bar">
        <a href="index.html" class="logo">Sweet Mée <span>Nails</span></a>
        <nav class="nav-links">${navLinksHtml}</nav>
        <div class="header-actions">
          <div class="desktop-only-actions" style="display:flex;align-items:center;gap:0.75rem">
            ${socialsHtml}
            ${langToggleHtml}
          </div>
          <button class="menu-toggle" id="mobile-menu-toggle" aria-label="Menu" aria-expanded="false">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
          <a href="book.html" class="btn btn-primary">${t("nav_book")}</a>
        </div>
      </div>
      <div class="mobile-nav-panel" id="mobile-nav-panel">
        ${navLinksHtml}
        <div class="mobile-extras">
          ${socialsHtml}
          ${langToggleHtml}
        </div>
      </div>
    </header>`;

  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const panel = document.getElementById("mobile-nav-panel");
  toggleBtn.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

function renderSiteFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const lang = getLang();
  el.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <div class="logo">Sweet Mée Nails</div>
          <p class="text-muted" style="max-width:280px">${t("hero_subtitle")}</p>
        </div>
        <div>
          <p style="font-weight:600;color:var(--royal)">${t("nav_contact")}</p>
          <p class="text-muted" id="footer-phone"></p>
          <p class="text-muted" id="footer-email"></p>
          <p class="text-muted" id="footer-address"></p>
        </div>
        <div>
          <p style="font-weight:600;color:var(--royal)">${t("hours")}</p>
          <p class="text-muted" id="footer-hours" style="white-space:pre-line"></p>
          <a href="https://instagram.com/sweetmeenails" class="text-muted">Instagram</a>
        </div>
      </div>
      <div class="footer-bottom">
        © ${new Date().getFullYear()} Sweet Mée Nails ·
        <a href="policies.html" style="text-decoration:underline">${lang === "fr" ? "Politiques" : "Policies"}</a>
      </div>
    </footer>`;

  sb.from("website_settings").select("*").then(({ data }) => {
    const map = {};
    (data || []).forEach((row) => { map[row.key] = lang === "fr" ? row.value_fr : row.value_en; });
    document.getElementById("footer-phone").textContent = map.phone || "";
    document.getElementById("footer-email").textContent = map.email || "";
    document.getElementById("footer-address").textContent = map.address || "";
    document.getElementById("footer-hours").textContent = map.hours || "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSiteHeader();
  renderSiteFooter();
  applyTranslations();
});
