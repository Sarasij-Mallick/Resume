
// Page Preloader Dismissal
window.addEventListener("load", function () {
  var preloader = document.getElementById("pagePreloader");
  if (preloader) {
    setTimeout(function () {
      preloader.classList.add("loaded");
    }, 200);
  }
});



// Header Scroll Elevation Toggle
var siteHeader = document.getElementById("siteHeader");
if (siteHeader) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 20) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }, { passive: true });
}

var year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// User type card interactions
var options = document.querySelectorAll(".card.option");
options.forEach(function (card) {
  card.addEventListener("click", function () {
    options.forEach(function (c) {
      c.classList.remove("active");
    });
    card.classList.add("active");
    var type = card.getAttribute("data-type");
    // track or route to flow - placeholder
    console.log("Selected user type:", type);
    // smooth scroll to get-started (hero cta)
    var target = document.querySelector("#get-started");
    if (!target) window.scrollTo({ top: 300, behavior: "smooth" });
  });
  card.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      card.click();
    }
  });
});

// ── PREMIUM SCROLL REVEAL SYSTEM ──────────────────────────
(function () {

  // Hero elements animate via CSS @keyframes on page load — skip them
  var heroSkip = ['.hero-content', '.hero-visual', '.hero-content .kicker',
                  '.hero-content .title', '.hero-content .lead',
                  '.hero-content .hero-actions', '.floating-badge'];

  function isHeroEl(el) {
    return heroSkip.some(function(s) {
      return el.closest && el.closest(s);
    });
  }

  // 1. Selectors → animation class mapping
  var revealMap = [
    { sel: '.section-head',                cls: 'reveal' },
    { sel: '.trust-bar .trust-title',      cls: 'reveal' },
    { sel: '.trust-logos',                 cls: 'reveal-stagger' },
    { sel: '.about-grid',                  cls: 'reveal-stagger' },
    { sel: '.path-cards',                  cls: 'reveal-stagger' },
    { sel: '.templates-grid',              cls: 'reveal-stagger' },
    { sel: '.about-card',                  cls: 'reveal-scale' },
    { sel: '.path-card',                   cls: 'reveal-scale' },
    { sel: '.tmpl-card',                   cls: 'reveal-scale' },
    { sel: '.stat-block, .stat-item',      cls: 'reveal-scale' },
    { sel: '.testimonial-card',            cls: 'reveal' },
    { sel: '.blog-card',                   cls: 'reveal-scale' },
    { sel: '.choose-path-section .center', cls: 'reveal' },
    { sel: '.contact-form-wrap',           cls: 'reveal-right' },
    { sel: '.contact-info',                cls: 'reveal-left' },
    { sel: '.footer-brand',                cls: 'reveal-left' },
    { sel: '.footer-links-col',            cls: 'reveal' },
    { sel: '.kicker',                      cls: 'reveal' },
    { sel: '.about-section .title',        cls: 'reveal' },
    { sel: '.about-section .subtitle',     cls: 'reveal' },
  ];

  var revealClasses = ['reveal','reveal-left','reveal-right','reveal-scale','reveal-stagger'];

  function hasReveal(el) {
    return revealClasses.some(function(c) { return el.classList.contains(c); });
  }

  revealMap.forEach(function(item) {
    document.querySelectorAll(item.sel).forEach(function(el) {
      if (!hasReveal(el) && !isHeroEl(el)) {
        el.classList.add(item.cls);
      }
    });
  });

  // 2. Trust logos — individual stagger via inline transitionDelay
  document.querySelectorAll('.trust-logo-text, .trust-logo').forEach(function(el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.55s cubic-bezier(0.22,1,0.36,1) ' + (i * 0.1) + 's, transform 0.55s cubic-bezier(0.22,1,0.36,1) ' + (i * 0.1) + 's';
    el.dataset.logoReveal = '1';
  });

  // 3. Observer with staggered logo activation
  var revealObserver = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('visible');

          // Activate trust-logo children if this is the logos container
          if (el.classList.contains('trust-logos') || el.classList.contains('trust-bar')) {
            el.querySelectorAll('[data-logo-reveal]').forEach(function(logo) {
              logo.style.opacity = '1';
              logo.style.transform = 'none';
            });
          }

          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
  );

  // 4. Also watch trust-bar for logo stagger
  var trustBar = document.querySelector('.trust-bar');
  if (trustBar) revealObserver.observe(trustBar);

  // 5. Observe all reveal elements
  document.querySelectorAll(revealClasses.map(function(c){ return '.'+c; }).join(',')).forEach(function(el) {
    revealObserver.observe(el);
  });

  // Legacy .fade-up support
  document.querySelectorAll('.fade-up').forEach(function(el) {
    if (!hasReveal(el)) el.classList.add('reveal');
    revealObserver.observe(el);
  });

})();


