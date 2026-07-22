function renderSiteHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const lang = getLang();
  el.innerHTML = `
    <header class="site-header">
      <div class="container bar">
        <a href="index.html" class="logo">Sweet Mee <span>Nails</span></a>
        <nav class="nav-links">
          <a href="index.html">${t("nav_home")}</a>
          <a href="services.html">${t("nav_services")}</a>
          <a href="gallery.html">${t("nav_gallery")}</a>
          <a href="about.html">${t("nav_about")}</a>
          <a href="manage-appointment.html">${t("nav_manage")}</a>
          <a href="contact.html">${t("nav_contact")}</a>
        </nav>
        <div class="header-actions">
          <div class="lang-toggle">
            <button class="${lang === "en" ? "active" : ""}" onclick="setLang('en')">EN</button>
            <button class="${lang === "fr" ? "active" : ""}" onclick="setLang('fr')">FR</button>
          </div>
          <a href="book.html" class="btn btn-primary">${t("nav_book")}</a>
        </div>
      </div>
    </header>`;
}

function renderSiteFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const lang = getLang();
  el.innerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <div class="logo">Sweet Mee Nails</div>
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
        © ${new Date().getFullYear()} Sweet Mee Nails ·
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
