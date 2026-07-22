:root {
  --royal: #4A1D5C;
  --royal-dark: #33123F;
  --royal-light: #6B3480;
  --lavender: #B497D6;
  --lavender-soft: #F3EDFA;
  --lavender-light: #E4D9F2;
  --blossom: #F2C6D8;
  --blossom-dark: #E29CBB;
  --gold: #C9A227;
  --ink: #2D1B36;
  --canvas: #FBF9FD;
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Poppins", ui-sans-serif, system-ui, sans-serif;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--canvas);
  color: var(--ink);
  font-family: var(--font-body);
  line-height: 1.6;
}

h1, h2, h3, h4 { font-family: var(--font-display); color: var(--royal); margin: 0 0 0.5rem; }
h1 { font-size: 2.75rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.4rem; }
a { color: inherit; }
img { max-width: 100%; display: block; }

.container { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
.section { padding: 4rem 0; }
.section.tinted { background: var(--lavender-soft); }

.brush-divider {
  height: 3px;
  width: 90px;
  margin: 1rem auto;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

.section-heading { text-align: center; max-width: 640px; margin: 0 auto 2.5rem; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.8rem 1.6rem;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
}
.btn-primary { background: var(--royal); color: #fff; box-shadow: 0 10px 30px -12px rgba(74,29,92,0.35); }
.btn-primary:hover { background: var(--royal-dark); }
.btn-secondary { background: var(--blossom); color: var(--royal-dark); }
.btn-secondary:hover { background: var(--blossom-dark); }
.btn-ghost { background: transparent; color: var(--royal); border: 1px solid rgba(74,29,92,0.3); }
.btn-ghost:hover { background: var(--lavender-soft); }
.btn-danger { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.card {
  background: #fff;
  border-radius: 1.1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px -6px rgba(74,29,92,0.15);
  border: 1px solid var(--lavender-soft);
}

.grid { display: grid; gap: 1.5rem; }
.grid-2 { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }

label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--royal); margin-bottom: 0.3rem; }
input, select, textarea {
  width: 100%;
  border: 1px solid var(--lavender);
  border-radius: 0.6rem;
  padding: 0.65rem 0.9rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  background: #fff;
}
input:focus, select:focus, textarea:focus { outline: none; border-color: var(--royal); }
.field { margin-bottom: 1rem; }

.site-header {
  position: sticky; top: 0; z-index: 40;
  background: rgba(251,249,253,0.92);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--lavender-soft);
}
.site-header .bar { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 0; flex-wrap: wrap; gap: 0.75rem; }
.logo { font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; color: var(--royal); text-decoration: none; }
.logo span { color: var(--blossom-dark); }
.nav-links { display: flex; gap: 1.25rem; flex-wrap: wrap; }
.nav-links a { font-size: 0.9rem; font-weight: 500; color: rgba(74,29,92,0.8); text-decoration: none; }
.nav-links a:hover { color: var(--royal); }
.header-actions { display: flex; align-items: center; gap: 0.75rem; }

.lang-toggle { display: inline-flex; border: 1px solid var(--lavender); border-radius: 999px; padding: 3px; background: #fff; }
.lang-toggle button {
  border: none; background: transparent; padding: 0.35rem 0.75rem; border-radius: 999px;
  font-size: 0.75rem; font-weight: 700; cursor: pointer; color: rgba(74,29,92,0.7);
}
.lang-toggle button.active { background: var(--royal); color: #fff; }

.site-footer { margin-top: 5rem; background: #fff; border-top: 1px solid var(--lavender-soft); }
.footer-grid { display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); padding: 3rem 0; }
.footer-bottom { text-align: center; font-size: 0.8rem; color: rgba(45,27,54,0.5); padding: 1rem 0; border-top: 1px solid var(--lavender-soft); }

.hero { background: linear-gradient(180deg, var(--lavender-soft), var(--canvas)); }
.hero-grid { display: grid; gap: 2.5rem; align-items: center; grid-template-columns: 1fr; padding: 4rem 0; }
@media (min-width: 800px) { .hero-grid { grid-template-columns: 1fr 1fr; } }
.hero-art { aspect-ratio: 1; border-radius: 1.1rem; background: linear-gradient(135deg, var(--blossom), var(--lavender)); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.9); font-family: var(--font-display); font-size: 1.5rem; max-width: 380px; margin: 0 auto; }

.badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.7rem; font-weight: 700; }
.badge-pending { background: #fef3c7; color: #92400e; }
.badge-accepted { background: #dbeafe; color: #1e40af; }
.badge-confirmed { background: #dcfce7; color: #166534; }
.badge-rejected, .badge-no_show { background: #fee2e2; color: #991b1b; }
.badge-cancelled_by_client, .badge-cancelled_by_salon { background: #e5e7eb; color: #374151; }
.badge-completed { background: #d1fae5; color: #065f46; }
.badge-reschedule_requested { background: #ede9fe; color: #5b21b6; }

table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th { text-align: left; text-transform: uppercase; font-size: 0.7rem; color: rgba(45,27,54,0.5); padding: 0.75rem 1rem; border-bottom: 1px solid var(--lavender-soft); }
td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--lavender-soft); }

.gallery-grid { column-count: 2; column-gap: 1rem; }
@media (min-width: 700px) { .gallery-grid { column-count: 4; } }
.gallery-grid figure { break-inside: avoid; margin: 0 0 1rem; border-radius: 1rem; overflow: hidden; background: var(--lavender-soft); box-shadow: 0 4px 20px -6px rgba(74,29,92,0.15); }

.admin-shell { display: flex; min-height: 100vh; background: rgba(243,237,250,0.4); }
.admin-sidebar { width: 240px; flex-shrink: 0; background: #fff; border-right: 1px solid var(--lavender-soft); padding: 1.5rem 0.75rem; }
.admin-sidebar nav a {
  display: block; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.9rem; font-weight: 500;
  color: rgba(45,27,54,0.7); text-decoration: none; margin-bottom: 0.2rem;
}
.admin-sidebar nav a.active, .admin-sidebar nav a:hover { background: var(--lavender-soft); color: var(--royal); }
.admin-main { flex: 1; padding: 2rem; max-width: 100%; overflow-x: auto; }
.stat-card { background: #fff; border-radius: 1rem; padding: 1.25rem; box-shadow: 0 4px 20px -6px rgba(74,29,92,0.15); border: 1px solid var(--lavender-soft); }
.stat-value { font-size: 1.8rem; font-weight: 600; color: var(--royal); }
.stat-label { font-size: 0.75rem; color: rgba(45,27,54,0.6); margin-top: 0.25rem; }

.chat-panel { display: flex; flex-direction: column; height: 460px; }
.chat-messages { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
.chat-bubble { max-width: 75%; padding: 0.5rem 0.9rem; border-radius: 1.1rem; font-size: 0.9rem; }
.chat-bubble.client { align-self: flex-end; background: var(--royal); color: #fff; }
.chat-bubble.admin { align-self: flex-start; background: var(--lavender-soft); color: var(--ink); }
.chat-bubble.system { align-self: center; background: var(--lavender-soft); color: rgba(74,29,92,0.7); font-size: 0.75rem; }
.chat-input-row { display: flex; gap: 0.5rem; padding: 0.75rem; border-top: 1px solid var(--lavender-soft); }
.chat-input-row input { flex: 1; }

.step-indicator { display: flex; justify-content: space-between; margin-bottom: 2.5rem; font-size: 0.8rem; font-weight: 600; color: rgba(45,27,54,0.4); }
.step-indicator .step { flex: 1; text-align: center; padding-bottom: 0.75rem; border-bottom: 2px solid var(--lavender-soft); }
.step-indicator .step.active { color: var(--royal); border-color: var(--royal); }

.service-pick, .slot-pick {
  border: 1px solid var(--lavender-soft); border-radius: 1.1rem; padding: 1.1rem; text-align: left;
  background: #fff; cursor: pointer; box-shadow: 0 4px 20px -6px rgba(74,29,92,0.1);
}
.service-pick.selected, .slot-pick.selected { border-color: var(--royal); background: var(--lavender-soft); }
.date-pill { border-radius: 999px; padding: 0.5rem 1rem; background: var(--lavender-soft); color: var(--royal); border: none; font-size: 0.85rem; font-weight: 600; cursor: pointer; }
.date-pill.selected { background: var(--royal); color: #fff; }

.hidden { display: none !important; }
.text-muted { color: rgba(45,27,54,0.5); font-size: 0.85rem; }
.error-text { color: #dc2626; font-size: 0.85rem; }
.success-text { color: #15803d; font-size: 0.85rem; }