// Back-to-top button behavior with Radial Progress Ring & Rocket Launch animation
(function () {
  var backBtn = document.getElementById("backToTop");
  if (!backBtn) return;

  var studioWorkspace = document.querySelector(".studio-workspace");

  function getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop || (studioWorkspace ? studioWorkspace.scrollTop : 0);
  }

  function getScrollHeight() {
    if (studioWorkspace) {
      return studioWorkspace.scrollHeight - studioWorkspace.clientHeight;
    }
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  function updateScrollState() {
    var st = getScrollTop();
    var maxScroll = getScrollHeight();
    var pct = maxScroll > 0 ? Math.min(100, Math.max(0, (st / maxScroll) * 100)) : 0;

    backBtn.style.setProperty("--scroll-pct", pct.toFixed(1));

    if (st > 250) {
      backBtn.classList.add("visible");
    } else {
      backBtn.classList.remove("visible");
    }
  }

  // show/hide & update progress on scroll
  window.addEventListener("scroll", updateScrollState, { passive: true });
  if (studioWorkspace) {
    studioWorkspace.addEventListener("scroll", updateScrollState, { passive: true });
  }

  // init state
  updateScrollState();

  backBtn.addEventListener("click", function (e) {
    e.preventDefault();
    backBtn.classList.add("launching");

    window.scrollTo({ top: 0, behavior: "smooth" });
    if (studioWorkspace) {
      studioWorkspace.scrollTo({ top: 0, behavior: "smooth" });
    }

    setTimeout(function () {
      backBtn.classList.remove("launching");
    }, 450);

    backBtn.blur();
  });

  // keyboard accessibility
  window.addEventListener("keydown", function (e) {
    if (e.key === "Home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (studioWorkspace) {
        studioWorkspace.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  });
})();

/* script.js
   Modular vanilla JS for dynamic Resume Builder
   - Renders steps dynamically
   - Preserves state across steps
   - Autosaves to localStorage
   - Validation, add/remove entries
   - Live preview, export to PDF, dark mode
*/

(() => {
  const STORAGE_KEY = "resumeai_fresher_v1";

  const TEMPLATES_THEMES = {
    "modern-minimalist": { key: "modern-minimalist", name: "Modern Minimalist", category: "Modern", tag: "Clean · ATS Optimized", gradient: "linear-gradient(135deg, #7d2ae8 0%, #00c4cc 100%)", primary: "#7d2ae8", accent: "#00c4cc", layout: "modern" },
    "modern-tech": { key: "modern-tech", name: "Modern Tech Specialist", category: "Modern", tag: "Structured · Developer Friendly", gradient: "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)", primary: "#3b82f6", accent: "#0f172a", layout: "modern" },
    "modern-pro": { key: "modern-pro", name: "Modern Professional", category: "Modern", tag: "Dynamic · Sleek Design", gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)", primary: "#6366f1", accent: "#a855f7", layout: "modern" },

    "minimalist-essential": { key: "minimalist-essential", name: "Minimalist Essential", category: "Minimalist", tag: "Pure · Minimalist Lines", gradient: "linear-gradient(135deg, #334155 0%, #475569 100%)", primary: "#334155", accent: "#64748b", layout: "minimalist" },
    "minimalist-clean-slate": { key: "minimalist-clean-slate", name: "Clean Slate", category: "Minimalist", tag: "Simple · Ultra Readable", gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", primary: "#1e293b", accent: "#334155", layout: "minimalist" },
    "minimalist-monochrome": { key: "minimalist-monochrome", name: "Monochrome Classic", category: "Minimalist", tag: "Timeless · Compact Grid", gradient: "linear-gradient(135deg, #525252 0%, #262626 100%)", primary: "#262626", accent: "#525252", layout: "minimalist" },

    "creative-designer": { key: "creative-designer", name: "Creative Designer", category: "Creative", tag: "Vibrant · Portfolio Ready", gradient: "linear-gradient(135deg, #7d2ae8 0%, #f43f5e 100%)", primary: "#f43f5e", accent: "#7d2ae8", layout: "creative" },
    "creative-artistic": { key: "creative-artistic", name: "Artistic Showcase", category: "Creative", tag: "Bold · Media & Design", gradient: "linear-gradient(135deg, #ec4899 0%, #f97316 100%)", primary: "#ec4899", accent: "#f97316", layout: "creative" },
    "creative-innovator": { key: "creative-innovator", name: "Studio Innovator", category: "Creative", tag: "Expressive · Studio Ready", gradient: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)", primary: "#8b5cf6", accent: "#d946ef", layout: "creative" },

    "executive-pro": { key: "executive-pro", name: "Executive Professional", category: "Executive", tag: "Formal · High Impact", gradient: "linear-gradient(135deg, #10b981 0%, #00c4cc 100%)", primary: "#10b981", accent: "#00c4cc", layout: "executive" },
    "executive-director": { key: "executive-director", name: "Corporate Director", category: "Executive", tag: "Authoritative · Leadership Focus", gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", primary: "#1e3a8a", accent: "#0f172a", layout: "executive" },
    "executive-manager": { key: "executive-manager", name: "Senior Manager", category: "Executive", tag: "Structured · Executive Suite", gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", primary: "#312e81", accent: "#1e1b4b", layout: "executive" },

    "fresher-academic": { key: "fresher-academic", name: "Fresher Academic", category: "Fresher", tag: "Student Friendly · First Job", gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", primary: "#f59e0b", accent: "#ef4444", layout: "fresher" },
    "fresher-starter": { key: "fresher-starter", name: "Entry Level Starter", category: "Fresher", tag: "Skills First · Internship Ready", gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)", primary: "#14b8a6", accent: "#06b6d4", layout: "fresher" },
    "fresher-scholar": { key: "fresher-scholar", name: "Graduate Scholar", category: "Fresher", tag: "Academic Focus · Scholar Layout", gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)", primary: "#a855f7", accent: "#ec4899", layout: "fresher" }
  };

  const stepsMeta = [
    { id: 0, key: "templates", title: "Choose Resume Template" },
    { id: 1, key: "personal", title: "Personal Information" },
    { id: 2, key: "education", title: "Education" },
    { id: 3, key: "skills", title: "Skills" },
    { id: 4, key: "projects", title: "Projects" },
    { id: 5, key: "experience", title: "Experience" },
    { id: 6, key: "achievements", title: "Achievements" },
    { id: 7, key: "summary", title: "Professional Summary" },
    { id: 8, key: "review", title: "Review & Finalize" },
  ];

  // Application state
  let state = {
    current: 1,
    selectedTemplate: "modern-minimalist",
    personal: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      address: "",
      linkedin: "",
      portfolio: "",
      photo: null,
    },
    education: [], // array of entries
    skills: { technical: [], soft: [], languages: [], certifications: [] },
    projects: [],
    experience: [],
    achievements: [],
    summary: { text: "" },
  };

  // DOM
  const mainCard = document.getElementById("mainCard");
  const stepsNav = document.getElementById("stepsNav");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const progressFill = document.getElementById("progressFill");
  const progressPct = document.getElementById("progressPct");
  const livePreview = document.getElementById("livePreview");
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modalBody");
  const previewBtn = document.getElementById("previewBtn");
  const saveDraftBtn = document.getElementById("saveDraft");
  const exportPdfBtn = document.getElementById("exportPdf");
  const saveResumeBtn = document.getElementById("saveResume");
  const sidebar = document.getElementById("sidebar");

  // Debounce helper
  function debounce(fn, wait = 400) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), wait);
    };
  }

  // Load saved state
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      state = Object.assign(state, s);
      normalizeState();
    } catch (e) {
      console.warn("Load state failed", e);
    }
  }

  function normalizeState() {
    if (!state.personal || typeof state.personal !== "object") state.personal = {};
    if (!Array.isArray(state.education)) state.education = [];
    if (!Array.isArray(state.projects)) state.projects = [];
    if (!Array.isArray(state.experience)) state.experience = [];
    if (!Array.isArray(state.achievements)) state.achievements = [];
    if (!state.summary || typeof state.summary !== "object") state.summary = { text: "" };
    normalizeSkillsState();
  }

  function normalizeSkillsState() {
    if (!state.skills || typeof state.skills !== "object") {
      state.skills = { technical: [], soft: [], languages: [], certifications: [] };
    }
    if (Array.isArray(state.skills)) {
      state.skills = { technical: state.skills, soft: [], languages: [], certifications: [] };
    }
    if (!Array.isArray(state.skills.technical)) state.skills.technical = [];
    if (!Array.isArray(state.skills.soft)) state.skills.soft = [];
    if (!Array.isArray(state.skills.languages)) state.skills.languages = [];
    if (!Array.isArray(state.skills.certifications)) state.skills.certifications = [];
  }

  // Save state
  const saveState = debounce(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // update progress
      updateProgress();
      renderLivePreview();
    } catch (e) {
      console.warn("Save failed", e);
    }
  }, 300);

  // Initialize
  function init() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const templateParam = urlParams.get("template");
      if (templateParam && TEMPLATES_THEMES[templateParam]) {
        state.selectedTemplate = templateParam;
      }
    } catch (e) {}

    loadState();
    renderSidebar();
    renderStep(state.current);
    attachGlobalHandlers();
    updateProgress();
    renderLivePreview();
  }

  // Sidebar / Studio Dock render and click wiring
  function renderSidebar() {
    if (!stepsNav) return;
    const buttons = Array.from(stepsNav.querySelectorAll(".step"));
    buttons.forEach((btn) => {
      const step = Number(btn.dataset.step);
      btn.classList.toggle("active", step === state.current);
      btn.onclick = () => {
        state.current = step;
        renderStep(step);
        saveState();
      };
    });
    const drawerTitle = document.getElementById("stepDrawerTitle");
    const meta = stepsMeta.find((s) => s.id === state.current);
    if (drawerTitle && meta) {
      drawerTitle.textContent = meta.title;
    }
  }

  // Main render for a step
  function renderStep(step) {
    state.current = step;
    document.body.classList.toggle("in-form-steps", step < 8);
    document.body.classList.toggle("step-finalized", step === 8);
    renderSidebar();
    if (!mainCard) return;
    
    // Trigger smooth entrance animation on step change
    mainCard.innerHTML = ""; // clear
    mainCard.classList.remove("step-animate-in");
    void mainCard.offsetWidth; // trigger reflow
    mainCard.classList.add("step-animate-in");

    const meta = stepsMeta.find((s) => s.id === step);
    const header = createHeader(meta ? meta.title : "Step Details");
    const content = document.createElement("div");
    content.className = "card-body";
    // inject step-specific form
    switch (step) {
      case 0:
        content.appendChild(renderTemplatesSelector());
        break;
      case 1:
        content.appendChild(renderPersonal());
        break;
      case 2:
        content.appendChild(renderEducation());
        break;
      case 3:
        content.appendChild(renderSkills());
        break;
      case 4:
        content.appendChild(renderProjects());
        break;
      case 5:
        content.appendChild(renderExperience());
        break;
      case 6:
        content.appendChild(renderAchievements());
        break;
      case 7:
        content.appendChild(renderSummary());
        break;
      case 8:
        content.appendChild(renderReview());
        break;
      default:
        content.textContent = "Not implemented";
        break;
    }
    mainCard.appendChild(header);
    mainCard.appendChild(content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Step Renderers ---------- */

  // 0. Templates Selector
  function renderTemplatesSelector() {
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    const selectedKey = state.selectedTemplate || "modern-minimalist";

    wrapper.innerHTML = `
      <p style="margin:0 0 12px;font-size:13.5px;color:var(--canva-muted)">Select a template design for your resume:</p>
      
      <div class="filter-pills" style="margin-bottom:12px;justify-content:flex-start">
        <button class="pill active" data-cat="all" style="padding:5px 12px;font-size:12px">All</button>
        <button class="pill" data-cat="Modern" style="padding:5px 12px;font-size:12px">Modern</button>
        <button class="pill" data-cat="Minimalist" style="padding:5px 12px;font-size:12px">Minimalist</button>
        <button class="pill" data-cat="Creative" style="padding:5px 12px;font-size:12px">Creative</button>
        <button class="pill" data-cat="Executive" style="padding:5px 12px;font-size:12px">Executive</button>
        <button class="pill" data-cat="Fresher" style="padding:5px 12px;font-size:12px">Fresher</button>
      </div>

      <div class="template-select-grid" id="tmplDrawerGrid">
        ${Object.values(TEMPLATES_THEMES).map((t) => `
          <div class="tmpl-select-card ${t.key === selectedKey ? 'selected' : ''}" data-key="${t.key}" data-category="${t.category}">
            <div class="tmpl-select-swatch" style="background:${t.gradient}"></div>
            <div class="tmpl-select-info">
              <div class="tmpl-select-name">${escape(t.name)}</div>
              <div class="tmpl-select-tag">${escape(t.category)} · ${escape(t.tag)}</div>
            </div>
            ${t.key === selectedKey ? `<span style="color:var(--canva-purple);font-weight:800;font-size:16px">✓</span>` : ''}
          </div>
        `).join("")}
      </div>

      <div class="actions" style="margin-top:20px">
        <div style="flex:1"></div>
        <button id="toNextFromTmpl" class="btn primary">Next: Personal Info ›</button>
      </div>
    `;

    const pills = wrapper.querySelectorAll(".filter-pills .pill");
    const cards = wrapper.querySelectorAll(".tmpl-select-card");

    pills.forEach((p) => {
      p.onclick = () => {
        pills.forEach((el) => el.classList.remove("active"));
        p.classList.add("active");
        const cat = (p.dataset.cat || "").toLowerCase();
        cards.forEach((c) => {
          const cardCat = (c.dataset.category || "").toLowerCase();
          if (cat === "all" || cardCat.includes(cat)) {
            c.style.display = "flex";
          } else {
            c.style.display = "none";
          }
        });
      };
    });

    cards.forEach((c) => {
      c.onclick = () => {
        const key = c.dataset.key;
        state.selectedTemplate = key;
        saveState();
        renderLivePreview();
        renderStep(0);
      };
    });

    wrapper.querySelector("#toNextFromTmpl").onclick = () => {
      state.current = 1;
      renderStep(1);
      saveState();
    };

    return wrapper;
  }

  function createHeader(title) {
    const h = document.createElement("div");
    h.className = "card-head";
    h.innerHTML = `<h3 style="margin:0">${title}</h3><div class="small muted">Step ${state.current} of ${stepsMeta.length}</div>`;
    return h;
  }







  
  /* ---------- Step Renderers ---------- */

  // 1. Personal
  function renderPersonal() {
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `
      <div class="form-group form-row">
        <div class="form-label"><label>Full Name *</label><input class="form-control" id="fullName" type="text" value="${escape(state.personal.fullName || "")}" /></div>
        <div class="form-label"><label>Professional Headline *</label><input class="form-control" id="headline" type="text" value="${escape(state.personal.headline || "")}" /></div>
      </div>
      <div class="form-group form-row">
        <div class="form-label"><label>Email *</label><input class="form-control" id="email" type="email" value="${escape(state.personal.email || "")}" /></div>
        <div class="form-label"><label>Phone *</label><input class="form-control" id="phone" type="tel" value="${escape(state.personal.phone || "")}" /></div>
      </div>
      <div class="form-group form-row">
        <div class="form-label"><label>Address</label><input class="form-control" id="address" type="text" value="${escape(state.personal.address || "")}" /></div>
        <div class="form-group form-row">
          <div class="field"><label>LinkedIn</label><input class="form-control" id="linkedin" type="url" value="${escape(state.personal.linkedin || "")}" /></div>
        </div>
      </div>
      <div class="form-group form-row single">
        <div class="form-label"><label>Portfolio / Website</label><input class="form-control" id="portfolio" type="url" value="${escape(state.personal.portfolio || "")}" /></div>
      </div>
      <div class="form-group form-row single">
        <div class="field">
          <label>Profile Picture</label>
          <div style="display:flex;gap:12px;align-items:center">
            <div id="photoPreview" style="width:84px;height:84px;border-radius:12px;background:#f3f6fb;display:flex;align-items:center;justify-content:center;overflow:hidden;border:1px solid rgba(15,23,42,0.04)">
              ${state.personal.photo ? `<img src="${state.personal.photo}" style="width:100%;height:100%;object-fit:cover">` : `<svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 3v12" stroke="#4285F4" stroke-width="1.6" stroke-linecap="round"/><path d="M8 7l4-4 4 4" stroke="#4285F4" stroke-width="1.6" stroke-linecap="round"/></svg>`}
            </div>
            <div style="flex:1">
              <input class="form-control" id="photoInput" type="file" accept="image/*" />
              <div class="small muted">PNG, JPG, WEBP up to 2MB</div>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <div style="flex:1"></div>
        <button id="savePersonal" class="btn bg-success">Save</button>
        <button id="toNext" class="btn primary">Next</button>
      </div>
    `;
    // handlers
    wrapper
      .querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"], input[type="url"]',
      )
      .forEach((inp) => {
        inp.addEventListener("input", (e) => {
          const id = inp.id;
          switch (id) {
            case "fullName":
              state.personal.fullName = inp.value;
              break;
            case "headline":
              state.personal.headline = inp.value;
              break;
            case "email":
              state.personal.email = inp.value;
              break;
            case "phone":
              state.personal.phone = inp.value;
              break;
            case "address":
              state.personal.address = inp.value;
              break;
            case "linkedin":
              state.personal.linkedin = inp.value;
              break;
            case "portfolio":
              state.personal.portfolio = inp.value;
              break;
          }
          saveState();
        });
      });

    // photo upload
    const photoInput = wrapper.querySelector("#photoInput");
    const photoPreview = wrapper.querySelector("#photoPreview");
    photoInput.addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      if (f.size > 2 * 1024 * 1024) {
        alert("Max 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        state.personal.photo = ev.target.result;
        photoPreview.innerHTML = `<img src="${state.personal.photo}" style="width:100%;height:100%;object-fit:cover">`;
        saveState();
      };
      reader.readAsDataURL(f);
    });

    wrapper.querySelector("#savePersonal").onclick = () => {
      if (validatePersonal()) {
        saveState();
        alert("Saved");
      }
    };
    wrapper.querySelector("#toNext").onclick = () => {
      if (validatePersonal()) {
        state.current = 2;
        renderStep(2);
        saveState();
      }
    };

    return wrapper;
  }

  function validatePersonal() {
    const p = state.personal;
    const errs = [];
    if (!p.fullName || p.fullName.trim().length < 2)
      errs.push("Full name required");
    if (!p.headline || p.headline.trim().length < 4)
      errs.push("Headline required");
    if (!p.email || !/^\S+@\S+\.\S+$/.test(p.email))
      errs.push("Valid email required");
    if (!p.phone || p.phone.trim().length < 6) errs.push("Phone required");
    if (errs.length) {
      alert(errs.join("\n"));
      return false;
    }
    return true;
  }

  // 2. Education (add/remove entries)
  function renderEducation() {
    normalizeState();
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `
      <div class="list" id="eduList"></div>
      <div style="margin-top:10px" class="actions">
        <button id="addEdu" class="btn neutral">+ Add Education</button>
        <div style="flex:1"></div>
        <button id="saveEdu" class="btn bg-success text-white">Save</button>
        <button id="toNext2" class="btn primary">Next</button>
      </div>
    `;
    const eduList = wrapper.querySelector("#eduList");
    function refresh() {
      normalizeState();
      eduList.innerHTML = "";
      state.education.forEach((e, idx) => {
        const el = document.createElement("div");
        el.className = "entry mb-2 p-2";
        el.innerHTML = `
          <div class="entry-head d-flex justify-content-between align-items-center mb-1">
            <strong>${escape(e.degree || "Degree")}</strong>
            <div>
              <button class="btn btn-sm btn-outline-secondary neutral" data-idx="${idx}" data-act="edit">Edit</button>
              <button class="btn btn-sm btn-outline-danger" data-idx="${idx}" data-act="remove">Remove</button>
            </div>
          </div>
          <div class="small muted">${escape(e.institution || "Institution")} • ${escape(e.start || "")} - ${escape(e.end || "")}</div>
          <div style="margin-top:6px" class="small">${escape(e.description || "")}</div>
        `;
        eduList.appendChild(el);
      });
      if (state.education.length === 0) {
        eduList.innerHTML = `<div class="small text-muted">No education entries yet. Click "+ Add Education".</div>`;
      }
    }
    refresh();

    wrapper.querySelector("#addEdu").addEventListener("click", () => {
      const entry = {
        degree: "",
        institution: "",
        field: "",
        gpa: "",
        start: "",
        end: "",
        description: "",
      };
      state.education.push(entry);
      const newIdx = state.education.length - 1;
      renderEducationEditor(newIdx, refresh, true);
    });

    wrapper.querySelector("#saveEdu").onclick = () => {
      saveState();
      alert("Education saved successfully!");
    };

    wrapper.querySelector("#toNext2").onclick = () => {
      saveState();
      state.current = 3;
      renderStep(3);
    };

    eduList.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      const act = btn.dataset.act;
      if (act === "remove") {
        if (confirm("Remove entry?")) {
          state.education.splice(idx, 1);
          saveState();
          refresh();
        }
      }
      if (act === "edit") renderEducationEditor(idx, refresh, false);
    });

    return wrapper;
  }

  function renderEducationEditor(index, onDone, isNew = false) {
    const data = state.education[index] || {};
    const modalHtml = document.createElement("div");
    modalHtml.className = "modal";
    modalHtml.setAttribute("aria-hidden", "false");
    modalHtml.innerHTML = `<div class="modal-panel"><header><h3>${isNew ? "Add Education" : "Edit Education"}</h3></header><div style="padding:12px">
      <div class="form-row"><div class="field"><label>Degree *</label><input class="form-control" id="e_degree" value="${escape(data.degree || "")}"/></div>
      <div class="field"><label>Institution *</label><input class="form-control" id="e_institution" value="${escape(data.institution || "")}"/></div></div>
      <div class="form-row"><div class="field"><label>Field of study</label><input class="form-control" id="e_field" value="${escape(data.field || "")}"/></div><div class="field"><label>GPA</label><input class="form-control" id="e_gpa" value="${escape(data.gpa || "")}"/></div></div>
      <div class="form-row"><div class="field"><label>Start</label><input class="form-control" id="e_start" type="month" value="${escape(data.start || "")}"/></div><div class="field"><label>End</label><input class="form-control" id="e_end" type="month" value="${escape(data.end || "")}"/></div></div>
      <div class="field"><label>Description</label><textarea class="form-control" id="e_desc">${escape(data.description || "")}</textarea></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><button id="e_cancel" class="btn neutral">Cancel</button><button id="e_save" class="btn primary">Save</button></div>
      </div></div>`;
    document.body.appendChild(modalHtml);

    modalHtml.querySelector("#e_cancel").onclick = () => {
      if (isNew) {
        state.education.splice(index, 1);
        saveState();
      }
      modalHtml.remove();
      if (onDone) onDone();
    };

    modalHtml.querySelector("#e_save").onclick = () => {
      const degreeVal = modalHtml.querySelector("#e_degree").value.trim();
      if (!degreeVal) {
        alert("Please enter a degree.");
        return;
      }
      data.degree = degreeVal;
      data.institution = modalHtml.querySelector("#e_institution").value.trim();
      data.field = modalHtml.querySelector("#e_field").value.trim();
      data.gpa = modalHtml.querySelector("#e_gpa").value.trim();
      data.start = modalHtml.querySelector("#e_start").value;
      data.end = modalHtml.querySelector("#e_end").value;
      data.description = modalHtml.querySelector("#e_desc").value.trim();

      saveState();
      modalHtml.remove();
      if (onDone) onDone();
    };
  }

  // 3. Skills
  function renderSkills() {
    normalizeSkillsState();
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `
      <div class="field">
        <label>Technical Skills</label>
        <div id="techWrap" class="list"></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <input class="form-control" id="newTech" placeholder="Add technical skill(s), e.g. JavaScript, React"/>
          <button class="btn neutral" id="addTechBtn" type="button">Add</button>
        </div>
      </div>
      <div class="field">
        <label>Soft Skills</label>
        <div id="softWrap" class="list"></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <input class="form-control" id="newSoft" placeholder="Add soft skill(s), e.g. Communication, Leadership"/>
          <button class="btn neutral" id="addSoftBtn" type="button">Add</button>
        </div>
      </div>
      <div class="field">
        <label>Languages</label>
        <div id="langWrap" class="list"></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <input class="form-control" id="newLang" placeholder="Add language(s), e.g. English, Spanish"/>
          <button class="btn neutral" id="addLangBtn" type="button">Add</button>
        </div>
      </div>
      <div class="field">
        <label>Certifications</label>
        <div id="certWrap" class="list"></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <input class="form-control" id="newCert" placeholder="Add certification(s), e.g. AWS Certified, PMP"/>
          <button class="btn neutral" id="addCertBtn" type="button">Add</button>
        </div>
      </div>
      <div class="actions"><div style="flex:1"></div><button id="saveSkills" class="btn bg-success text-white">Save</button><button id="toNext3" class="btn primary">Next</button></div>
    `;

    const techWrap = wrapper.querySelector("#techWrap");
    const softWrap = wrapper.querySelector("#softWrap");
    const langWrap = wrapper.querySelector("#langWrap");
    const certWrap = wrapper.querySelector("#certWrap");

    // Core array listing rendering engine
    function renderList(arr, el) {
      el.innerHTML = "";
      arr.forEach((v, i) => {
        const item = document.createElement("div");
        item.className = "entry mb-1 p-1 d-flex justify-content-between align-items-center";
        const safeValue = typeof escape === "function" ? escape(v) : v;
        item.innerHTML = `<span>${safeValue}</span> <div><button class="btn btn-sm btn-outline-danger" data-idx="${i}" data-type="${el.id}" data-act="remove">Remove</button></div>`;
        el.appendChild(item);
      });
      if (arr.length === 0) {
        el.innerHTML = `<div class="small text-muted">No items added yet</div>`;
      }
    }

    // Initial list population routines
    renderList(state.skills.technical, techWrap);
    renderList(state.skills.soft, softWrap);
    renderList(state.skills.languages, langWrap);
    renderList(state.skills.certifications, certWrap);

    function handleAddSkill(inputId, btnId, storageArray, elementWrap) {
      const input = wrapper.querySelector(`#${inputId}`);
      const btn = wrapper.querySelector(`#${btnId}`);

      function addValues() {
        if (!input) return;
        const rawValue = input.value.trim();
        if (rawValue) {
          const items = rawValue.split(",").map((s) => s.trim()).filter(Boolean);
          items.forEach((item) => {
            if (!storageArray.includes(item)) {
              storageArray.push(item);
            }
          });
          saveState();
          renderList(storageArray, elementWrap);
          input.value = "";
        }
      }

      if (input) {
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addValues();
          }
        });
        input.addEventListener("blur", () => {
          addValues();
        });
      }

      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          addValues();
        });
      }
    }

    handleAddSkill("newTech", "addTechBtn", state.skills.technical, techWrap);
    handleAddSkill("newSoft", "addSoftBtn", state.skills.soft, softWrap);
    handleAddSkill("newLang", "addLangBtn", state.skills.languages, langWrap);
    handleAddSkill("newCert", "addCertBtn", state.skills.certifications, certWrap);

    // Delegation pipeline managing deletion handlers dynamically
    wrapper.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.dataset.act === "remove") {
        const idx = Number(btn.dataset.idx);
        const type = btn.dataset.type;

        if (type === "techWrap") {
          state.skills.technical.splice(idx, 1);
          renderList(state.skills.technical, techWrap);
        }
        if (type === "softWrap") {
          state.skills.soft.splice(idx, 1);
          renderList(state.skills.soft, softWrap);
        }
        if (type === "langWrap") {
          state.skills.languages.splice(idx, 1);
          renderList(state.skills.languages, langWrap);
        }
        if (type === "certWrap") {
          state.skills.certifications.splice(idx, 1);
          renderList(state.skills.certifications, certWrap);
        }

        saveState();
      }
    });

    function flushInputs() {
      wrapper.querySelector("#addTechBtn")?.click();
      wrapper.querySelector("#addSoftBtn")?.click();
      wrapper.querySelector("#addLangBtn")?.click();
      wrapper.querySelector("#addCertBtn")?.click();
    }

    wrapper.querySelector("#saveSkills").onclick = () => {
      flushInputs();
      saveState();
      alert("Skills saved successfully!");
    };

    wrapper.querySelector("#toNext3").onclick = () => {
      flushInputs();
      state.current = 4;
      saveState();
      if (typeof renderStep === "function") renderStep(4);
    };

    return wrapper;
  }

  // 4. Projects
  function renderProjects() {
    normalizeState();
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `
      <div class="list" id="projList"></div>
      <div style="margin-top:12px" class="actions">
        <button id="addProj" class="btn neutral">+ Add Project</button>
        <div style="flex:1"></div>
        <button id="saveProj" class="btn bg-success text-white">Save</button>
        <button id="toNext4" class="btn primary">Next</button>
      </div>
    `;
    const list = wrapper.querySelector("#projList");

    function refresh() {
      normalizeState();
      list.innerHTML = "";
      state.projects.forEach((p, idx) => {
        const el = document.createElement("div");
        el.className = "entry mb-2 p-2";
        el.innerHTML = `
          <div class="entry-head d-flex justify-content-between align-items-center mb-1">
            <strong>${escape(p.name || "Untitled Project")}</strong>
            <div>
              <button class="btn btn-sm btn-outline-secondary neutral" data-idx="${idx}" data-act="edit">Edit</button>
              <button class="btn btn-sm btn-outline-danger" data-idx="${idx}" data-act="remove">Remove</button>
            </div>
          </div>
          <div class="small muted">${escape(p.tech || "No technologies listed")}</div>
          <div style="margin-top:6px" class="small">${escape(p.description || "")}</div>
        `;
        list.appendChild(el);
      });
      if (state.projects.length === 0) {
        list.innerHTML = `<div class="small text-muted">No projects added yet. Click "+ Add Project" to create one.</div>`;
      }
    }
    refresh();

    wrapper.querySelector("#addProj").onclick = () => {
      const newProj = {
        name: "",
        description: "",
        tech: "",
        github: "",
        demo: "",
      };
      state.projects.push(newProj);
      const newIdx = state.projects.length - 1;
      renderProjectEditor(newIdx, refresh, true);
    };

    wrapper.querySelector("#saveProj").onclick = () => {
      saveState();
      alert("Projects saved successfully!");
    };

    wrapper.querySelector("#toNext4").onclick = () => {
      saveState();
      state.current = 5;
      renderStep(5);
    };

    list.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      if (btn.dataset.act === "remove") {
        if (confirm("Remove project?")) {
          state.projects.splice(idx, 1);
          saveState();
          refresh();
        }
      }
      if (btn.dataset.act === "edit") {
        renderProjectEditor(idx, refresh, false);
      }
    });

    return wrapper;
  }

  function renderProjectEditor(idx, onDone, isNew = false) {
    const data = state.projects[idx] || {};
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    modalDiv.setAttribute("aria-hidden", "false");
    modalDiv.innerHTML = `<div class="modal-panel"><header><h3>${isNew ? "Add Project" : "Edit Project"}</h3></header><div style="padding:12px">
      <div class="field"><label>Project Name *</label><input class="form-control" id="p_name" value="${escape(data.name || "")}"/></div>
      <div class="field"><label>Technologies Used</label><input class="form-control" id="p_tech" placeholder="e.g. React, Node.js, MongoDB" value="${escape(data.tech || "")}"/></div>
      <div class="field"><label>GitHub Link</label><input class="form-control" id="p_github" placeholder="https://github.com/..." value="${escape(data.github || "")}"/></div>
      <div class="field"><label>Live Demo</label><input class="form-control" id="p_demo" placeholder="https://..." value="${escape(data.demo || "")}"/></div>
      <div class="field"><label>Description</label><textarea class="form-control" id="p_desc" rows="3" placeholder="Briefly describe what the project does...">${escape(data.description || "")}</textarea></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><button id="p_cancel" class="btn neutral">Cancel</button><button id="p_save" class="btn primary">Save Project</button></div>
      </div></div>`;
    document.body.appendChild(modalDiv);

    modalDiv.querySelector("#p_cancel").onclick = () => {
      if (isNew) {
        state.projects.splice(idx, 1);
        saveState();
      }
      modalDiv.remove();
      if (onDone) onDone();
    };

    modalDiv.querySelector("#p_save").onclick = () => {
      const nameVal = modalDiv.querySelector("#p_name").value.trim();
      if (!nameVal) {
        alert("Please enter a project name.");
        return;
      }
      data.name = nameVal;
      data.tech = modalDiv.querySelector("#p_tech").value.trim();
      data.github = modalDiv.querySelector("#p_github").value.trim();
      data.demo = modalDiv.querySelector("#p_demo").value.trim();
      data.description = modalDiv.querySelector("#p_desc").value.trim();

      saveState();
      modalDiv.remove();
      if (onDone) onDone();
    };
  }

  // 5. Experience
  function renderExperience() {
    normalizeState();
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `<div class="list" id="expList"></div><div style="margin-top:12px" class="actions"><button id="addExp" class="btn neutral">+ Add Experience</button><button id="saveExp" class="btn bg-success text-white">Save</button><button id="toNext5" class="btn primary">Next</button></div>`;
    const list = wrapper.querySelector("#expList");
    function refresh() {
      normalizeState();
      list.innerHTML = "";
      state.experience.forEach((e, idx) => {
        const el = document.createElement("div");
        el.className = "entry mb-2 p-2";
        el.innerHTML = `<div class="entry-head d-flex justify-content-between align-items-center mb-1"><strong>${escape(e.title || "Title")} @ ${escape(e.company || "Company")}</strong><div><button class="btn btn-sm btn-outline-secondary neutral" data-idx="${idx}" data-act="edit">Edit</button><button class="btn btn-sm btn-outline-danger" data-idx="${idx}" data-act="remove">Remove</button></div></div>
          <div class="small muted">${escape(e.start || "")} - ${escape(e.end || "")}</div><div style="margin-top:6px" class="small">${escape(e.responsibilities?.slice(0, 120) || "")}</div>`;
        list.appendChild(el);
      });
      if (state.experience.length === 0)
        list.innerHTML = `<div class="small text-muted">No experience entries yet. Click "+ Add Experience".</div>`;
    }
    refresh();

    wrapper.querySelector("#addExp").onclick = () => {
      state.experience.push({
        company: "",
        title: "",
        type: "",
        start: "",
        end: "",
        responsibilities: "",
      });
      const newIdx = state.experience.length - 1;
      renderExperienceEditor(newIdx, refresh, true);
    };

    wrapper.querySelector("#saveExp").onclick = () => {
      saveState();
      alert("Experience saved successfully!");
    };

    wrapper.querySelector("#toNext5").onclick = () => {
      saveState();
      state.current = 6;
      renderStep(6);
    };

    list.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      if (btn.dataset.act === "remove") {
        if (confirm("Remove experience?")) {
          state.experience.splice(idx, 1);
          saveState();
          refresh();
        }
      }
      if (btn.dataset.act === "edit") renderExperienceEditor(idx, refresh, false);
    });
    return wrapper;
  }

  function renderExperienceEditor(idx, onDone, isNew = false) {
    const data = state.experience[idx] || {};
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    modalDiv.setAttribute("aria-hidden", "false");
    modalDiv.innerHTML = `<div class="modal-panel"><header><h3>${isNew ? "Add Experience" : "Edit Experience"}</h3></header><div style="padding:12px">
      <div class="field"><label>Company *</label><input class="form-control" id="ex_company" value="${escape(data.company || "")}"/></div>
      <div class="field"><label>Job Title *</label><input class="form-control" id="ex_title" value="${escape(data.title || "")}"/></div>
      <div class="form-row"><div class="field"><label>Type</label><input class="form-control" id="ex_type" placeholder="e.g. Internship, Full-Time" value="${escape(data.type || "")}"/></div><div class="field"><label>Start</label><input class="form-control" id="ex_start" type="month" value="${escape(data.start || "")}"/></div></div>
      <div class="form-row"><div class="field"><label>End</label><input class="form-control" id="ex_end" type="month" value="${escape(data.end || "")}"/></div><div class="field"><label>Responsibilities</label><input class="form-control" id="ex_resp" placeholder="Key achievements or duties" value="${escape(data.responsibilities || "")}"/></div></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><button id="ex_cancel" class="btn neutral">Cancel</button><button id="ex_save" class="btn primary">Save</button></div>
    </div></div>`;
    document.body.appendChild(modalDiv);

    modalDiv.querySelector("#ex_cancel").onclick = () => {
      if (isNew) {
        state.experience.splice(idx, 1);
        saveState();
      }
      modalDiv.remove();
      if (onDone) onDone();
    };

    modalDiv.querySelector("#ex_save").onclick = () => {
      const companyVal = modalDiv.querySelector("#ex_company").value.trim();
      const titleVal = modalDiv.querySelector("#ex_title").value.trim();
      if (!companyVal || !titleVal) {
        alert("Please enter both Company and Job Title.");
        return;
      }
      data.company = companyVal;
      data.title = titleVal;
      data.type = modalDiv.querySelector("#ex_type").value.trim();
      data.start = modalDiv.querySelector("#ex_start").value;
      data.end = modalDiv.querySelector("#ex_end").value;
      data.responsibilities = modalDiv.querySelector("#ex_resp").value.trim();

      saveState();
      modalDiv.remove();
      if (onDone) onDone();
    };
  }

  // 6. Achievements
  function renderAchievements() {
    normalizeState();
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `<div class="list" id="achList"></div><div style="margin-top:12px" class="actions"><button id="addAch" class="btn neutral">+ Add Achievement</button><button id="saveAch" class="btn bg-success text-white">Save</button><button id="toNext6" class="btn primary">Next</button></div>`;
    const list = wrapper.querySelector("#achList");
    function refresh() {
      normalizeState();
      list.innerHTML = "";
      state.achievements.forEach((a, idx) => {
        const el = document.createElement("div");
        el.className = "entry mb-2 p-2";
        el.innerHTML = `<div class="entry-head d-flex justify-content-between align-items-center mb-1"><strong>${escape(a.title || "Achievement")}</strong><div><button class="btn btn-sm btn-outline-secondary neutral" data-idx="${idx}" data-act="edit">Edit</button><button class="btn btn-sm btn-outline-danger" data-idx="${idx}" data-act="remove">Remove</button></div></div><div class="small muted">${escape(a.org || "")} • ${escape(a.date || "")}</div><div style="margin-top:6px" class="small">${escape(a.description || "")}</div>`;
        list.appendChild(el);
      });
      if (state.achievements.length === 0)
        list.innerHTML = `<div class="small text-muted">No achievements yet. Click "+ Add Achievement".</div>`;
    }
    refresh();

    wrapper.querySelector("#addAch").onclick = () => {
      state.achievements.push({
        title: "",
        org: "",
        date: "",
        description: "",
      });
      const newIdx = state.achievements.length - 1;
      renderAchievementEditor(newIdx, refresh, true);
    };

    wrapper.querySelector("#saveAch").onclick = () => {
      saveState();
      alert("Achievements saved successfully!");
    };

    wrapper.querySelector("#toNext6").onclick = () => {
      saveState();
      state.current = 7;
      renderStep(7);
    };

    list.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      if (btn.dataset.act === "remove") {
        if (confirm("Remove achievement?")) {
          state.achievements.splice(idx, 1);
          saveState();
          refresh();
        }
      }
      if (btn.dataset.act === "edit") renderAchievementEditor(idx, refresh, false);
    });
    return wrapper;
  }

  function renderAchievementEditor(idx, onDone, isNew = false) {
    const data = state.achievements[idx] || {};
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    modalDiv.setAttribute("aria-hidden", "false");
    modalDiv.innerHTML = `<div class="modal-panel"><header><h3>${isNew ? "Add Achievement" : "Edit Achievement"}</h3></header><div style="padding:12px">
      <div class="field"><label>Title *</label><input class="form-control" id="a_title" value="${escape(data.title || "")}"/></div>
      <div class="field"><label>Organization</label><input class="form-control" id="a_org" value="${escape(data.org || "")}"/></div>
      <div class="field"><label>Date</label><input class="form-control" id="a_date" type="month" value="${escape(data.date || "")}"/></div>
      <div class="field"><label>Description</label><textarea class="form-control" id="a_desc">${escape(data.description || "")}</textarea></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><button id="a_cancel" class="btn neutral">Cancel</button><button id="a_save" class="btn primary">Save</button></div>
    </div></div>`;
    document.body.appendChild(modalDiv);

    modalDiv.querySelector("#a_cancel").onclick = () => {
      if (isNew) {
        state.achievements.splice(idx, 1);
        saveState();
      }
      modalDiv.remove();
      if (onDone) onDone();
    };

    modalDiv.querySelector("#a_save").onclick = () => {
      const titleVal = modalDiv.querySelector("#a_title").value.trim();
      if (!titleVal) {
        alert("Please enter a title.");
        return;
      }
      data.title = titleVal;
      data.org = modalDiv.querySelector("#a_org").value.trim();
      data.date = modalDiv.querySelector("#a_date").value;
      data.description = modalDiv.querySelector("#a_desc").value.trim();

      saveState();
      modalDiv.remove();
      if (onDone) onDone();
    };
  }

  // 7. Summary (textarea + suggestions)
  function renderSummary() {
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `<div class="field"><label>Professional Summary</label><textarea id="summaryText">${escape(state.summary.text || "")}</textarea><div class="small muted"><span id="charCount">0</span> characters</div></div>
      <div class="field"><label>AI Suggestions</label><div class="entry"><div class="small muted">Try: "Recent Computer Science graduate with internship experience in full-stack development..."</div></div></div>
      <div class="actions"><div style="flex:1"></div><button id="saveSum" class="btn neutral">Save</button><button id="toNext7" class="btn primary">Next</button></div>`;
    const ta = wrapper.querySelector("#summaryText");
    const charCount = wrapper.querySelector("#charCount");
    charCount.textContent = (ta.value || "").length;
    ta.addEventListener("input", () => {
      state.summary.text = ta.value;
      charCount.textContent = ta.value.length;
      saveState();
    });
    wrapper.querySelector("#saveSum").onclick = () => {
      saveState();
      alert("Saved");
    };
    wrapper.querySelector("#toNext7").onclick = () => {
      state.current = 8;
      renderStep(8);
      saveState();
    };
    return wrapper;
  }

  // 8. Review & Finalize
  function renderReview() {
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    const resumeHtml = buildResumeHtml();
    wrapper.innerHTML = `
      <div class="mobile-only-doc-box" style="margin-bottom:14px;text-align:center;padding:18px;background:rgba(16,185,129,0.08);border-radius:14px;border:1.5px solid rgba(16,185,129,0.25)">
        <h4 style="margin:0 0 6px;color:#059669;font-size:16px">🎉 Forms Complete! Document Ready</h4>
        <p style="margin:0 0 14px;font-size:13px;color:#475569">Click below to view your document in full screen mode.</p>
        <button id="showDocFinalBtn" class="show-doc-btn" style="max-width:260px;margin:0 auto">
          Show My Resume
        </button>
      </div>
      <div class="mobile-only-doc-box" style="margin-bottom:10px;font-weight:700;color:var(--canva-dark)">Resume Document Preview</div>
      <div class="mobile-only-doc-box" style="border:1px solid rgba(15,23,42,0.08);padding:14px;border-radius:12px;background:linear-gradient(180deg,var(--card),transparent);max-height:360px;overflow-y:auto">${resumeHtml}</div>
      <div class="actions" style="margin-top:16px"><button id="editResume" class="btn neutral">Edit</button><button id="downloadPdf" class="btn neutral">Download PDF</button><button id="saveFinal" class="btn primary">Save Resume</button></div>`;
    
    wrapper.querySelector("#showDocFinalBtn").onclick = () => {
      openFullscreenDocument();
    };
    wrapper.querySelector("#editResume").onclick = () => {
      state.current = 1;
      renderStep(1);
    };
    wrapper.querySelector("#downloadPdf").onclick = () => {
      exportPDF();
    };
    wrapper.querySelector("#saveFinal").onclick = () => {
      saveState();
      alert("Resume saved");
    };
    return wrapper;
  }

  /* ---------- Utilities ---------- */

  function renderLivePreview() {
    const paperCanvas = document.getElementById("paperCanvas");
    if (paperCanvas) {
      paperCanvas.innerHTML = buildResumeHtml();
    }
    if (livePreview) {
      livePreview.innerHTML = buildLivePreviewHtml();
    }
  }

  function buildLivePreviewHtml() {
    const p = state.personal || {};
    return `<div style="display:flex;gap:12px;align-items:center">
      ${p.photo ? `<img src="${p.photo}" style="width:64px;height:64px;object-fit:cover;border-radius:10px">` : `<div style="width:64px;height:64px;border-radius:10px;background:#eef5ff"></div>`}
      <div><div style="font-weight:700;color:#0f172a">${escape(p.fullName || "Your Name")}</div><div class="small muted">${escape(p.headline || "Professional Headline")}</div></div>
    </div>
    <div style="margin-top:10px"><div class="small muted">Email: ${escape(p.email || "")}</div><div class="small muted">Phone: ${escape(p.phone || "")}</div></div>`;
  }

  function buildResumeHtml() {
    const p = state.personal || {};
    const key = state.selectedTemplate || "modern-minimalist";
    const theme = TEMPLATES_THEMES[key] || TEMPLATES_THEMES["modern-minimalist"];

    const tech = (state.skills?.technical || []).join(", ");
    const soft = (state.skills?.soft || []).join(", ");
    const lang = (state.skills?.languages || []).join(", ");
    const cert = (state.skills?.certifications || []).join(", ");

    const hasPersonalName = p.fullName && p.fullName.trim().length > 0;
    const hasPersonalHeadline = p.headline && p.headline.trim().length > 0;
    const hasPersonalEmail = p.email && p.email.trim().length > 0;
    const hasPersonalPhone = p.phone && p.phone.trim().length > 0;

    const errBox = (title, stepNum) => `<div style="border:2px dashed #ef4444;background:#fef2f2;color:#dc2626;padding:12px;border-radius:8px;font-size:12.5px;font-weight:700;text-align:center;margin:10px 0;">⚠️ [${title} Section Empty] - Please fill out Step ${stepNum} in the form drawer.</div>`;

    const nameText = hasPersonalName ? escape(p.fullName) : `<span style="color:#dc2626;border:1.5px dashed #fca5a5;padding:2px 8px;border-radius:6px;background:#fef2f2;font-size:15px;font-weight:700;">⚠️ [Full Name Missing]</span>`;
    const headlineText = hasPersonalHeadline ? escape(p.headline) : `<span style="color:#dc2626;font-size:12.5px;font-weight:600;">⚠️ [Headline Missing]</span>`;
    const emailText = hasPersonalEmail ? escape(p.email) : `<span style="color:#dc2626;">[Email Missing]</span>`;
    const phoneText = hasPersonalPhone ? escape(p.phone) : `<span style="color:#dc2626;">[Phone Missing]</span>`;
    const addressText = p.address ? escape(p.address) : "Location Not Specified";

    const hasSummary = state.summary?.text && state.summary.text.trim().length > 0;
    const summaryText = hasSummary ? escape(state.summary.text) : "";
    const summaryBlock = hasSummary ? `<p style="font-size:13px; color:#334155; margin:0; line-height:1.6">${summaryText}</p>` : errBox("Summary", 7);

    const hasExp = state.experience && state.experience.length > 0;
    const expList = hasExp ? state.experience : [];
    const expBlock = (expRenderFn) => hasExp ? expList.map(expRenderFn).join("") : errBox("Experience", 5);

    const hasProj = state.projects && state.projects.length > 0;
    const projList = hasProj ? state.projects : [];
    const projBlock = (projRenderFn) => hasProj ? projList.map(projRenderFn).join("") : errBox("Projects", 4);

    const hasEdu = state.education && state.education.length > 0;
    const eduList = hasEdu ? state.education : [];
    const eduBlock = (eduRenderFn) => hasEdu ? eduList.map(eduRenderFn).join("") : errBox("Education", 2);

    const hasSkills = Boolean(tech || soft || lang || cert);
    const skillsParts = [];
    if (tech) skillsParts.push(`<div style="margin-bottom:6px"><strong>Technical:</strong> ${escape(tech)}</div>`);
    if (soft) skillsParts.push(`<div style="margin-bottom:6px"><strong>Soft Skills:</strong> ${escape(soft)}</div>`);
    if (lang) skillsParts.push(`<div style="margin-bottom:6px"><strong>Languages:</strong> ${escape(lang)}</div>`);
    if (cert) skillsParts.push(`<div style="margin-bottom:6px"><strong>Certifications:</strong> ${escape(cert)}</div>`);
    const skillsBlock = hasSkills ? `<div style="font-size:12.5px; color:#334155">${skillsParts.join("")}</div>` : errBox("Skills", 3);

    // Minimalist Layout
    if (theme.layout === "minimalist") {
      return `<div style="font-family:'Inter', sans-serif; color:#0f172a; line-height:1.5;">
        <div style="border-bottom:3px solid ${theme.primary}; padding-bottom:16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:flex-end">
          <div>
            <h1 style="margin:0; font-size:28px; font-weight:800; color:${theme.primary}">${escape(nameText)}</h1>
            <div style="font-size:14px; color:#475569; font-weight:600; margin-top:2px">${escape(headlineText)}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:64px;height:64px;border-radius:8px;object-fit:cover">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:12px; color:#64748b; margin-bottom:20px; border-bottom:1px solid #e2e8f0; padding-bottom:12px">
          <span>📧 ${escape(emailText)}</span>
          <span>📞 ${escape(phoneText)}</span>
          <span>📍 ${escape(addressText)}</span>
          ${p.linkedin ? `<span>🔗 <a href="${escape(p.linkedin)}" target="_blank" style="color:${theme.primary}">LinkedIn</a></span>` : ""}
          ${p.portfolio ? `<span>🌐 <a href="${escape(p.portfolio)}" target="_blank" style="color:${theme.primary}">Portfolio</a></span>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin:0 0 8px">Summary</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin:0 0 10px">Experience</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:12px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:13.5px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                    <span style="font-size:11.5px; color:#64748b">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                  </div>
                  <div style="font-size:12.5px; color:#475569; margin-top:2px">${escape(x.responsibilities || "")}</div>
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin:0 0 10px">Projects</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:12px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:13.5px; color:#0f172a">${escape(proj.name || "")}</strong>
                    <span style="font-size:11.5px; color:${theme.primary}">${escape(proj.tech || "")}</span>
                  </div>
                  <div style="font-size:12.5px; color:#475569; margin-top:2px">${escape(proj.description || "")}</div>
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin:0 0 8px">Skills</h3>
              ${skillsBlock}
            </div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:4px; margin:0 0 8px">Education</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:10px">
                  <strong style="font-size:13px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
                  <div style="font-size:11.5px; color:#94a3b8">${escape(edu.start || "")} - ${escape(edu.end || "")}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // Fresher Layout
    if (theme.layout === "fresher") {
      return `<div style="font-family:'Inter', sans-serif; color:#0e131f; line-height:1.5;">
        <div style="background:${theme.gradient}; padding:24px; border-radius:12px; color:#ffffff; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <h1 style="font-family:'Outfit', sans-serif; margin:0 0 4px; font-size:28px; font-weight:800">${nameText}</h1>
            <div style="font-size:14px; opacity:0.95; font-weight:600">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:70px;height:70px;border-radius:50%;object-fit:cover;border:3px solid #fff">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:12.5px; color:#475569; padding-bottom:14px; border-bottom:2px solid #f1f5f9; margin-bottom:20px">
          <span>📧 ${emailText}</span>
          <span>📞 ${phoneText}</span>
          <span>📍 ${addressText}</span>
          ${p.linkedin ? `<span>🔗 <a href="${escape(p.linkedin)}" target="_blank" style="color:${theme.primary}">LinkedIn</a></span>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-family:'Outfit', sans-serif; font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; border-bottom:2px solid ${theme.primary}33; padding-bottom:4px; margin:0 0 8px">Academic Objective & Summary</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-family:'Outfit', sans-serif; font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; border-bottom:2px solid ${theme.primary}33; padding-bottom:4px; margin:0 0 10px">Education & Qualifications</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:12px; background:#fffbf5; padding:10px; border-radius:8px; border-left:3px solid ${theme.primary}">
                  <strong style="font-size:14px; color:#0e131f; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12.5px; color:#64748b">${escape(edu.institution || "")}</div>
                  <div style="font-size:11.5px; color:#94a3b8">${escape(edu.start || "")} - ${escape(edu.end || "")}</div>
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-family:'Outfit', sans-serif; font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; border-bottom:2px solid ${theme.primary}33; padding-bottom:4px; margin:0 0 10px">Key Projects</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:12px">
                  <strong style="font-size:13.5px; color:#0e131f">${escape(proj.name || "")}</strong>
                  <div style="font-size:11.5px; color:${theme.primary}; font-weight:600">${escape(proj.tech || "")}</div>
                  <div style="font-size:12.5px; color:#475569; margin-top:2px">${escape(proj.description || "")}</div>
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-family:'Outfit', sans-serif; font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; border-bottom:2px solid ${theme.primary}33; padding-bottom:4px; margin:0 0 10px">Skills & Competencies</h3>
              ${skillsBlock}
            </div>
            <div>
              <h3 style="font-family:'Outfit', sans-serif; font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; border-bottom:2px solid ${theme.primary}33; padding-bottom:4px; margin:0 0 10px">Experience / Internships</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:12px">
                  <strong style="font-size:13.5px; color:#0e131f">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                  <div style="font-size:11.5px; color:#64748b">${escape(x.start || "")} - ${escape(x.end || "Present")}</div>
                  <div style="font-size:12.5px; color:#475569; margin-top:2px">${escape(x.responsibilities || "")}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // Creative Layout
    if (theme.layout === "creative") {
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0e131f; line-height:1.5;">
        <div style="background:${theme.gradient}; padding:28px; border-radius:16px; color:#ffffff; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 8px 24px rgba(125,42,232,0.15)">
          <div>
            <h1 style="margin:0 0 4px; font-size:32px; font-weight:800">${escape(nameText)}</h1>
            <div style="font-size:16px; opacity:0.95; font-weight:600">${escape(headlineText)}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:80px;height:80px;border-radius:20px;object-fit:cover;border:3px solid #fff">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:13px; color:#475569; padding-bottom:16px; border-bottom:2px dashed #e2e8f0; margin-bottom:24px">
          <span>📧 ${escape(emailText)}</span>
          <span>📞 ${escape(phoneText)}</span>
          <span>📍 ${escape(addressText)}</span>
          ${p.portfolio ? `<span>🌐 <a href="${escape(p.portfolio)}" target="_blank" style="color:${theme.primary};font-weight:700">Portfolio</a></span>` : ""}
        </div>
        <div style="margin-bottom:24px">
          <h3 style="font-size:16px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.04em; margin:0 0 8px">Creative Profile</h3>
          <p style="font-size:13.5px; color:#334155; margin:0; line-height:1.6">${escape(summaryText)}</p>
        </div>
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:28px">
          <div>
            <div style="margin-bottom:24px">
              <h3 style="font-size:16px; font-weight:800; color:${theme.primary}; text-transform:uppercase; margin:0 0 12px">Featured Work & Projects</h3>
              ${projList.map((proj) => `
                <div style="margin-bottom:14px; background:#faf5ff; padding:12px; border-radius:10px; border-left:4px solid ${theme.primary}">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:14.5px; color:#0e131f">${escape(proj.name || "")}</strong>
                    <span style="font-size:12px; color:${theme.primary}; font-weight:700">${escape(proj.tech || "")}</span>
                  </div>
                  <div style="font-size:13px; color:#475569; margin-top:4px">${escape(proj.description || "")}</div>
                </div>
              `).join("")}
            </div>
            <div>
              <h3 style="font-size:16px; font-weight:800; color:${theme.primary}; text-transform:uppercase; margin:0 0 12px">Experience</h3>
              ${expList.map((x) => `
                <div style="margin-bottom:14px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:14.5px; color:#0e131f">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                    <span style="font-size:12px; color:#64748b">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                  </div>
                  <div style="font-size:13px; color:#475569; margin-top:4px">${escape(x.responsibilities || "")}</div>
                </div>
              `).join("")}
            </div>
          </div>
          <div>
            <div style="margin-bottom:24px">
              <h3 style="font-size:16px; font-weight:800; color:${theme.primary}; text-transform:uppercase; margin:0 0 10px">Skills & Stack</h3>
              <div style="font-size:13px; color:#334155">${skillsParts.join("")}</div>
            </div>
            <div>
              <h3 style="font-size:16px; font-weight:800; color:${theme.primary}; text-transform:uppercase; margin:0 0 10px">Education</h3>
              ${eduList.map((edu) => `
                <div style="margin-bottom:12px">
                  <strong style="font-size:13.5px; color:#0e131f; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12.5px; color:#64748b">${escape(edu.institution || "")}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>`;
    }

    // Executive Layout
    if (theme.layout === "executive") {
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0f172a; line-height:1.5;">
        <div style="border-bottom:4px double ${theme.primary}; padding-bottom:18px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <h1 style="margin:0 0 4px; font-size:30px; font-weight:800; color:${theme.primary}; letter-spacing:-0.02em">${escape(nameText)}</h1>
            <div style="font-size:15px; color:#334155; font-weight:700">${escape(headlineText)}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:72px;height:72px;border-radius:10px;object-fit:cover;border:2px solid ${theme.primary}">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:20px; font-size:12.5px; color:#475569; padding-bottom:14px; border-bottom:1px solid #cbd5e1; margin-bottom:22px; font-weight:600">
          <span>EMAIL: ${escape(emailText)}</span>
          <span>PHONE: ${escape(phoneText)}</span>
          <span>LOCATION: ${escape(addressText)}</span>
        </div>
        <div style="margin-bottom:22px">
          <h3 style="font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin:0 0 8px">Executive Profile</h3>
          <p style="font-size:13.5px; color:#334155; margin:0; line-height:1.6">${escape(summaryText)}</p>
        </div>
        <div style="margin-bottom:22px">
          <h3 style="font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin:0 0 12px">Leadership & Professional Experience</h3>
          ${expList.map((x) => `
            <div style="margin-bottom:16px">
              <div style="display:flex; justify-content:space-between; align-items:baseline">
                <strong style="font-size:15px; color:#0f172a">${escape(x.title || "")} — ${escape(x.company || "")}</strong>
                <span style="font-size:12px; color:#64748b; font-weight:600">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
              </div>
              <div style="font-size:13px; color:#475569; margin-top:4px">${escape(x.responsibilities || "")}</div>
            </div>
          `).join("")}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <h3 style="font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin:0 0 10px">Strategic Core Competencies</h3>
            <div style="font-size:13px; color:#334155">${skillsParts.join("")}</div>
          </div>
          <div>
            <h3 style="font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin:0 0 10px">Education & Credentials</h3>
            ${eduList.map((edu) => `
              <div style="margin-bottom:10px">
                <strong style="font-size:13.5px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                <div style="font-size:12.5px; color:#64748b">${escape(edu.institution || "")}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>`;
    }

    // Default Modern Layout
    return `<div style="font-family:'Inter', sans-serif; color:#0e131f; line-height:1.5;">
      <div style="background: ${theme.gradient}; padding: 28px; border-radius: 12px; color: #ffffff; display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-family:'Outfit', sans-serif; margin: 0 0 4px; font-size: 30px; font-weight: 800; letter-spacing: -0.02em;">${nameText}</h1>
          <div style="font-size: 15px; font-weight: 600; opacity: 0.95;">${headlineText}</div>
        </div>
        ${p.photo ? `<img src="${p.photo}" style="width: 76px; height: 76px; border-radius: 50%; object-fit: cover; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.15)">` : ""}
      </div>

      <div style="display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; color: #475569; padding-bottom: 16px; border-bottom: 2px solid #f1f5f9; margin-bottom: 24px;">
        <span>📧 ${emailText}</span>
        <span>📞 ${phoneText}</span>
        <span>📍 ${addressText}</span>
        ${p.linkedin ? `<span>🔗 <a href="${escape(p.linkedin)}" target="_blank" style="color:${theme.primary};text-decoration:none">LinkedIn</a></span>` : ""}
        ${p.portfolio ? `<span>🌐 <a href="${escape(p.portfolio)}" target="_blank" style="color:${theme.primary};text-decoration:none">Portfolio</a></span>` : ""}
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
        <div>
          <div style="margin-bottom: 24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: ${theme.primary}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid ${theme.primary}22; padding-bottom: 4px; margin-bottom: 10px;">Professional Summary</h3>
            ${summaryBlock}
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: ${theme.primary}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid ${theme.primary}22; padding-bottom: 4px; margin-bottom: 12px;">Experience</h3>
            ${expBlock((x) => `
              <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <strong style="font-size: 14.5px; color: #0e131f;">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                  <span style="font-size: 12px; color: #64748b;">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                </div>
                <div style="font-size: 13px; color: #475569; margin-top: 4px;">${escape(x.responsibilities || "")}</div>
              </div>
            `)}
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: ${theme.primary}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid ${theme.primary}22; padding-bottom: 4px; margin-bottom: 12px;">Key Projects</h3>
            ${projBlock((proj) => `
              <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <strong style="font-size: 14.5px; color: #0e131f;">${escape(proj.name || "")}</strong>
                  <span style="font-size: 12px; color: ${theme.primary}; font-weight: 600;">${escape(proj.tech || "")}</span>
                </div>
                <div style="font-size: 13px; color: #475569; margin-top: 4px;">${escape(proj.description || "")}</div>
              </div>
            `)}
          </div>
        </div>

        <div>
          <div style="margin-bottom: 24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: ${theme.primary}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid ${theme.primary}22; padding-bottom: 4px; margin-bottom: 12px;">Skills</h3>
            ${skillsBlock}
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: ${theme.primary}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid ${theme.primary}22; padding-bottom: 4px; margin-bottom: 12px;">Education</h3>
            ${eduBlock((edu) => `
              <div style="margin-bottom: 12px;">
                <strong style="font-size: 14px; color: #0e131f; display: block;">${escape(edu.degree || "")}</strong>
                <div style="font-size: 12.5px; color: #64748b;">${escape(edu.institution || "")}</div>
                <div style="font-size: 12px; color: #94a3b8;">${escape(edu.start || "")} - ${escape(edu.end || "")}</div>
              </div>
            `)}
          </div>

          ${state.achievements?.length ? `
            <div style="margin-bottom: 24px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: ${theme.primary}; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid ${theme.primary}22; padding-bottom: 4px; margin-bottom: 12px;">Achievements</h3>
              ${state.achievements.map((ach) => `
                <div style="margin-bottom: 10px;">
                  <strong style="font-size: 13.5px; color: #0e131f; display: block;">${escape(ach.title || "")}</strong>
                  <div style="font-size: 12px; color: #64748b;">${escape(ach.org || "")} • ${escape(ach.date || "")}</div>
                </div>
              `).join("")}
            </div>
          ` : ""}
        </div>
      </div>
    </div>`;
  }

  // Export PDF with 3.5s page loader overlay & direct download via html2pdf
  function exportPDF(evt) {
    const btn = (evt && evt.target) ? evt.target.closest("button") : (evt || document.getElementById("exportPdf") || document.getElementById("fullExportPdf"));
    let originalContent = "";
    if (btn) {
      originalContent = btn.innerHTML;
      btn.disabled = true;
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.85";
      btn.innerHTML = `<span class="pdf-spinner"></span> Generating PDF...`;
    }

    const overlay = document.getElementById("pdfGenLoaderOverlay");
    if (overlay) {
      const fill = overlay.querySelector(".pdf-loader-progress-fill");
      if (fill) {
        fill.style.animation = "none";
        void fill.offsetWidth;
        fill.style.animation = "fillProgress 3.5s linear forwards";
      }
      overlay.setAttribute("aria-hidden", "false");
    }

    showToast("⏳ Generating high-quality PDF document, please wait...");

    setTimeout(() => {
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      tempDiv.style.width = "794px";
      tempDiv.style.background = "#ffffff";
      tempDiv.style.padding = "24px";
      tempDiv.style.boxSizing = "border-box";
      tempDiv.innerHTML = buildResumeHtml();
      document.body.appendChild(tempDiv);

      const rawName = state.personal?.fullName ? state.personal.fullName.trim().replace(/\s+/g, "_") : "My";
      const fileName = `${rawName}_Resume.pdf`;

      const cleanup = () => {
        if (overlay) overlay.setAttribute("aria-hidden", "true");
        if (tempDiv.parentNode) tempDiv.parentNode.removeChild(tempDiv);
        if (btn) {
          btn.disabled = false;
          btn.style.pointerEvents = "auto";
          btn.style.opacity = "1";
          btn.innerHTML = originalContent;
        }
      };

      if (typeof html2pdf !== "undefined") {
        const opt = {
          margin: [6, 6, 6, 6],
          filename: fileName,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf()
          .set(opt)
          .from(tempDiv)
          .save()
          .then(() => {
            cleanup();
            showToast("✅ PDF downloaded successfully!");
          })
          .catch((err) => {
            console.warn("html2pdf error, falling back to window print:", err);
            cleanup();
            fallbackPrint();
          });
      } else {
        cleanup();
        fallbackPrint();
      }
    }, 3500);
  }

  function fallbackPrint() {
    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Resume</title><style>body{font-family:Inter,Arial;margin:28px;color:#111827}.small{color:#6b7280}</style></head><body>${buildResumeHtml()}</body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => {
        w.print();
      }, 600);
    }
  }

  function exportPDF_blob() {
    // alternative: future enhancement
  }

  // Validation helpers
  function escape(s) {
    return String(s || "").replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  }

  // Update progress/completion estimation
  function updateProgress() {
    if (!progressFill || !progressPct) return;
    // compute simple completion: count non-empty top-level required fields
    const total = 6; // fullName,headline,email,phone, at least one education, at least one skill
    let done = 0;
    if (state.personal.fullName) done++;
    if (state.personal.headline) done++;
    if (state.personal.email) done++;
    if (state.personal.phone) done++;
    if (state.education.length > 0) done++;
    if (
      (state.skills?.technical && state.skills.technical.length > 0) ||
      (state.skills?.soft && state.skills.soft.length > 0) ||
      (state.skills?.languages && state.skills.languages.length > 0) ||
      (state.skills?.certifications && state.skills.certifications.length > 0)
    ) done++;
    const pct = Math.round((done / total) * 100);
    progressFill.style.width = `${pct}%`;
    progressPct.textContent = `${pct}%`;
  }

  /* Clear and reset helpers */
function clearLocalStorage() {
  try {
    Object.keys(localStorage).forEach((k) => {
      if (/resume|fresher|draft|resumeai/i.test(k)) localStorage.removeItem(k);
    });
  } catch (e) {
    console.warn("clearLocalStorage failed", e);
  }
}

function resetFormState() {
  state = {
    current: 1,
    personal: { fullName: "", headline: "", email: "", phone: "", address: "", linkedin: "", portfolio: "", photo: null },
    education: [],
    skills: { technical: [], soft: [], languages: [], certifications: [] },
    projects: [],
    experience: [],
    achievements: [],
    summary: { text: "" },
  };
  renderStep(1);
  renderLivePreview();
  updateProgress();
}

function resetSidebarProgress() {
  if (stepsNav) {
    const buttons = Array.from(stepsNav.querySelectorAll(".step"));
    buttons.forEach((btn) => {
      btn.classList.remove("completed", "active");
    });
  }
  state.current = 1;
  renderSidebar();
  if (progressFill) progressFill.style.width = "0%";
  if (progressPct) progressPct.textContent = "0%";
}

function clearAllData() {
  // Add a subtle reset animation
  mainCard.classList.add("reset-animate");
  setTimeout(() => mainCard.classList.remove("reset-animate"), 700);

  // Close confirm modal if open
  const cm = document.getElementById("confirmClearModal");
  if (cm) cm.setAttribute("aria-hidden", "true");

  // Reset app state and storage
  resetFormState();
  clearLocalStorage();
  resetSidebarProgress();

  // Clear preview and any open modal editors
  livePreview.innerHTML = "";
  document.querySelectorAll(".modal[aria-hidden='false']").forEach((m) => m.remove());

  // Give feedback
  showToast("All resume data has been cleared successfully.");

  saveState();
}

function showToast(msg, timeout = 3000) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  // make visible
  requestAnimationFrame(() => t.classList.add("visible"));
  setTimeout(() => {
    t.classList.remove("visible");
    setTimeout(() => t.remove(), 300);
  }, timeout);
}

/* ---------- Global Handlers ---------- */
  function attachGlobalHandlers() {
    // next/prev buttons
    const nextBtnEl = document.getElementById("nextBtn");
    if (nextBtnEl) {
      nextBtnEl.onclick = () => {
        if (state.current < stepsMeta.length - 1) {
          state.current++;
          renderStep(state.current);
          saveState();
        }
      };
    }

    const prevBtnEl = document.getElementById("prevBtn");
    if (prevBtnEl) {
      prevBtnEl.onclick = () => {
        if (state.current > 0) {
          state.current--;
          renderStep(state.current);
          saveState();
        }
      };
    }

    // Form completion validator
    function checkFormCompletion() {
      const missing = [];
      const p = state.personal || {};

      if (!p.fullName || !p.fullName.trim()) missing.push("Personal Information: Full Name");
      if (!p.headline || !p.headline.trim()) missing.push("Personal Information: Professional Headline");
      if (!p.email || !p.email.trim()) missing.push("Personal Information: Email");
      if (!p.phone || !p.phone.trim()) missing.push("Personal Information: Phone");

      if (!state.education || state.education.length === 0) {
        missing.push("Education Section: At least 1 education entry required");
      }

      const s = state.skills || {};
      const totalSkills = (s.technical?.length || 0) + (s.soft?.length || 0) + (s.languages?.length || 0) + (s.certifications?.length || 0);
      if (totalSkills === 0) {
        missing.push("Skills Section: At least 1 skill or certification required");
      }

      if (!state.projects || state.projects.length === 0) {
        missing.push("Projects Section: At least 1 project entry required");
      }

      if (!state.summary || !state.summary.text || !state.summary.text.trim()) {
        missing.push("Professional Summary: Summary text required");
      }

      return {
        isComplete: missing.length === 0,
        missingFields: missing
      };
    }

    // Fullscreen document helper functions
    function openFullscreenDocument() {
      const docModal = document.getElementById("docFullscreenModal");
      const fullCanvas = document.getElementById("fullscreenPaperCanvas");
      if (docModal && fullCanvas) {
        fullCanvas.innerHTML = buildResumeHtml();
        docModal.setAttribute("aria-hidden", "false");
      }
    }

    function closeFullscreenDocument() {
      const docModal = document.getElementById("docFullscreenModal");
      if (docModal) {
        docModal.setAttribute("aria-hidden", "true");
      }
    }

    // Attach Show Your Document click handlers
    document.getElementById("showDocDrawerBtn")?.addEventListener("click", openFullscreenDocument);
    document.getElementById("showDocBtn")?.addEventListener("click", openFullscreenDocument);
    document.getElementById("showDocFooterBtn")?.addEventListener("click", openFullscreenDocument);
    document.getElementById("closeDocFullscreen")?.addEventListener("click", closeFullscreenDocument);
    document.getElementById("fullExportPdf")?.addEventListener("click", (evt) => {
      exportPDF(evt);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeFullscreenDocument();
      }
    });

    // preview modal
    if (previewBtn) {
      previewBtn.onclick = () => {
        openFullscreenDocument();
      };
    }
    document
      .getElementById("closeModal")
      ?.addEventListener("click", () => {
        if (modal) modal.setAttribute("aria-hidden", "true");
      });
    document
      .getElementById("modalClose")
      ?.addEventListener("click", () => {
        if (modal) modal.setAttribute("aria-hidden", "true");
      });

    // save draft
    if (saveDraftBtn) {
      saveDraftBtn.onclick = () => {
        saveState();
        alert("Draft saved locally");
      };
    }

    // export and save from preview panel
    if (exportPdfBtn) exportPdfBtn.onclick = exportPDF;
    if (saveResumeBtn) {
      saveResumeBtn.onclick = () => {
        saveState();
        alert("Resume saved");
      };
    }

    // Clear All Data wiring
    const clearBtn = document.getElementById("clearAllBtn");
    const confirmModal = document.getElementById("confirmClearModal");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirmModal) confirmModal.setAttribute("aria-hidden", "false");
      });
    }
    document.getElementById("cancelClear")?.addEventListener("click", () => {
      if (confirmModal) confirmModal.setAttribute("aria-hidden", "true");
    });
    document.getElementById("closeConfirm")?.addEventListener("click", () => {
      if (confirmModal) confirmModal.setAttribute("aria-hidden", "true");
    });
    document.getElementById("confirmClear")?.addEventListener("click", () => {
      try {
        clearAllData();
      } catch (e) {
        console.warn("clear failed", e);
      }
    });

    // auto-save on unload
    window.addEventListener("beforeunload", () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    });

    // keyboard nav: arrows
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        if (state.current < stepsMeta.length - 1) {
          state.current++;
          renderStep(state.current);
          saveState();
        }
      }
      if (e.key === "ArrowLeft") {
        if (state.current > 0) {
          state.current--;
          renderStep(state.current);
          saveState();
        }
      }
    });

    // Theme Toggle Engine
    function initTheme() {
      const savedTheme = localStorage.getItem("resume_builder_theme") || "light";
      setTheme(savedTheme);
    }

    function setTheme(theme) {
      if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
      localStorage.setItem("resume_builder_theme", theme);
      updateThemeToggleIcons(theme);
    }

    function updateThemeToggleIcons(theme) {
      const toggleBtns = document.querySelectorAll("#themeToggle, .theme-toggle-btn");
      toggleBtns.forEach((btn) => {
        btn.textContent = theme === "dark" ? "☀️" : "🌙";
      });
    }

    const themeBtns = document.querySelectorAll("#themeToggle, .theme-toggle-btn");
    themeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
      });
    });

    initTheme();

    // Header Announcement Bar Close Handler
    const closeAnnouncement = document.getElementById("closeAnnouncement");
    const announcementBar = document.getElementById("announcementBar");
    if (closeAnnouncement && announcementBar) {
      closeAnnouncement.addEventListener("click", () => {
        announcementBar.style.display = "none";
      });
    }

    // Header Scroll Shadow & Active Link Highlight
    const siteHeader = document.getElementById("siteHeader");
    const navLinks = document.querySelectorAll(".nav .nav-link");
    if (siteHeader) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
          siteHeader.classList.add("scrolled");
        } else {
          siteHeader.classList.remove("scrolled");
        }

        // Active link scrollspy
        let currentSec = "";
        const sections = document.querySelectorAll("section[id]");
        sections.forEach((sec) => {
          const secTop = sec.offsetTop - 100;
          if (window.scrollY >= secTop) {
            currentSec = sec.getAttribute("id");
          }
        });
        if (currentSec && navLinks.length > 0) {
          navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            link.classList.toggle("active", href === `#${currentSec}`);
          });
        }
      });
    }

    // Mobile navbar toggle handler for landing page
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.querySelector(".nav");
    if (menuToggle && navMenu) {
      menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
      });
    }

    // Template Search & Category Filter handler for landing page
    const templateSearch = document.getElementById("templateSearch");
    const filterPills = document.querySelectorAll(".filter-pills .pill");
    const templateCards = document.querySelectorAll(".templates-grid .tmpl-card");
    const templatesGrid = document.querySelector(".templates-grid");
    const toggleTemplatesBtn = document.getElementById("toggleTemplatesBtn");
    const toggleWrap = document.querySelector(".show-more-templates-wrap");

    let activeCategory = "all";
    let searchQuery = "";
    let showAllTemplates = false;

    function getInitialRowLimit() {
      const width = window.innerWidth;
      if (width <= 1024) return 2;
      if (width <= 1240) return 3;
      return 4;
    }

    function applyTemplateFilters() {
      let visibleCount = 0;
      let staggeredIndex = 0;
      let matchIndex = 0;

      const isDefaultAllView = (activeCategory === "all" || activeCategory === "all templates") && !searchQuery;
      const initialLimit = getInitialRowLimit();

      templateCards.forEach((card) => {
        const cardCat = (card.getAttribute("data-category") || "").toLowerCase().trim();
        const title = (card.querySelector(".tmpl-title")?.textContent || "").toLowerCase();
        const tag = (card.querySelector(".tmpl-tag")?.textContent || "").toLowerCase();

        const matchesCat = activeCategory === "all" || activeCategory === "all templates" || cardCat === activeCategory || cardCat.includes(activeCategory);
        const matchesSearch = !searchQuery || title.includes(searchQuery) || tag.includes(searchQuery) || cardCat.includes(searchQuery);

        if (matchesCat && matchesSearch) {
          if (isDefaultAllView && !showAllTemplates && matchIndex >= initialLimit) {
            card.style.display = "none";
            card.style.animation = "none";
          } else {
            card.style.display = "flex";
            card.style.animation = "none";
            // Trigger reflow to restart CSS animation smoothly
            void card.offsetWidth;
            card.style.animation = `tmplCardPopIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${staggeredIndex * 0.05}s forwards`;
            staggeredIndex++;
            visibleCount++;
          }
          matchIndex++;
        } else {
          card.style.display = "none";
          card.style.animation = "none";
        }
      });

      // Update Explore All / Show Fewer button visibility & text
      if (toggleWrap && toggleTemplatesBtn) {
        if (isDefaultAllView && matchIndex > initialLimit) {
          toggleWrap.style.display = "block";
          if (showAllTemplates) {
            toggleTemplatesBtn.textContent = "Show Fewer Templates ↑";
          } else {
            toggleTemplatesBtn.textContent = "Explore All 15+ Templates ↓";
          }
        } else {
          toggleWrap.style.display = "none";
        }
      }

      let noResultEl = document.getElementById("noTemplatesFound");
      if (visibleCount === 0) {
        if (!noResultEl && templatesGrid) {
          noResultEl = document.createElement("div");
          noResultEl.id = "noTemplatesFound";
          noResultEl.className = "no-templates-found";
          noResultEl.innerHTML = `
            <h4>No templates found</h4>
            <p>Try searching for a different keyword or choose another category pill above.</p>
          `;
          templatesGrid.appendChild(noResultEl);
        }
      } else if (noResultEl) {
        noResultEl.remove();
      }
    }

    if (toggleTemplatesBtn) {
      toggleTemplatesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showAllTemplates = !showAllTemplates;
        applyTemplateFilters();
        if (!showAllTemplates && templatesGrid) {
          templatesGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    window.addEventListener("resize", () => {
      if (!showAllTemplates) {
        applyTemplateFilters();
      }
    });

    if (filterPills.length > 0 && templateCards.length > 0) {
      filterPills.forEach((pill) => {
        pill.addEventListener("click", (e) => {
          e.preventDefault();
          filterPills.forEach((p) => p.classList.remove("active"));
          pill.classList.add("active");

          const attr = pill.getAttribute("data-category");
          const text = pill.textContent.trim().toLowerCase();
          activeCategory = attr ? attr.toLowerCase() : text;
          if (activeCategory === "all templates") activeCategory = "all";

          showAllTemplates = false;
          searchQuery = "";
          if (templateSearch) templateSearch.value = "";

          applyTemplateFilters();
        });
      });

      // Initialize filter on load
      applyTemplateFilters();
    }

    const searchSuggestions = document.getElementById("searchSuggestions");
    let focusedSuggIndex = -1;

    const SUGGESTION_TAGS = [
      "Modern Minimalist", "Tech Specialist", "Software Engineer", "Minimalist Essential",
      "Clean Slate", "Creative Designer", "Artistic Showcase", "Executive Professional",
      "Corporate Director", "Senior Manager", "Fresher Academic", "Graduate Scholar",
      "ATS Optimized", "UI/UX Designer", "Internship Ready"
    ];

    function highlightMatch(text, query) {
      if (!query) return escape(text);
      const idx = text.toLowerCase().indexOf(query.toLowerCase());
      if (idx === -1) return escape(text);
      const before = text.substring(0, idx);
      const match = text.substring(idx, idx + query.length);
      const after = text.substring(idx + query.length);
      return `${escape(before)}<strong style="color:var(--canva-purple);font-weight:800">${escape(match)}</strong>${escape(after)}`;
    }

    function renderSearchSuggestions(query) {
      if (!searchSuggestions) return;
      if (!query || query.trim().length === 0) {
        searchSuggestions.setAttribute("aria-expanded", "false");
        searchSuggestions.innerHTML = "";
        focusedSuggIndex = -1;
        return;
      }

      const q = query.toLowerCase().trim();
      const matchingTags = SUGGESTION_TAGS.filter(t => t.toLowerCase().includes(q)).slice(0, 3);

      const matchingCards = Array.from(templateCards).filter(card => {
        const title = (card.querySelector(".tmpl-title")?.textContent || "").toLowerCase();
        const tag = (card.querySelector(".tmpl-tag")?.textContent || "").toLowerCase();
        const cat = (card.getAttribute("data-category") || "").toLowerCase();
        return title.includes(q) || tag.includes(q) || cat.includes(q);
      }).slice(0, 4);

      if (matchingTags.length === 0 && matchingCards.length === 0) {
        searchSuggestions.innerHTML = `
          <div class="sugg-section-title">No direct suggestions</div>
          <div style="padding:10px 12px;font-size:13px;color:var(--canva-muted)">Press Enter to search for "${escape(query)}"</div>
        `;
        searchSuggestions.setAttribute("aria-expanded", "true");
        return;
      }

      let html = "";
      if (matchingTags.length > 0) {
        html += `<div class="sugg-section-title">Suggested Keywords</div>`;
        matchingTags.forEach(tag => {
          html += `
            <div class="sugg-item" data-type="keyword" data-value="${escape(tag)}">
              <span class="sugg-icon">🔍</span>
              <span class="sugg-text">${highlightMatch(tag, q)}</span>
              <span class="sugg-category">Search</span>
            </div>
          `;
        });
      }

      if (matchingCards.length > 0) {
        html += `<div class="sugg-section-title" style="margin-top:6px">Matching Templates</div>`;
        matchingCards.forEach(card => {
          const title = card.querySelector(".tmpl-title")?.textContent || "";
          const tag = card.querySelector(".tmpl-tag")?.textContent || "";
          const cat = card.getAttribute("data-category") || "Template";

          html += `
            <div class="sugg-item" data-type="template" data-value="${escape(title)}">
              <span class="sugg-icon" style="background:rgba(0,196,204,0.12);color:var(--canva-cyan)">📄</span>
              <span class="sugg-text">${highlightMatch(title, q)} <span style="font-size:12px;font-weight:400;color:var(--canva-muted)">(${escape(tag.split('·')[0].trim())})</span></span>
              <span class="sugg-category">${escape(cat.toUpperCase())}</span>
            </div>
          `;
        });
      }

      searchSuggestions.innerHTML = html;
      searchSuggestions.setAttribute("aria-expanded", "true");
      focusedSuggIndex = -1;

      searchSuggestions.querySelectorAll(".sugg-item").forEach(item => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const val = item.getAttribute("data-value");
          if (val && templateSearch) {
            templateSearch.value = val;
            searchQuery = val.toLowerCase().trim();
            activeCategory = "all";
            filterPills.forEach((p) => {
              const attr = (p.getAttribute("data-category") || p.textContent).toLowerCase().trim();
              p.classList.toggle("active", attr === "all" || attr === "all templates");
            });
            applyTemplateFilters();
            searchSuggestions.setAttribute("aria-expanded", "false");
            if (templatesGrid) {
              templatesGrid.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        });
      });
    }

    if (templateSearch && templateCards.length > 0) {
      templateSearch.addEventListener("input", () => {
        searchQuery = templateSearch.value.trim().toLowerCase();
        if (searchQuery.length > 0) {
          activeCategory = "all";
          filterPills.forEach((p) => {
            const attr = (p.getAttribute("data-category") || p.textContent).toLowerCase().trim();
            p.classList.toggle("active", attr === "all" || attr === "all templates");
          });
        }
        applyTemplateFilters();
        renderSearchSuggestions(searchQuery);
      });

      templateSearch.addEventListener("focus", () => {
        if (templateSearch.value.trim().length > 0) {
          renderSearchSuggestions(templateSearch.value);
        }
      });

      document.addEventListener("click", (e) => {
        if (searchSuggestions && !e.target.closest(".search-bar-wrap")) {
          searchSuggestions.setAttribute("aria-expanded", "false");
        }
      });

      templateSearch.addEventListener("keydown", (e) => {
        const items = searchSuggestions ? searchSuggestions.querySelectorAll(".sugg-item") : [];

        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (items.length > 0) {
            focusedSuggIndex = (focusedSuggIndex + 1) % items.length;
            items.forEach((item, idx) => item.classList.toggle("focused", idx === focusedSuggIndex));
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (items.length > 0) {
            focusedSuggIndex = (focusedSuggIndex - 1 + items.length) % items.length;
            items.forEach((item, idx) => item.classList.toggle("focused", idx === focusedSuggIndex));
          }
        } else if (e.key === "Enter") {
          if (focusedSuggIndex >= 0 && items[focusedSuggIndex]) {
            e.preventDefault();
            items[focusedSuggIndex].click();
          } else {
            if (searchSuggestions) searchSuggestions.setAttribute("aria-expanded", "false");
            if (templatesGrid) {
              templatesGrid.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        } else if (e.key === "Escape") {
          if (searchSuggestions) searchSuggestions.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  // Start
  init();
})();

/* ==========================================================================
   INTERACTIVE MAGIC STAR SPARKLE TRAIL EFFECT
   ========================================================================== */
(function initMouseStarTrail() {
  // Disable stars and click circles on mobile, tablet & touch devices
  const isMobileOrTablet = () => window.innerWidth <= 1024 ||
                             ('ontouchstart' in window) ||
                             (navigator.maxTouchPoints > 0) ||
                             window.matchMedia("(pointer: coarse)").matches;

  if (isMobileOrTablet()) return;

  const canvas = document.createElement("canvas");
  canvas.id = "mouseStarCanvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  let rings = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    if (isMobileOrTablet()) {
      canvas.style.display = "none";
      particles = [];
      rings = [];
    } else {
      canvas.style.display = "block";
    }
  });

  const colors = [
    { r: 125, g: 42, b: 232 },  // Canva Purple
    { r: 0, g: 196, b: 204 },    // Vibrant Cyan
    { r: 244, g: 63, b: 94 },    // Glowing Pink/Red
    { r: 59, g: 130, b: 246 },   // Electric Blue
    { r: 245, g: 158, b: 11 },   // Neon Gold
    { r: 168, g: 85, b: 247 }    // Bright Violet
  ];

  let lastX = 0;
  let lastY = 0;

  function spawnSparks(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const vel = Math.random() * 1.0 + 0.4;
    particles.push({
      x: x + (Math.random() - 0.5) * 5,
      y: y + (Math.random() - 0.5) * 5,
      size: Math.random() * 4 + 2,
      vx: Math.cos(angle) * vel,
      vy: Math.sin(angle) * vel - 0.2,
      alpha: 0.9,
      decay: Math.random() * 0.012 + 0.008,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.07,
      color: color
    });
  }

  // Mouse Move Event Listener (desktop only - spawns 1 star every 12px movement)
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch" || isMobileOrTablet()) return;
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist > 12) {
      spawnSparks(e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });

  // Mouse Click Shockwave Burst (desktop only)
  window.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || isMobileOrTablet()) return;
    const color = colors[Math.floor(Math.random() * colors.length)];
    rings.push({
      x: e.clientX,
      y: e.clientY,
      r: 2,
      maxR: 30,
      alpha: 0.9,
      color: color
    });

    // Balanced burst of 10 glowing stars
    for (let i = 0; i < 10; i++) {
      const c = colors[Math.floor(Math.random() * colors.length)];
      const angle = (Math.PI * 2 / 10) * i + Math.random() * 0.2;
      const vel = Math.random() * 1.8 + 0.9;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4.5 + 2.5,
        vx: Math.cos(angle) * vel,
        vy: Math.sin(angle) * vel,
        alpha: 0.95,
        decay: Math.random() * 0.012 + 0.006,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.1,
        color: c
      });
    }
  });

  function drawStar(x, y, size, rotation, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const isDarkTheme = document.documentElement.getAttribute("data-theme") === "dark";

    if (isDarkTheme) {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      ctx.shadowBlur = 14;
    } else {
      // Light Theme: Vibrant colored fill + crisp white stroke so stars pop on white backgrounds!
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.95})`;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
      ctx.lineWidth = 0.8;
      ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.6})`;
      ctx.shadowBlur = 8;
    }

    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
      ctx.lineTo(Math.cos(((i + 0.5) * Math.PI) / 2) * (size * 0.35), Math.sin(((i + 0.5) * Math.PI) / 2) * (size * 0.35));
    }
    ctx.closePath();
    ctx.fill();
    if (!isDarkTheme) {
      ctx.stroke();
    }
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Render Thin & Sleek Shockwave Rings
    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      ring.r += (ring.maxR - ring.r) * 0.12;
      ring.alpha -= 0.02;

      if (ring.alpha <= 0) {
        rings.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.strokeStyle = `rgba(${ring.color.r}, ${ring.color.g}, ${ring.color.b}, ${ring.alpha})`;
      ctx.lineWidth = 1.0;
      ctx.shadowColor = `rgba(${ring.color.r}, ${ring.color.g}, ${ring.color.b}, ${ring.alpha * 0.6})`;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Render Star Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      drawStar(p.x, p.y, p.size, p.rotation, p.alpha, p.color);
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();

/* ---------- Screensaver System (1 Minute Inactivity) ---------- */
(function initScreensaver() {
  const IDLE_TIMEOUT_MS = 60000; // 60 seconds = 1 minute
  let idleTimer = null;
  let clockInterval = null;

  const overlay = document.getElementById("screensaverOverlay");
  const clockEl = document.getElementById("screensaverClock");
  const dateEl = document.getElementById("screensaverDate");
  const quoteEl = document.getElementById("screensaverQuoteText");

  const quotes = [
    '"The secret of getting ahead is getting started." — Mark Twain',
    '"Opportunities don\'t happen, you create them." — Chris Grosser',
    '"Failure is the opportunity to begin again more intelligently." — Henry Ford',
    '"Your time is limited, don\'t waste it living someone else\'s life." — Steve Jobs',
    '"Believe you can and you\'re halfway there." — Theodore Roosevelt',
    '"Success is not final, failure is not fatal: It is the courage to continue that counts." — Winston Churchill'
  ];

  function updateClock() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  }

  function showScreensaver() {
    if (!overlay) return;
    updateClock();
    if (quoteEl) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      quoteEl.textContent = randomQuote;
    }
    overlay.setAttribute("aria-hidden", "false");
    if (!clockInterval) {
      clockInterval = setInterval(updateClock, 1000);
    }
  }

  function hideScreensaver() {
    if (!overlay) return;
    if (overlay.getAttribute("aria-hidden") === "false") {
      overlay.setAttribute("aria-hidden", "true");
    }
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
    resetIdleTimer();
  }

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(showScreensaver, IDLE_TIMEOUT_MS);
  }

  // Event listeners to detect activity and hide screensaver
  const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "pointerdown", "scroll"];
  activityEvents.forEach((evtName) => {
    window.addEventListener(evtName, () => {
      if (overlay && overlay.getAttribute("aria-hidden") === "false") {
        hideScreensaver();
      } else {
        resetIdleTimer();
      }
    }, { passive: true });
  });

  // Start initial timer
  resetIdleTimer();
})();
