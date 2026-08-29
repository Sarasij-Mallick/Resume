
// Instant Page Ready Handler
(function initPage() {
  var oldPreloader = document.getElementById("pagePreloader");
  if (oldPreloader) oldPreloader.remove();
})();



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


// ── FAST ANIMATED NUMBER COUNTER SYSTEM ───────────────────
(function () {
  function formatNumber(val, decimals, hasComma) {
    var str = val.toFixed(decimals);
    if (hasComma) {
      var parts = str.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }
    return str;
  }

  function animateSingleCounter(el, duration) {
    if (!el || el.dataset.counterStarted === "true") return;
    el.dataset.counterStarted = "true";

    var durationMs = duration || 1400;
    var originalText = el.getAttribute('data-final-val') || el.textContent.trim();
    el.setAttribute('data-final-val', originalText);

    var match = originalText.match(/^(.*?)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    var prefix = match[1];
    var rawNum = match[2];
    var suffix = match[3];

    var hasComma = rawNum.includes(',');
    var decimals = rawNum.includes('.') ? rawNum.split('.')[1].length : 0;
    var targetVal = parseFloat(rawNum.replace(/,/g, ''));

    if (isNaN(targetVal)) return;

    var startTime = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / durationMs, 1);
      var eased = easeOutCubic(progress);
      var currentVal = targetVal * eased;

      el.textContent = prefix + formatNumber(currentVal, decimals, hasComma) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = originalText;
      }
    }

    // Set initial 0 state immediately
    el.textContent = prefix + formatNumber(0, decimals, hasComma) + suffix;
    requestAnimationFrame(step);
  }

  window.animateCounter = animateSingleCounter;

  function initCounters() {
    var targets = document.querySelectorAll('.stat-num, [data-counter], .counter-num, #bannerStat');
    if (!targets.length) return;

    targets.forEach(function (el) {
      if (!el.getAttribute('data-final-val')) {
        el.setAttribute('data-final-val', el.textContent.trim());
      }
      el.dataset.counterStarted = "false";
    });

    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateSingleCounter(entry.target, 1400);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -10px 0px' }
      );

      targets.forEach(function (el) {
        counterObserver.observe(el);
      });
    } else {
      targets.forEach(function (el) {
        animateSingleCounter(el, 1400);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }
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

  // ── CURATED DIVERSE RESUME TEMPLATES CATALOG (1 Best Template Per Category) ──
  const TEMPLATE_CLUSTERS = [
    { cat: "minimalist", badge: "Universal", tags: "modern minimalist pro clean ats corporate professional simple", roles: [
      { id: "modern-minimalist", title: "Modern Minimalist Pro", sub: "Clean · ATS Optimized · Corporate · Professional", layout: "standard", p: "#7d2ae8", s: "#00c4cc", h: "linear-gradient(135deg, #7d2ae8, #00c4cc)" }
    ]},
    { cat: "tech", badge: "Tech", tags: "tech software developer engineer coding cloud devops", roles: [
      { id: "modern-tech", title: "Tech Lead & Software Engineer", sub: "Full-Stack · Left Sidebar · Systems Architecture", layout: "left-sidebar", p: "#3b82f6", s: "#94a3b8", bg: "#0f172a" }
    ]},
    { cat: "tech", badge: "AI", tags: "ai machine learning data science python deep learning", roles: [
      { id: "ai-engineer", title: "AI & Machine Learning Researcher", sub: "Deep Learning · Neural Models & Python Analytics", layout: "standard", p: "#4f46e5", s: "#06b6d4", h: "linear-gradient(135deg, #4f46e5, #06b6d4)" }
    ]},
    { cat: "creative", badge: "Design", tags: "ui/ux design graphic creative portfolio branding figma", roles: [
      { id: "uiux-pro", title: "UI/UX & Product Design Lead", sub: "Figma Design Systems · User Journey & Wireframes", layout: "left-sidebar", p: "#a855f7", s: "#d8b4fe", bg: "#18181b" }
    ]},
    { cat: "corporate", badge: "Analyst", tags: "business analyst consulting strategy corporate finance", roles: [
      { id: "executive-pro", title: "Business Analyst & Strategy Lead", sub: "Quantitative Insights · Consulting & BI Leadership", layout: "executive", p: "#059669", s: "#047857" }
    ]},
    { cat: "corporate", badge: "Executive", tags: "executive director c-suite leadership management governance", roles: [
      { id: "executive-director", title: "Executive Director & Board VP", sub: "C-Suite Governance · Global Operational Growth", layout: "executive", p: "#1e3a8a", s: "#3b82f6" }
    ]},
    { cat: "corporate", badge: "Sales", tags: "sales growth marketing digital revenue campaigns", roles: [
      { id: "marketing-colorful", title: "Growth & Digital Marketing Lead", sub: "Growth Marketing · Social Media & Paid Ad Campaigns", layout: "standard", p: "#f43f5e", s: "#fb7185", h: "linear-gradient(135deg, #f43f5e, #fb7185)" }
    ]},
    { cat: "academic", badge: "Academic", tags: "academic scholarship ivy league oxford researcher education cv", roles: [
      { id: "minimalist-ivy", title: "Ivy League Academic & Scholarship", sub: "Oxford Serif · Research Fellowship & Grants", layout: "centered", p: "#7f1d1d", s: "#991b1b" }
    ]},
    { cat: "fresher", badge: "Fresher", tags: "fresher starter student high school college internship entry level", roles: [
      { id: "fresher-starter", title: "Fresher & Student Starter", sub: "Skills-First · Internship Ready & Education", layout: "starter", p: "#0d9488", s: "#06b6d4", bg: "#0d9488" }
    ]},
    { cat: "corporate", badge: "Finance", tags: "cpa accounting finance audit legal compliance tax", roles: [
      { id: "minimalist-monochrome", title: "CPA Accounting & Financial Audit", sub: "Monochrome · Tax Compliance & Analytics", layout: "left-sidebar", p: "#171717", s: "#404040", bg: "#171717" }
    ]},
    { cat: "creative", badge: "Media", tags: "acting media theatre film headshot portfolio performing arts", roles: [
      { id: "creative-artistic", title: "Media & Performing Arts Portfolio", sub: "Headshot Showcase · Stage & Screen Casting CV", layout: "standard", p: "#ec4899", s: "#f97316", h: "linear-gradient(135deg, #ec4899, #f97316)", isPhoto: true }
    ]},
    { cat: "tech", badge: "STEM", tags: "stem robotics engineering cad automation hardware", roles: [
      { id: "stem-robotics", title: "STEM Mechanical & Robotics Engineer", sub: "CAD Modeling · Automation Systems & Hardware Prototyping", layout: "executive", p: "#334155", s: "#64748b" }
    ]}
  ];

  const ALL_320_TEMPLATES = [];
  TEMPLATE_CLUSTERS.forEach(cluster => {
    cluster.roles.forEach(role => {
      ALL_320_TEMPLATES.push({
        id: role.id,
        key: role.id,
        name: role.title,
        title: role.title,
        tag: role.sub,
        badge: cluster.badge,
        category: cluster.cat.charAt(0).toUpperCase() + cluster.cat.slice(1),
        tags: `${cluster.tags} ${role.title.toLowerCase()} ${cluster.cat}`,
        layout: role.layout || "standard",
        gradient: role.h || `linear-gradient(135deg, ${role.p}, ${role.s || '#3b82f6'})`,
        headBg: role.h,
        primary: role.p,
        secondary: role.s,
        accent: role.s || "#00c4cc",
        sidebarBg: role.bg || role.p,
        isPhoto: role.isPhoto || false
      });
    });
  });

  const TEMPLATES_THEMES = {};
  ALL_320_TEMPLATES.forEach((t) => {
    TEMPLATES_THEMES[t.id] = t;
  });

  function getTemplateTheme(key) {
    if (TEMPLATES_THEMES[key]) return TEMPLATES_THEMES[key];
    const found = ALL_320_TEMPLATES.find((t) => t.id === key);
    if (found) return found;
    return TEMPLATES_THEMES["modern-minimalist"] || ALL_320_TEMPLATES[0];
  }

  const stepsMeta = [
    { id: 0, key: "templates", title: "Choose Template & Custom Colors" },
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
    customColor: null,
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
    loadState();
    if (!state.current || state.current === 0) {
      state.current = 1;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const templateParam = urlParams.get("template");
      if (templateParam) {
        state.selectedTemplate = templateParam;
        const currentTheme = getTemplateTheme(templateParam);
        if (currentTheme && (!state.personal.headline || state.personal.headline.trim() === "" || state.personal.headline === "Full-Stack Software Engineer & CS Graduate")) {
          state.personal.headline = currentTheme.name;
        }
        saveState();
      }
    } catch (e) {}

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
    
    // Instant sharp render on step change
    mainCard.innerHTML = "";

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

  // 0. Templates Selector (Clean, fast & searchable with Color Customizer)
  function renderTemplatesSelector() {
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    const selectedKey = state.selectedTemplate || "modern-minimalist";
    const activeCustomHex = state.customColor || "#3b82f6";

    wrapper.innerHTML = `
      <!-- Live Template Color Palette Customizer Card -->
      <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:12px 14px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.03)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <strong style="font-size:13px;color:#0f172a;display:flex;align-items:center;gap:6px">
            🎨 <span>Customize Template Color Theme</span>
          </strong>
          <button id="drawerResetColorBtn" type="button" style="border:none;background:#e2e8f0;color:#475569;font-size:11px;font-weight:700;padding:3px 9px;border-radius:10px;cursor:pointer" title="Reset to template default color">Reset Default</button>
        </div>
        
        <p style="margin:0 0 10px;font-size:12px;color:var(--canva-muted)">Click any color palette or pick a custom hex color to change your resume accent:</p>
        
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <div class="drawer-color-swatches" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <button type="button" class="color-swatch-dot ${state.customColor === '#2563eb' ? 'active' : ''}" data-color="#2563eb" style="background:#2563eb;width:22px;height:22px" title="Royal Blue"></button>
            <button type="button" class="color-swatch-dot ${state.customColor === '#7c3aed' ? 'active' : ''}" data-color="#7c3aed" style="background:#7c3aed;width:22px;height:22px" title="Electric Violet"></button>
            <button type="button" class="color-swatch-dot ${state.customColor === '#059669' ? 'active' : ''}" data-color="#059669" style="background:#059669;width:22px;height:22px" title="Emerald Green"></button>
            <button type="button" class="color-swatch-dot ${state.customColor === '#dc2626' ? 'active' : ''}" data-color="#dc2626" style="background:#dc2626;width:22px;height:22px" title="Ruby Red"></button>
            <button type="button" class="color-swatch-dot ${state.customColor === '#ea580c' ? 'active' : ''}" data-color="#ea580c" style="background:#ea580c;width:22px;height:22px" title="Sunset Orange"></button>
            <button type="button" class="color-swatch-dot ${state.customColor === '#d97706' ? 'active' : ''}" data-color="#d97706" style="background:#d97706;width:22px;height:22px" title="Amber Gold"></button>
            <button type="button" class="color-swatch-dot ${state.customColor === '#0284c7' ? 'active' : ''}" data-color="#0284c7" style="background:#0284c7;width:22px;height:22px" title="Ocean Cyan"></button>
            <button type="button" class="color-swatch-dot ${state.customColor === '#0f766e' ? 'active' : ''}" data-color="#0f766e" style="background:#0f766e;width:22px;height:22px" title="Deep Teal"></button>
            <button type="button" class="color-swatch-dot ${state.customColor === '#e11d48' ? 'active' : ''}" data-color="#e11d48" style="background:#e11d48;width:22px;height:22px" title="Rose Magenta"></button>
            <button type="button" class="color-swatch-dot ${state.customColor === '#0f172a' ? 'active' : ''}" data-color="#0f172a" style="background:#0f172a;width:22px;height:22px" title="Midnight Slate"></button>
          </div>
          
          <label style="display:inline-flex;align-items:center;gap:6px;background:#ffffff;border:1px solid #cbd5e1;padding:3px 10px;border-radius:8px;font-size:12px;font-weight:700;color:#334155;cursor:pointer">
            <span>Custom Color:</span>
            <input type="color" id="drawerColorPicker" value="${activeCustomHex}" style="width:24px;height:24px;border:none;border-radius:4px;cursor:pointer;padding:0">
          </label>
        </div>
      </div>

      <p style="margin:0 0 10px;font-size:13.5px;color:var(--canva-muted)">Choose any of 300+ professional template styles to customize your resume layout:</p>
      
      <div style="margin-bottom:12px">
        <input type="text" id="tmplStudioSearch" placeholder="🔍 Search template by role (e.g. Python, Teacher, Sales, Analyst, Design)..." style="width:100%;padding:9px 14px;border-radius:8px;border:1px solid #cbd5e1;font-size:13px;background:#ffffff">
      </div>

      <div class="filter-pills" style="margin-bottom:14px;justify-content:flex-start;overflow-x:auto;padding-bottom:4px;white-space:nowrap">
        <button class="pill active" data-cat="all" style="padding:5px 12px;font-size:12px">All</button>
        <button class="pill" data-cat="tech" style="padding:5px 12px;font-size:12px">Tech & Coding</button>
        <button class="pill" data-cat="creative" style="padding:5px 12px;font-size:12px">UI/UX & Design</button>
        <button class="pill" data-cat="corporate" style="padding:5px 12px;font-size:12px">Corporate & Exec</button>
        <button class="pill" data-cat="academic" style="padding:5px 12px;font-size:12px">Academic & Teacher</button>
        <button class="pill" data-cat="fresher" style="padding:5px 12px;font-size:12px">Fresher & Intern</button>
        <button class="pill" data-cat="minimalist" style="padding:5px 12px;font-size:12px">Minimalist & ATS</button>
      </div>

      <div class="template-select-grid" id="tmplDrawerGrid" style="max-height:380px;overflow-y:auto;padding-right:4px">
        ${ALL_320_TEMPLATES.map((t) => `
          <div class="tmpl-select-card ${t.id === selectedKey ? 'selected' : ''}" data-key="${t.id}" data-category="${t.category.toLowerCase()}" data-tags="${t.tags.toLowerCase()} ${t.name.toLowerCase()}">
            <div class="tmpl-select-swatch" style="background:${state.customColor || t.gradient}"></div>
            <div class="tmpl-select-info">
              <div class="tmpl-select-name">${escape(t.name)}</div>
              <div class="tmpl-select-tag">${escape(t.category)} · ${escape(t.tag)}</div>
            </div>
            ${t.id === selectedKey ? `<span style="color:var(--canva-purple);font-weight:800;font-size:16px">✓</span>` : ''}
          </div>
        `).join("")}
      </div>

      <div class="actions" style="margin-top:20px">
        <div style="flex:1"></div>
        <button id="toNextFromTmpl" class="btn primary">Next: Personal Info ›</button>
      </div>
    `;

    // Hook drawer color picker
    const drawerPicker = wrapper.querySelector("#drawerColorPicker");
    if (drawerPicker) {
      drawerPicker.addEventListener("input", (e) => applyCustomColor(e.target.value));
      drawerPicker.addEventListener("change", (e) => applyCustomColor(e.target.value));
    }

    wrapper.querySelector("#drawerResetColorBtn")?.addEventListener("click", () => {
      resetCustomColor();
      renderStep(0);
    });

    wrapper.querySelectorAll(".drawer-color-swatches .color-swatch-dot").forEach((dot) => {
      dot.onclick = () => {
        const c = dot.dataset.color;
        if (c) {
          applyCustomColor(c);
          renderStep(0);
        }
      };
    });

    const searchInput = wrapper.querySelector("#tmplStudioSearch");
    const pills = wrapper.querySelectorAll(".filter-pills .pill");
    const cards = wrapper.querySelectorAll(".tmpl-select-card");

    let currentCat = "all";

    function filterCards() {
      const q = (searchInput?.value || "").trim().toLowerCase();
      cards.forEach((c) => {
        const cCat = c.dataset.category || "";
        const cTags = c.dataset.tags || "";
        const matchesCat = currentCat === "all" || cCat.includes(currentCat) || cTags.includes(currentCat);
        const matchesQuery = !q || cTags.includes(q);

        if (matchesCat && matchesQuery) {
          c.style.display = "flex";
        } else {
          c.style.display = "none";
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", filterCards);
    }

    pills.forEach((p) => {
      p.onclick = () => {
        pills.forEach((el) => el.classList.remove("active"));
        p.classList.add("active");
        currentCat = (p.dataset.cat || "all").toLowerCase();
        filterCards();
      };
    });

    cards.forEach((c) => {
      c.onclick = () => {
        const key = c.dataset.key;
        state.selectedTemplate = key;
        const chosenTheme = getTemplateTheme(key);
        if (chosenTheme && (!state.personal.headline || state.personal.headline === "" || state.personal.headline === "Full-Stack Software Engineer & CS Graduate")) {
          state.personal.headline = chosenTheme.name;
        }
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
          if (typeof updateAtsScore === "function") updateAtsScore();
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
      <div class="field"><label>Professional Suggestions</label><div class="entry"><div class="small muted">Try: "Recent Computer Science graduate with internship experience in full-stack development..."</div></div></div>
      <div class="actions"><div style="flex:1"></div><button id="saveSum" class="btn neutral">Save</button><button id="toNext7" class="btn primary">Next</button></div>`;
    const ta = wrapper.querySelector("#summaryText");
    const charCount = wrapper.querySelector("#charCount");
    charCount.textContent = (ta.value || "").length;
    ta.addEventListener("input", () => {
      state.summary.text = ta.value;
      charCount.textContent = ta.value.length;
      if (typeof updateAtsScore === "function") updateAtsScore();
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
        <h4 style="margin:0 0 6px;color:#059669;font-size:16px">Forms Complete! Document Ready</h4>
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

  function applyCustomColor(color) {
    state.customColor = color;
    saveState();
    updateColorSwatchesActiveState();
    renderLivePreview();
  }

  function resetCustomColor() {
    state.customColor = null;
    saveState();
    updateColorSwatchesActiveState();
    renderLivePreview();
  }

  function updateColorSwatchesActiveState() {
    const key = state.selectedTemplate || "modern-minimalist";
    const currentTheme = getTemplateTheme(key);
    const currentColor = (state.customColor || currentTheme.primary || "").toLowerCase();

    document.querySelectorAll(".color-swatch-dot").forEach((dot) => {
      const dotColor = (dot.dataset.color || "").toLowerCase();
      dot.classList.toggle("active", dotColor === currentColor);
    });

    const topPicker = document.getElementById("templateColorPicker");
    if (topPicker && state.customColor) {
      topPicker.value = state.customColor;
    }
    const drawerPicker = document.getElementById("drawerColorPicker");
    if (drawerPicker && state.customColor) {
      drawerPicker.value = state.customColor;
    }

    const indicator = document.getElementById("customColorIndicator");
    if (indicator) {
      if (state.customColor) {
        indicator.style.background = state.customColor;
        indicator.textContent = "✓";
        indicator.style.color = "#ffffff";
      } else {
        indicator.style.background = "conic-gradient(from 180deg, red, yellow, lime, aqua, blue, magenta, red)";
        indicator.textContent = "✨";
        indicator.style.color = "inherit";
      }
    }
  }

  function renderLivePreview() {
    const paperCanvas = document.getElementById("paperCanvas");
    if (paperCanvas) {
      paperCanvas.innerHTML = buildResumeHtml();
    }
    if (livePreview) {
      livePreview.innerHTML = buildLivePreviewHtml();
    }
    const tmplNameEl = document.getElementById("activeTemplateName");
    if (tmplNameEl) {
      const key = state.selectedTemplate || "modern-minimalist";
      const currentTheme = getTemplateTheme(key);
      tmplNameEl.textContent = currentTheme?.name || "Modern Minimalist";
    }
    updateColorSwatchesActiveState();
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
    const baseTheme = getTemplateTheme(key);
    const activeColor = state.customColor || state.accentColor || baseTheme.primary || "#3b82f6";
    const activeSecondary = state.customSecondary || (state.customColor ? state.customColor : (baseTheme.secondary || activeColor));
    const activeGradient = state.customColor
      ? `linear-gradient(135deg, ${activeColor} 0%, ${activeSecondary} 100%)`
      : (baseTheme.gradient || `linear-gradient(135deg, ${activeColor} 0%, ${activeSecondary} 100%)`);
    const theme = {
      ...baseTheme,
      primary: activeColor,
      secondary: activeSecondary,
      gradient: activeGradient,
      sidebarBg: (state.customColor && baseTheme.layout === "left-sidebar" ? activeColor : (baseTheme.sidebarBg || activeColor)),
      headerBg: (state.customColor ? activeColor : (baseTheme.headerBg || activeColor))
    };
    const activeFont = state.fontFamily || theme.font || "'Outfit', 'Inter', sans-serif";

    const hasPersonalName = Boolean(p.fullName && p.fullName.trim().length > 0);
    const hasPersonalHeadline = Boolean(p.headline && p.headline.trim().length > 0);
    const hasPersonalEmail = Boolean(p.email && p.email.trim().length > 0);
    const hasPersonalPhone = Boolean(p.phone && p.phone.trim().length > 0);

    const sampleExpList = [
      {
        title: "Software Engineering Intern",
        company: "TechNova Solutions",
        type: "Internship",
        start: "Jun 2023",
        end: "Dec 2023",
        responsibilities: "• Developed interactive responsive user interfaces using React and modern CSS, boosting user engagement by 28%.\n• Built RESTful API endpoints and integrated database caching layer, reducing response latency by 35%.\n• Collaborated with senior engineers in an agile sprint environment to deliver clean, unit-tested code."
      },
      {
        title: "Frontend Web Developer (Project Lead)",
        company: "Campus Developer Community",
        type: "Part-Time",
        start: "Jan 2023",
        end: "May 2023",
        responsibilities: "• Led a team of 4 student developers to build the official university event portal used by 5,000+ active students.\n• Implemented automated CI/CD deployment pipelines using GitHub Actions."
      }
    ];

    const sampleProjList = [
      {
        name: "Cloud Task Orchestration & Management System",
        tech: "React, Node.js, Express, MongoDB, TailwindCSS",
        github: "https://github.com/alexmorgan/cloud-tasks",
        demo: "https://cloudtasks.demo.app",
        description: "• Built a full-stack distributed task manager with real-time WebSocket notifications and role-based JWT authentication.\n• Implemented drag-and-drop Kanban workflow and automated analytics dashboard."
      },
      {
        name: "AI-Powered Resume & Portfolio Builder",
        tech: "JavaScript, HTML5/CSS3, Vite, REST API",
        github: "https://github.com/alexmorgan/resume-builder",
        demo: "https://alexbuilder.demo.app",
        description: "• Engineered interactive live client-side PDF export tool with 20+ customizable theme palettes.\n• Designed accessible, responsive UI with WCAG 2.1 compliance."
      }
    ];

    const sampleEduList = [
      {
        degree: "B.Tech / B.S. in Computer Science & Engineering",
        institution: "State University of Technology",
        start: "2020",
        end: "2024"
      }
    ];

    const sampleAchList = [
      {
        title: "1st Place Winner - National Hackathon 2023",
        org: "TechFest Innovation Summit",
        date: "Nov 2023",
        description: "Built an automated disaster alert platform among 150+ competing teams."
      },
      {
        title: "Dean's List for Academic Excellence",
        org: "School of Engineering",
        date: "2022 - 2023",
        description: "Maintained top 5% GPA across consecutive academic semesters."
      }
    ];

    const defaultSummary = "Enthusiastic and results-driven Computer Science graduate with hands-on experience in full-stack web development, modern frontend frameworks, and RESTful API architecture. Passionate about building high-performance, user-centric web applications and eager to contribute to innovative software engineering teams.";
    const defaultTechSkills = ["JavaScript (ES6+)", "TypeScript", "React.js", "Node.js", "Express", "HTML5 & CSS3", "Python", "SQL / PostgreSQL", "Git & GitHub", "Docker", "REST APIs"];
    const defaultSoftSkills = ["Problem Solving", "Agile / Scrum", "Team Collaboration", "Fast Learner", "Effective Communication"];
    const defaultLanguages = "English (Professional Working), Bengali (Native / Fluent), Hindi (Conversational)";
    const defaultCerts = "AWS Certified Cloud Practitioner, Meta Certified Frontend Developer";

    const nameText = hasPersonalName ? escape(p.fullName) : "Alex Morgan";
    const headlineText = hasPersonalHeadline ? escape(p.headline) : (theme.name || "Junior Full Stack Developer & CS Graduate");
    const emailText = hasPersonalEmail ? escape(p.email) : "alex.morgan@example.com";
    const phoneText = hasPersonalPhone ? escape(p.phone) : "+1 (555) 019-2834";
    const addressText = (p.address && p.address.trim().length > 0) ? escape(p.address) : "San Francisco, CA, USA";
    const linkedinUrl = (p.linkedin && p.linkedin.trim().length > 0) ? escape(p.linkedin) : "https://linkedin.com/in/alexmorgan";
    const portfolioUrl = (p.portfolio && p.portfolio.trim().length > 0) ? escape(p.portfolio) : "https://alexmorgan.dev";

    const hasSummary = Boolean(state.summary?.text && state.summary.text.trim().length > 0);
    const summaryText = hasSummary ? escape(state.summary.text) : defaultSummary;
    const summaryBlock = `<p style="font-size:13px; color:#334155; margin:0; line-height:1.65; overflow-wrap:break-word; white-space:normal; max-width:100%; box-sizing:border-box;">${summaryText}</p>`;

    const hasExp = Boolean(state.experience && state.experience.length > 0);
    const expList = hasExp ? state.experience : sampleExpList;
    const expBlock = (expRenderFn) => expList.map(expRenderFn).join("");

    const hasProj = Boolean(state.projects && state.projects.length > 0);
    const projList = hasProj ? state.projects : sampleProjList;
    const projBlock = (projRenderFn) => projList.map(projRenderFn).join("");

    const hasEdu = Boolean(state.education && state.education.length > 0);
    const eduList = hasEdu ? state.education : sampleEduList;
    const eduBlock = (eduRenderFn) => eduList.map(eduRenderFn).join("");

    const hasAch = Boolean(state.achievements && state.achievements.length > 0);
    const achList = hasAch ? state.achievements : [];
    const achBlock = (achRenderFn) => achList.map(achRenderFn).join("");

    const hasCustomTech = Boolean(state.skills?.technical && state.skills.technical.length > 0);
    const hasCustomSoft = Boolean(state.skills?.soft && state.skills.soft.length > 0);
    const hasCustomLang = Boolean(state.skills?.languages && state.skills.languages.length > 0);
    const hasCustomCert = Boolean(state.skills?.certifications && state.skills.certifications.length > 0);
    const hasAnyCustomSkills = hasCustomTech || hasCustomSoft || hasCustomLang || hasCustomCert;

    const techArray = hasCustomTech ? state.skills.technical : (hasAnyCustomSkills ? [] : defaultTechSkills);
    const softArray = hasCustomSoft ? state.skills.soft : (hasAnyCustomSkills ? [] : defaultSoftSkills);
    const langString = hasCustomLang ? (state.skills.languages || []).join(", ") : (hasAnyCustomSkills ? "" : defaultLanguages);
    const certString = hasCustomCert ? (state.skills.certifications || []).join(", ") : (hasAnyCustomSkills ? "" : defaultCerts);

    function formatBullets(text) {
      if (!text) return "";
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (lines.length <= 1 && !lines[0].startsWith("-") && !lines[0].startsWith("•") && !lines[0].startsWith("*")) {
        return `<div style="font-size:13px; color:#334155; line-height:1.5; overflow-wrap:break-word; word-break:break-word; white-space:normal; max-width:100%; box-sizing:border-box; overflow:hidden;">${escape(text)}</div>`;
      }
      return `<ul style="margin:3px 0 0 0; padding-left:16px; font-size:13px; color:#334155; line-height:1.48; overflow-wrap:break-word; word-break:break-word; white-space:normal; max-width:100%; box-sizing:border-box; overflow:hidden;">
        ${lines.map((line) => {
          const clean = line.replace(/^[-•*]\s*/, "");
          return `<li style="margin-bottom:3px; overflow-wrap:break-word; word-break:break-word; white-space:normal; max-width:100%;">${escape(clean)}</li>`;
        }).join("")}
      </ul>`;
    }

    const formatSkillsChips = (bg, border, textCol) => {
      const chipBg = bg || `${theme.primary}12`;
      const chipBorder = border || `${theme.primary}30`;
      const chipText = textCol || (theme.primary || "#0f172a");

      return `<div style="display:flex; flex-direction:column; gap:8px; max-width:100%">
        ${techArray.length > 0 ? `<div>
          <div style="font-size:11px; font-weight:800; color:#64748b; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px">⚡ Technical Skills</div>
          <div style="display:flex; flex-wrap:wrap; gap:5px">
            ${techArray.map((s) => `<span style="background:${chipBg}; color:${chipText}; border:1px solid ${chipBorder}; padding:3px 8px; border-radius:4px; font-size:12px; font-weight:600; overflow-wrap:break-word; max-width:100%; display:inline-block">${escape(s)}</span>`).join("")}
          </div>
        </div>` : ""}
        ${softArray.length > 0 ? `<div>
          <div style="font-size:11px; font-weight:800; color:#64748b; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px">💡 Soft Skills</div>
          <div style="display:flex; flex-wrap:wrap; gap:5px">
            ${softArray.map((s) => `<span style="background:${chipBg}; color:${chipText}; border:1px solid ${chipBorder}; padding:3px 8px; border-radius:4px; font-size:12px; font-weight:600; overflow-wrap:break-word; max-width:100%; display:inline-block">${escape(s)}</span>`).join("")}
          </div>
        </div>` : ""}
        ${langString ? `<div>
          <div style="font-size:11px; font-weight:800; color:#64748b; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.5px">🌐 Languages</div>
          <div style="font-size:12px; color:#334155; font-weight:500; overflow-wrap:break-word; line-height:1.4">${escape(langString)}</div>
        </div>` : ""}
        ${certString ? `<div>
          <div style="font-size:11px; font-weight:800; color:#64748b; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.5px">📜 Certifications</div>
          <div style="display:flex; flex-wrap:wrap; gap:5px">
            <span style="background:${chipBg}; color:${chipText}; border:1px solid ${chipBorder}; padding:3px 8px; border-radius:4px; font-size:12px; font-weight:600; overflow-wrap:break-word">${escape(certString)}</span>
          </div>
        </div>` : ""}
      </div>`;
    };

    const skillsBlock = formatSkillsChips();

    // 0A. Left Sidebar Layout (Two-Column Modern / Developer / Creative)
    if (theme.layout === "left-sidebar") {
      const sbBg = theme.sidebarBg || theme.primary || "#0f172a";
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0f172a; line-height:1.45; display:grid; grid-template-columns: 240px minmax(0, 1fr); gap:0; border:none; min-height:1123px; width:100%; max-width:100%; box-sizing:border-box; background:#ffffff;">
        <div style="background:${sbBg}; color:#ffffff; padding:24px 18px; display:flex; flex-direction:column; gap:14px; min-width:0; max-width:240px; box-sizing:border-box;">
          <div style="text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; margin-bottom:4px;">
            ${p.photo ? `<img src="${p.photo}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.9);box-shadow:0 4px 14px rgba(0,0,0,0.25);margin:0 auto 8px auto;display:block;">` : `<div style="width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.3);margin:0 auto 8px auto;display:flex;align-items:center;justify-content:center;font-size:24px">👤</div>`}
            <h1 style="margin:0 0 3px; font-size:18px; font-weight:800; color:#ffffff; letter-spacing:-0.01em; text-align:center; width:100%;">${nameText}</h1>
            <div style="font-size:11.5px; font-weight:600; color:rgba(255,255,255,0.9); text-align:center; width:100%;">${headlineText}</div>
          </div>
          <div>
            <h4 style="font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.7); margin:0 0 5px; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:3px">Contact</h4>
            <div style="display:flex; flex-direction:column; gap:5px; font-size:11px; color:rgba(255,255,255,0.92)">
              <div style="overflow-wrap:break-word">📧 ${emailText}</div>
              <div style="overflow-wrap:break-word">📞 ${phoneText}</div>
              <div style="overflow-wrap:break-word">📍 ${addressText}</div>
              ${linkedinUrl !== '#' ? `<div>💼 <a href="${linkedinUrl}" target="_blank" style="color:#ffffff;text-decoration:underline;overflow-wrap:break-word;font-weight:600;">LinkedIn</a></div>` : ""}
              ${portfolioUrl !== '#' ? `<div>🌐 <a href="${portfolioUrl}" target="_blank" style="color:#ffffff;text-decoration:underline;overflow-wrap:break-word;font-weight:600;">Portfolio</a></div>` : ""}
            </div>
          </div>
          <div>
            <h4 style="font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.7); margin:0 0 5px; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:3px">Skills</h4>
            ${formatSkillsChips("rgba(255,255,255,0.15)", "rgba(255,255,255,0.25)", "#ffffff")}
          </div>
          <div>
            <h4 style="font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.7); margin:0 0 5px; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:3px">Education</h4>
            ${eduBlock((edu) => `
              <div style="margin-bottom:6px; background:rgba(255,255,255,0.1); padding:6px 8px; border-radius:5px; overflow-wrap:break-word">
                <strong style="font-size:11.5px; color:#ffffff; display:block">${escape(edu.degree || "")}</strong>
                <div style="font-size:10.5px; color:rgba(255,255,255,0.9); margin-top:1px;">${escape(edu.institution || "")}</div>
                <div style="font-size:9.5px; color:rgba(255,255,255,0.7); margin-top:1px">${escape(edu.start || "")}${edu.end ? ` - ${escape(edu.end)}` : ""}</div>
              </div>
            `)}
          </div>
          ${achList.length > 0 ? `
            <div>
              <h4 style="font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:rgba(255,255,255,0.7); margin:0 0 5px; border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:3px">Honors & Awards</h4>
              ${achBlock((ach) => `
                <div style="margin-bottom:5px; background:rgba(255,255,255,0.1); padding:5px 7px; border-radius:5px; font-size:10.5px">
                  <div style="font-weight:700; color:#fff">🏆 ${escape(ach.title || "")}</div>
                  <div style="font-size:9.5px; color:rgba(255,255,255,0.8); margin-top:1px;">${escape(ach.org || "")}</div>
                </div>
              `)}
            </div>
          ` : ""}
        </div>
        <div style="padding:26px 24px; display:flex; flex-direction:column; gap:14px; min-width:0; max-width:100%; box-sizing:border-box;">
          <div style="min-width:0; max-width:100%">
            <h3 style="font-size:13px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:2px solid ${theme.primary}; padding-bottom:3px; margin:0 0 6px">About Me</h3>
            ${summaryBlock}
          </div>
          <div style="min-width:0; max-width:100%">
            <h3 style="font-size:13px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:2px solid ${theme.primary}; padding-bottom:3px; margin:0 0 8px">Key Projects</h3>
            ${projBlock((proj) => `
              <div style="margin-bottom:8px; padding:9px 12px; background:#f8fafc; border-radius:6px; border:1px solid #e2e8f0; border-left:3.5px solid ${theme.primary}; min-width:0; max-width:100%">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:4px; margin-bottom:2px">
                  <div>
                    <strong style="font-size:12px; color:#0f172a; overflow-wrap:break-word">${escape(proj.name || "")}</strong>
                    ${proj.tech ? `<div style="font-size:10.5px; color:${theme.primary}; font-weight:700; overflow-wrap:break-word; margin-top:1px">${escape(proj.tech)}</div>` : ""}
                  </div>
                  <div style="display:flex; gap:4px; align-items:center">
                    ${proj.github ? `<a href="${escape(proj.github)}" target="_blank" style="font-size:9.5px;color:${theme.primary};text-decoration:none;font-weight:700;background:#ffffff;border:1px solid #cbd5e1;padding:1px 5px;border-radius:3px">💻 Code</a>` : ""}
                    ${proj.demo ? `<a href="${escape(proj.demo)}" target="_blank" style="font-size:9.5px;color:#059669;text-decoration:none;font-weight:700;background:#ecfdf5;border:1px solid #a7f3d0;padding:1px 5px;border-radius:3px">🔗 Live Demo</a>` : ""}
                  </div>
                </div>
                ${formatBullets(proj.description)}
              </div>
            `)}
          </div>
          <div style="min-width:0; max-width:100%">
            <h3 style="font-size:13px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:2px solid ${theme.primary}; padding-bottom:3px; margin:0 0 8px">Experience & Internships</h3>
            ${expBlock((x) => `
              <div style="margin-bottom:10px; padding-left:10px; border-left:2.5px solid ${theme.primary}44; min-width:0; max-width:100%">
                <div style="display:flex; justify-content:space-between; align-items:baseline; gap:6px; flex-wrap:wrap; margin-bottom:2px">
                  <div>
                    <strong style="font-size:12px; color:#0f172a; overflow-wrap:break-word">${escape(x.title || "")}</strong>
                    <span style="font-size:11.5px; color:#475569"> @ ${escape(x.company || "")}</span>
                    ${x.type ? `<span style="font-size:9.5px; background:#f1f5f9; color:#475569; padding:1px 5px; border-radius:3px; margin-left:4px; font-weight:600">${escape(x.type)}</span>` : ""}
                  </div>
                  <span style="font-size:10px; color:#64748b; font-weight:600; white-space:nowrap">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
                </div>
                ${formatBullets(x.responsibilities)}
              </div>
            `)}
          </div>
        </div>
      </div>`;
    }

    // 0B. Centered / Ivy League Oxford Layout
    if (theme.layout === "centered") {
      return `<div style="font-family:'Georgia', 'Times New Roman', serif; color:#1e293b; line-height:1.6; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%; border-top:6px solid ${theme.primary}">
        <div style="text-align:center; margin-bottom:20px; border-bottom:1.5px solid #cbd5e1; padding-bottom:16px">
          <h1 style="margin:0 0 4px; font-size:28px; font-weight:700; color:${theme.primary}; letter-spacing:0.02em">${nameText}</h1>
          <div style="font-size:14px; font-style:italic; color:#475569">${headlineText}</div>
          <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:12px; font-size:12px; color:#64748b; margin-top:8px; font-family:'Inter', sans-serif">
            <span>${emailText}</span> • <span>${phoneText}</span> • <span>${addressText}</span>
            ${p.linkedin ? `• <span><a href="${escape(p.linkedin)}" target="_blank" style="color:${theme.primary}">LinkedIn</a></span>` : ""}
            ${p.portfolio ? `• <span><a href="${escape(p.portfolio)}" target="_blank" style="color:${theme.primary}">Portfolio</a></span>` : ""}
          </div>
        </div>
        <div style="margin-bottom:18px">
          <h3 style="font-family:'Inter', sans-serif; font-size:12.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:${theme.primary}; border-bottom:1px solid #94a3b8; padding-bottom:2px; margin:0 0 6px">Academic & Professional Summary</h3>
          ${summaryBlock}
        </div>
        <div style="margin-bottom:18px">
          <h3 style="font-family:'Inter', sans-serif; font-size:12.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:${theme.primary}; border-bottom:1px solid #94a3b8; padding-bottom:2px; margin:0 0 8px">Experience & Appointments</h3>
          ${expBlock((x) => `
            <div style="margin-bottom:10px">
              <div style="display:flex; justify-content:space-between">
                <strong style="font-size:13px; color:#0f172a">${escape(x.title || "")}, ${escape(x.company || "")}</strong>
                <span style="font-size:11.5px; color:#64748b; font-family:'Inter', sans-serif">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
              </div>
              ${formatBullets(x.responsibilities)}
            </div>
          `)}
        </div>
        <div style="margin-bottom:18px">
          <h3 style="font-family:'Inter', sans-serif; font-size:12.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:${theme.primary}; border-bottom:1px solid #94a3b8; padding-bottom:2px; margin:0 0 8px">Education & Degrees</h3>
          ${eduBlock((edu) => `
            <div style="margin-bottom:8px; display:flex; justify-content:space-between">
              <div>
                <strong style="font-size:13px; color:#0f172a">${escape(edu.degree || "")}</strong>
                <span style="font-size:12px; color:#475569"> — ${escape(edu.institution || "")}</span>
              </div>
              <span style="font-size:11.5px; color:#64748b; font-family:'Inter', sans-serif">${escape(edu.start || "")} – ${escape(edu.end || "")}</span>
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px">
          <div>
            <h3 style="font-family:'Inter', sans-serif; font-size:12.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:${theme.primary}; border-bottom:1px solid #94a3b8; padding-bottom:2px; margin:0 0 8px">Publications & Projects</h3>
            ${projBlock((proj) => `
              <div style="margin-bottom:8px">
                <strong style="font-size:12.5px; color:#0f172a">${escape(proj.name || "")}</strong>
                ${formatBullets(proj.description)}
              </div>
            `)}
          </div>
          <div>
            <h3 style="font-family:'Inter', sans-serif; font-size:12.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:${theme.primary}; border-bottom:1px solid #94a3b8; padding-bottom:2px; margin:0 0 8px">Skills & Competencies</h3>
            ${formatSkillsChips("#f8fafc", "#e2e8f0", "#1e293b")}
          </div>
        </div>
      </div>`;
    }

    // 0C. Timeline Showcase Layout
    if (theme.layout === "timeline") {
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:${theme.gradient}; padding:24px; border-radius:12px; color:#ffffff; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
          <div>
            <h1 style="margin:0 0 4px; font-size:28px; font-weight:800">${nameText}</h1>
            <div style="font-size:14px; font-weight:600; opacity:0.9">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:68px;height:68px;border-radius:12px;object-fit:cover;border:3px solid #ffffff">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:14px; font-size:12px; color:#475569; padding-bottom:12px; border-bottom:2px solid #e2e8f0; margin-bottom:20px">
          <span>📧 ${emailText}</span> | <span>📞 ${phoneText}</span> | <span>📍 ${addressText}</span>
          ${p.portfolio ? `| <span>🌐 <a href="${escape(p.portfolio)}" target="_blank" style="color:${theme.primary};font-weight:700">Portfolio</a></span>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14px; font-weight:800; color:${theme.primary}; text-transform:uppercase; margin:0 0 6px">Creative Summary</h3>
          ${summaryBlock}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14px; font-weight:800; color:${theme.primary}; text-transform:uppercase; margin:0 0 10px">Production & Work Timeline</h3>
          ${expBlock((x) => `
            <div style="position:relative; padding-left:20px; margin-bottom:14px; border-left:2px solid ${theme.primary}">
              <div style="position:absolute; left:-6px; top:3px; width:10px; height:10px; border-radius:50%; background:${theme.primary}"></div>
              <div style="display:flex; justify-content:space-between">
                <strong style="font-size:13.5px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                <span style="font-size:11.5px; color:#64748b">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
              </div>
              ${formatBullets(x.responsibilities)}
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px">
          <div>
            <h3 style="font-size:14px; font-weight:800; color:${theme.primary}; text-transform:uppercase; margin:0 0 10px">Portfolio Showcase</h3>
            ${projBlock((proj) => `
              <div style="margin-bottom:10px; background:#f8fafc; padding:8px 10px; border-radius:6px; border:1px solid #e2e8f0">
                <strong style="font-size:13px; color:#0f172a">${escape(proj.name || "")}</strong>
                ${formatBullets(proj.description)}
              </div>
            `)}
          </div>
          <div>
            <h3 style="font-size:14px; font-weight:800; color:${theme.primary}; text-transform:uppercase; margin:0 0 10px">Tools & Disciplines</h3>
            ${formatSkillsChips("#f1f5f9", "#cbd5e1", theme.primary)}
          </div>
        </div>
      </div>`;
    }

    // 1. Tech Specialist Layout (Developer friendly, terminal vibes, monospace chips)
    if (theme.layout === "tech") {
      return `<div style="font-family:'Inter', -apple-system, sans-serif; color:#0f172a; line-height:1.45; padding:24px 26px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:#0f172a; padding:16px 18px; border-radius:8px; color:#ffffff; margin-bottom:12px; border-left:4px solid ${theme.primary}; display:flex; justify-content:space-between; align-items:center">
          <div>
            <div style="font-family:monospace; font-size:10px; color:#38bdf8; letter-spacing:1px; margin-bottom:2px">&lt;DEVELOPER_PROFILE /&gt;</div>
            <h1 style="margin:0 0 2px; font-size:23px; font-weight:800; color:#f8fafc">${nameText}</h1>
            <div style="font-size:12.5px; color:#94a3b8; font-weight:600">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:54px;height:54px;border-radius:8px;object-fit:cover;border:2px solid #38bdf8">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:7px; font-size:11px; color:#475569; padding-bottom:9px; border-bottom:1px solid #cbd5e1; margin-bottom:12px; font-family:monospace">
          <span style="background:#f1f5f9;padding:2px 7px;border-radius:4px">📧 ${emailText}</span>
          <span style="background:#f1f5f9;padding:2px 7px;border-radius:4px">📞 ${phoneText}</span>
          <span style="background:#f1f5f9;padding:2px 7px;border-radius:4px">📍 ${addressText}</span>
          ${p.portfolio ? `<a href="${escape(p.portfolio)}" target="_blank" style="background:#e0f2fe;color:#0284c7;padding:2px 7px;border-radius:4px;text-decoration:none;font-weight:700">🔗 Portfolio</a>` : ""}
          ${p.linkedin ? `<a href="${escape(p.linkedin)}" target="_blank" style="background:#e0e7ff;color:#4338ca;padding:2px 7px;border-radius:4px;text-decoration:none;font-weight:700">💼 LinkedIn</a>` : ""}
        </div>
        <div style="margin-bottom:12px">
          <h3 style="font-family:monospace; font-size:12px; font-weight:800; color:${theme.primary}; text-transform:uppercase; border-bottom:1.5px solid #cbd5e1; padding-bottom:2px; margin:0 0 5px">// 01. TECHNICAL SUMMARY</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 1.8fr 1.2fr; gap:16px">
          <div>
            <div style="margin-bottom:12px">
              <h3 style="font-family:monospace; font-size:12px; font-weight:800; color:${theme.primary}; text-transform:uppercase; border-bottom:1.5px solid #cbd5e1; padding-bottom:2px; margin:0 0 6px">// 02. PROJECTS & REPOSITORIES</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:7px; background:#f8fafc; border:1px solid #e2e8f0; border-left:3px solid ${theme.primary}; padding:7px 9px; border-radius:6px">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:4px; margin-bottom:2px">
                    <div>
                      <strong style="font-size:11.5px; color:#0f172a">${escape(proj.name || "")}</strong>
                      <span style="font-family:monospace; font-size:10px; color:${theme.primary}; background:#eff6ff; padding:1px 5px; border-radius:3px; margin-left:3px; display:inline-block">${escape(proj.tech || "")}</span>
                    </div>
                    <div style="display:flex; gap:4px">
                      ${proj.github ? `<a href="${escape(proj.github)}" target="_blank" style="font-size:9.5px;color:${theme.primary};text-decoration:none;font-weight:700;background:#ffffff;border:1px solid #cbd5e1;padding:1px 5px;border-radius:3px">💻 Code</a>` : ""}
                      ${proj.demo ? `<a href="${escape(proj.demo)}" target="_blank" style="font-size:9.5px;color:#059669;text-decoration:none;font-weight:700;background:#ecfdf5;border:1px solid #a7f3d0;padding:1px 5px;border-radius:3px">🔗 Live Demo</a>` : ""}
                    </div>
                  </div>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-family:monospace; font-size:12px; font-weight:800; color:${theme.primary}; text-transform:uppercase; border-bottom:1.5px solid #cbd5e1; padding-bottom:2px; margin:0 0 6px">// 03. EXPERIENCE</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:8px; padding-left:8px; border-left:2px solid #cbd5e1">
                  <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap">
                    <strong style="font-size:11.5px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                    <span style="font-size:10px; color:#64748b; font-family:monospace">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                  </div>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:12px">
              <h3 style="font-family:monospace; font-size:12px; font-weight:800; color:${theme.primary}; text-transform:uppercase; border-bottom:1.5px solid #cbd5e1; padding-bottom:2px; margin:0 0 5px">// 04. TECH STACK</h3>
              ${formatSkillsChips("#0f172a", "#334155", "#38bdf8")}
            </div>
            <div>
              <h3 style="font-family:monospace; font-size:12px; font-weight:800; color:${theme.primary}; text-transform:uppercase; border-bottom:1.5px solid #cbd5e1; padding-bottom:2px; margin:0 0 5px">// 05. EDUCATION</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:6px; background:#f8fafc; padding:6px 8px; border-radius:5px; border:1px solid #e2e8f0">
                  <strong style="font-size:11.5px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:10.5px; color:#64748b">${escape(edu.institution || "")}</div>
                  <div style="font-size:10px; color:#94a3b8; font-family:monospace">${escape(edu.start || "")}${edu.end ? ` - ${escape(edu.end)}` : ""}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // 2. Modern Pro Layout (Timeline based, dynamic purple/indigo)
    if (theme.layout === "modern-pro") {
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0f172a; line-height:1.45; padding:24px 26px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:${theme.gradient}; padding:18px 20px; border-radius:10px; color:#ffffff; display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; box-shadow: 0 2px 10px rgba(0,0,0,0.06);">
          <div>
            <h1 style="margin:0 0 2px; font-size:24px; font-weight:800; letter-spacing:-0.01em">${nameText}</h1>
            <div style="font-size:13px; font-weight:600; opacity:0.95">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:58px;height:58px;border-radius:10px;object-fit:cover;border:2.5px solid rgba(255,255,255,0.85)">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; font-size:11px; color:#475569; padding-bottom:10px; border-bottom:1.5px solid #e0e7ff; margin-bottom:14px">
          <span>📧 ${emailText}</span>
          <span>📞 ${phoneText}</span>
          <span>📍 ${addressText}</span>
          ${p.linkedin ? `<span>💼 <a href="${escape(p.linkedin)}" target="_blank" style="color:${theme.primary};font-weight:700">LinkedIn</a></span>` : ""}
          ${p.portfolio ? `<span>🌐 <a href="${escape(p.portfolio)}" target="_blank" style="color:${theme.primary};font-weight:700">Portfolio</a></span>` : ""}
        </div>
        <div style="margin-bottom:14px">
          <h3 style="font-size:12.5px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.04em; border-left:3px solid ${theme.primary}; padding-left:7px; margin:0 0 5px">About Me</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 1.8fr 1.2fr; gap:16px">
          <div>
            <div style="margin-bottom:12px">
              <h3 style="font-size:12.5px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.04em; border-left:3px solid ${theme.primary}; padding-left:7px; margin:0 0 7px">Experience & Internships</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:8px; padding-left:9px; border-left:2px solid ${theme.primary}33; position:relative">
                  <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:4px; margin-bottom:2px">
                    <strong style="font-size:12px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                    <span style="font-size:10.5px; color:#64748b; font-weight:600">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
                  </div>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:12.5px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.04em; border-left:3px solid ${theme.primary}; padding-left:7px; margin:0 0 7px">Key Projects</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:8px; padding:8px 10px; background:#f8fafc; border-radius:6px; border:1px solid #e2e8f0; border-left:3px solid ${theme.primary}">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:4px; margin-bottom:2px">
                    <div>
                      <strong style="font-size:12px; color:#0f172a">${escape(proj.name || "")}</strong>
                      <div style="font-size:10.5px; color:${theme.primary}; font-weight:700; margin-top:1px">${escape(proj.tech || "")}</div>
                    </div>
                    <div style="display:flex; gap:4px">
                      ${proj.github ? `<a href="${escape(proj.github)}" target="_blank" style="font-size:9.5px;color:${theme.primary};text-decoration:none;font-weight:700;background:#fff;border:1px solid #cbd5e1;padding:1px 5px;border-radius:3px">💻 Code</a>` : ""}
                      ${proj.demo ? `<a href="${escape(proj.demo)}" target="_blank" style="font-size:9.5px;color:#059669;text-decoration:none;font-weight:700;background:#ecfdf5;border:1px solid #a7f3d0;padding:1px 5px;border-radius:3px">🔗 Live Demo</a>` : ""}
                    </div>
                  </div>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:12px">
              <h3 style="font-size:12.5px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.04em; border-left:3px solid ${theme.primary}; padding-left:7px; margin:0 0 6px">Core Skills</h3>
              ${formatSkillsChips("#f3e8ff", "#d8b4fe", "#6b21a8")}
            </div>
            <div>
              <h3 style="font-size:12.5px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.04em; border-left:3px solid ${theme.primary}; padding-left:7px; margin:0 0 6px">Education</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:6px; padding:7px 9px; background:#faf5ff; border-radius:6px; border:1px solid #f3e8ff">
                  <strong style="font-size:11.5px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:10.5px; color:#64748b">${escape(edu.institution || "")}</div>
                  <div style="font-size:10px; color:#a855f7; margin-top:1px; font-weight:600">${escape(edu.start || "")}${edu.end ? ` - ${escape(edu.end)}` : ""}</div>
                </div>
              `)}
            </div>
            ${achList.length > 0 ? `
              <div style="margin-top:10px">
                <h3 style="font-size:12.5px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.04em; border-left:3px solid ${theme.primary}; padding-left:7px; margin:0 0 6px">Honors & Awards</h3>
                ${achBlock((ach) => `
                  <div style="margin-bottom:6px; background:#fffbeb; border:1px solid #fef3c7; border-left:3px solid #f59e0b; padding:6px 8px; border-radius:5px">
                    <strong style="font-size:11px; color:#92400e; display:block">🏆 ${escape(ach.title || "")}</strong>
                    <div style="font-size:10px; color:#78350f">${escape(ach.org || "")}</div>
                  </div>
                `)}
              </div>
            ` : ""}
          </div>
        </div>
      </div>`;
    }

    // 3. Clean Slate Layout (High ATS score, structured single-look)
    if (theme.layout === "clean-slate") {
      return `<div style="font-family:'Inter', sans-serif; color:#1e293b; line-height:1.45; padding:24px 26px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="border-left:4px solid ${theme.primary}; padding-left:12px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <h1 style="margin:0 0 2px; font-size:24px; font-weight:800; color:${theme.primary}">${nameText}</h1>
            <div style="font-size:12.5px; color:#475569; font-weight:600">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:54px;height:54px;border-radius:6px;object-fit:cover">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; font-size:11px; color:#64748b; padding-bottom:9px; border-bottom:1px solid #cbd5e1; margin-bottom:12px">
          <span>📧 ${emailText}</span> | <span>📞 ${phoneText}</span> | <span>📍 ${addressText}</span>
          ${p.linkedin ? `| <span><a href="${escape(p.linkedin)}" target="_blank" style="color:${theme.primary};font-weight:700">LinkedIn</a></span>` : ""}
          ${p.portfolio ? `| <span><a href="${escape(p.portfolio)}" target="_blank" style="color:${theme.primary};font-weight:700">Portfolio</a></span>` : ""}
        </div>
        <div style="margin-bottom:12px">
          <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.06em; margin:0 0 5px">Profile Summary</h3>
          ${summaryBlock}
        </div>
        <div style="margin-bottom:12px">
          <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.06em; margin:0 0 6px">Work Experience</h3>
          ${expBlock((x) => `
            <div style="margin-bottom:8px">
              <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap">
                <strong style="font-size:11.5px; color:#0f172a">${escape(x.title || "")} — ${escape(x.company || "")}</strong>
                <span style="font-size:10.5px; color:#64748b; font-weight:600">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
              </div>
              ${formatBullets(x.responsibilities)}
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:12px">
          <div>
            <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.06em; margin:0 0 6px">Projects</h3>
            ${projBlock((proj) => `
              <div style="margin-bottom:6px; background:#f8fafc; border:1px solid #e2e8f0; padding:7px 9px; border-radius:5px">
                <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:2px">
                  <strong style="font-size:11.5px; color:#0f172a">${escape(proj.name || "")}</strong>
                  ${proj.tech ? `<span style="font-size:9.5px; color:${theme.primary}; font-weight:700">${escape(proj.tech)}</span>` : ""}
                </div>
                ${formatBullets(proj.description)}
              </div>
            `)}
          </div>
          <div>
            <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.06em; margin:0 0 6px">Skills & Competencies</h3>
            ${formatSkillsChips()}
          </div>
        </div>
        <div>
          <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.06em; margin:0 0 5px">Education</h3>
          ${eduBlock((edu) => `
            <div style="margin-bottom:5px">
              <strong style="font-size:11.5px; color:#0f172a">${escape(edu.degree || "")}</strong> — <span style="font-size:11px; color:#64748b">${escape(edu.institution || "")} (${escape(edu.start || "")}${edu.end ? ` - ${escape(edu.end)}` : ""})</span>
            </div>
          `)}
        </div>
      </div>`;
    }

    // 4. Minimalist Essential (Ivy League ATS Standard)
    if (theme.layout === "minimalist") {
      return `<div style="font-family:'Inter', sans-serif; color:#0f172a; line-height:1.45; padding:24px 26px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="border-bottom:2px solid ${theme.primary}; padding-bottom:10px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:flex-end">
          <div>
            <h1 style="margin:0; font-size:24px; font-weight:800; color:${theme.primary}">${nameText}</h1>
            <div style="font-size:12.5px; color:#475569; font-weight:600; margin-top:1px">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:54px;height:54px;border-radius:6px;object-fit:cover">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; font-size:11px; color:#64748b; margin-bottom:12px; border-bottom:1px solid #e2e8f0; padding-bottom:9px">
          <span>📧 ${emailText}</span>
          <span>📞 ${phoneText}</span>
          <span>📍 ${addressText}</span>
          ${p.linkedin ? `<span>💼 <a href="${escape(p.linkedin)}" target="_blank" style="color:${theme.primary};font-weight:700">LinkedIn</a></span>` : ""}
          ${p.portfolio ? `<span>🌐 <a href="${escape(p.portfolio)}" target="_blank" style="color:${theme.primary};font-weight:700">Portfolio</a></span>` : ""}
        </div>
        <div style="margin-bottom:12px">
          <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:2px; margin:0 0 5px">Summary</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 1.8fr 1.2fr; gap:16px">
          <div>
            <div style="margin-bottom:12px">
              <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:2px; margin:0 0 6px">Experience</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:8px">
                  <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap">
                    <strong style="font-size:11.5px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                    <span style="font-size:10px; color:#64748b; font-weight:600">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                  </div>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:2px; margin:0 0 6px">Projects</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:7px; background:#f8fafc; border:1px solid #e2e8f0; border-left:3px solid ${theme.primary}; padding:7px 9px; border-radius:5px">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:4px; margin-bottom:2px">
                    <strong style="font-size:11.5px; color:#0f172a">${escape(proj.name || "")}</strong>
                    <span style="font-size:10px; color:${theme.primary}; font-weight:700">${escape(proj.tech || "")}</span>
                  </div>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:12px">
              <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:2px; margin:0 0 5px">Skills</h3>
              ${formatSkillsChips()}
            </div>
            <div>
              <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${theme.primary}; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:2px; margin:0 0 5px">Education</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:6px; background:#f8fafc; padding:6px 8px; border-radius:5px; border:1px solid #e2e8f0">
                  <strong style="font-size:11.5px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:10.5px; color:#64748b">${escape(edu.institution || "")}</div>
                  <div style="font-size:10px; color:#94a3b8">${escape(edu.start || "")}${edu.end ? ` - ${escape(edu.end)}` : ""}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // 5. Monochrome Classic Layout (Boxed, editorial timeless style)
    if (theme.layout === "monochrome") {
      return `<div style="font-family:'Inter', serif, sans-serif; color:#171717; line-height:1.5; border:2px solid #262626; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%; border-radius:4px">
        <div style="text-align:center; border-bottom:2px solid #262626; padding-bottom:14px; margin-bottom:18px">
          <h1 style="margin:0 0 4px; font-size:28px; font-weight:800; letter-spacing:1px; text-transform:uppercase">${nameText}</h1>
          <div style="font-size:13.5px; font-weight:600; color:#525252">${headlineText}</div>
          <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:12px; font-size:11.5px; color:#525252; margin-top:8px">
            <span>${emailText}</span> • <span>${phoneText}</span> • <span>${addressText}</span>
          </div>
        </div>
        <div style="margin-bottom:18px">
          <h3 style="font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #737373; padding-bottom:2px; margin:0 0 6px">Professional Summary</h3>
          ${summaryBlock}
        </div>
        <div style="margin-bottom:18px">
          <h3 style="font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #737373; padding-bottom:2px; margin:0 0 8px">Experience</h3>
          ${expBlock((x) => `
            <div style="margin-bottom:10px">
              <div style="display:flex; justify-content:space-between">
                <strong style="font-size:13.5px">${escape(x.title || "")} | ${escape(x.company || "")}</strong>
                <span style="font-size:12px">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
              </div>
              ${formatBullets(x.responsibilities)}
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px">
          <div>
            <h3 style="font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #737373; padding-bottom:2px; margin:0 0 8px">Projects</h3>
            ${projBlock((proj) => `
              <div style="margin-bottom:8px">
                <strong style="font-size:13px">${escape(proj.name || "")}</strong>
                ${formatBullets(proj.description)}
              </div>
            `)}
          </div>
          <div>
            <h3 style="font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #737373; padding-bottom:2px; margin:0 0 8px">Core Skills</h3>
            ${formatSkillsChips("#f5f5f5", "#d4d4d4", "#171717")}
          </div>
        </div>
      </div>`;
    }

    // 6. Executive Layout (Navy authoritative, formal hierarchy)
    if (theme.layout === "executive") {
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="border-top:3px solid #10b981; border-bottom:1.5px solid #cbd5e1; padding:18px 0; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <h1 style="margin:0 0 4px; font-size:30px; font-weight:800; color:${theme.primary}; letter-spacing:-0.02em">${nameText}</h1>
            <div style="font-size:15px; color:#334155; font-weight:700">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:72px;height:72px;border-radius:10px;object-fit:cover;border:2px solid ${theme.primary}">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:20px; font-size:12.5px; color:#475569; padding-bottom:14px; border-bottom:1px solid #cbd5e1; margin-bottom:22px; font-weight:600">
          <span>EMAIL: ${emailText}</span> | <span>PHONE: ${phoneText}</span> | <span>LOCATION: ${addressText}</span>
        </div>
        <div style="margin-bottom:22px; background:#f0fdf4; border-left:4px solid #10b981; padding:12px 14px; border-radius:4px">
          <h3 style="font-size:14px; font-weight:800; color:#065f46; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 6px">Executive Profile</h3>
          ${summaryBlock}
        </div>
        <div style="margin-bottom:22px">
          <h3 style="font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin:0 0 12px">Leadership & Professional Experience</h3>
          ${expBlock((x) => `
            <div style="margin-bottom:16px">
              <div style="display:flex; justify-content:space-between; align-items:baseline">
                <strong style="font-size:15px; color:#0f172a">${escape(x.title || "")} — ${escape(x.company || "")}</strong>
                <span style="font-size:12px; color:#64748b; font-weight:600">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
              </div>
              ${formatBullets(x.responsibilities)}
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <h3 style="font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin:0 0 10px">Strategic Core Competencies</h3>
            ${formatSkillsChips("#ecfdf5", "#a7f3d0", "#065f46")}
          </div>
          <div>
            <h3 style="font-size:15px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin:0 0 10px">Education & Credentials</h3>
            ${eduBlock((edu) => `
              <div style="margin-bottom:10px">
                <strong style="font-size:13.5px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                <div style="font-size:12.5px; color:#64748b">${escape(edu.institution || "")}</div>
              </div>
            `)}
          </div>
        </div>
      </div>`;
    }

    // 7. Corporate Director Layout (Navy authoritative, formal hierarchy)
    if (theme.layout === "director") {
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="border-top:4px solid #1e3a8a; border-bottom:2px solid #0f172a; padding:18px 0; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <h1 style="margin:0 0 4px; font-size:32px; font-weight:800; color:#1e3a8a; letter-spacing:-0.02em">${nameText}</h1>
            <div style="font-size:16px; color:#334155; font-weight:700">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:72px;height:72px;border-radius:6px;object-fit:cover;border:2px solid #1e3a8a">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:20px; font-size:12.5px; color:#475569; padding-bottom:12px; border-bottom:1px solid #cbd5e1; margin-bottom:22px; font-weight:600">
          <span>EMAIL: ${emailText}</span> | <span>PHONE: ${phoneText}</span> | <span>LOCATION: ${addressText}</span>
        </div>
        <div style="margin-bottom:22px">
          <h3 style="font-size:14.5px; font-weight:800; color:#1e3a8a; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1.5px solid #1e3a8a; padding-bottom:3px; margin:0 0 8px">Executive Leadership Profile</h3>
          ${summaryBlock}
        </div>
        <div style="margin-bottom:22px">
          <h3 style="font-size:14.5px; font-weight:800; color:#1e3a8a; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1.5px solid #1e3a8a; padding-bottom:3px; margin:0 0 12px">Executive History & Directorships</h3>
          ${expBlock((x) => `
            <div style="margin-bottom:14px">
              <div style="display:flex; justify-content:space-between; align-items:baseline">
                <strong style="font-size:14.5px; color:#0f172a">${escape(x.title || "")} — ${escape(x.company || "")}</strong>
                <span style="font-size:12px; color:#64748b; font-weight:600">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
              </div>
              ${formatBullets(x.responsibilities)}
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <h3 style="font-size:14.5px; font-weight:800; color:#1e3a8a; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1.5px solid #1e3a8a; padding-bottom:3px; margin:0 0 10px">Core Competencies</h3>
            ${formatSkillsChips("#eff6ff", "#bfdbfe", "#1e40af")}
          </div>
          <div>
            <h3 style="font-size:14.5px; font-weight:800; color:#1e3a8a; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1.5px solid #1e3a8a; padding-bottom:3px; margin:0 0 10px">Credentials & Education</h3>
            ${eduBlock((edu) => `
              <div style="margin-bottom:8px">
                <strong style="font-size:13.5px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
              </div>
            `)}
          </div>
        </div>
      </div>`;
    }

    // 8. Starter / Fresher Skills First Layout
    if (theme.layout === "starter") {
      return `<div style="font-family:'Inter', sans-serif; color:#0e131f; line-height:1.55; padding:36px 36px; box-sizing:border-box; min-height:1123px; height:100%; width:100%; background:#ffffff; display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="background:${theme.gradient}; padding:24px 28px; border-radius:14px; color:#ffffff; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
            <div>
              <h1 style="font-family:'Outfit', sans-serif; margin:0 0 4px; font-size:28px; font-weight:800; letter-spacing:-0.02em;">${nameText}</h1>
              <div style="font-size:14px; font-weight:600; opacity:0.95">${headlineText}</div>
            </div>
            ${p.photo ? `<img src="${p.photo}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.15);">` : ""}
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:11.5px; color:#475569; padding-bottom:14px; border-bottom:2px solid #ccfbf1; margin-bottom:22px">
            <span style="background:#f8fafc;padding:3px 10px;border-radius:5px;border:1px solid #e2e8f0;">📧 ${emailText}</span>
            <span style="background:#f8fafc;padding:3px 10px;border-radius:5px;border:1px solid #e2e8f0;">📞 ${phoneText}</span>
            <span style="background:#f8fafc;padding:3px 10px;border-radius:5px;border:1px solid #e2e8f0;">📍 ${addressText}</span>
            ${linkedinUrl !== '#' ? `<span><a href="${linkedinUrl}" target="_blank" style="background:#eff6ff;color:${theme.primary};text-decoration:none;font-weight:700;padding:3px 10px;border-radius:5px;border:1px solid #dbeafe;">💼 LinkedIn</a></span>` : ""}
            ${portfolioUrl !== '#' ? `<span><a href="${portfolioUrl}" target="_blank" style="background:#f0fdf4;color:#059669;text-decoration:none;font-weight:700;padding:3px 10px;border-radius:5px;border:1px solid #bbf7d0;">🌐 Portfolio</a></span>` : ""}
          </div>
          <div style="background:#f0fdfa; border:1.5px solid #99f6e4; padding:16px 18px; border-radius:10px; margin-bottom:22px">
            <h3 style="font-size:14px; font-weight:800; color:#0f766e; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 10px">⚡ Skills & Proficiencies</h3>
            ${formatSkillsChips("#ccfbf1", "#5eead4", "#0f766e")}
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:26px; margin-bottom:20px;">
            <div style="display:flex; flex-direction:column; gap:22px;">
              <div>
                <h3 style="font-size:14px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:2px solid #ccfbf1; padding-bottom:4px; margin:0 0 10px">🎓 Education & Academics</h3>
                ${eduBlock((edu) => `
                  <div style="margin-bottom:12px; background:#f8fafc; border:1px solid #e2e8f0; padding:10px 14px; border-radius:8px">
                    <strong style="font-size:13.5px; color:#0f172a">${escape(edu.degree || "")}</strong>
                    <div style="font-size:12px; color:#64748b; margin-top:2px;">${escape(edu.institution || "")}</div>
                    <div style="font-size:11px; color:#0f766e; font-weight:600; margin-top:2px;">${escape(edu.start || "")}${edu.end ? ` – ${escape(edu.end)}` : ""}</div>
                  </div>
                `)}
              </div>
              <div>
                <h3 style="font-size:14px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:2px solid #ccfbf1; padding-bottom:4px; margin:0 0 10px">🎯 Career Objective</h3>
                ${summaryBlock}
              </div>
            </div>
            <div style="display:flex; flex-direction:column; gap:22px;">
              <div>
                <h3 style="font-size:14px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:2px solid #ccfbf1; padding-bottom:4px; margin:0 0 10px">🚀 Projects & Portfolio</h3>
                ${projBlock((proj) => `
                  <div style="margin-bottom:12px; background:#f8fafc; border:1px solid #e2e8f0; border-left:3.5px solid ${theme.primary}; padding:10px 12px; border-radius:7px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:4px; margin-bottom:3px;">
                      <div>
                        <strong style="font-size:13px; color:#0e131f;">${escape(proj.name || "")}</strong>
                        ${proj.tech ? `<div style="font-size:11px; color:${theme.primary}; font-weight:700; margin-top:1px;">${escape(proj.tech)}</div>` : ""}
                      </div>
                      <div style="display:flex; gap:4px; align-items:center;">
                        ${proj.github ? `<a href="${escape(proj.github)}" target="_blank" style="font-size:9.5px;color:${theme.primary};text-decoration:none;font-weight:700;background:#fff;border:1px solid #cbd5e1;padding:2px 6px;border-radius:4px;">💻 Code</a>` : ""}
                        ${proj.demo ? `<a href="${escape(proj.demo)}" target="_blank" style="font-size:9.5px;color:#059669;text-decoration:none;font-weight:700;background:#ecfdf5;border:1px solid #a7f3d0;padding:2px 6px;border-radius:4px;">🔗 Live Demo</a>` : ""}
                      </div>
                    </div>
                    ${formatBullets(proj.description)}
                  </div>
                `)}
              </div>
              <div>
                <h3 style="font-size:14px; font-weight:800; color:${theme.primary}; text-transform:uppercase; letter-spacing:0.06em; border-bottom:2px solid #ccfbf1; padding-bottom:4px; margin:0 0 10px">💼 Experience & Internships</h3>
                ${expBlock((x) => `
                  <div style="margin-bottom:12px; padding-left:10px; border-left:2.5px solid ${theme.primary}44;">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; gap:6px; flex-wrap:wrap; margin-bottom:2px">
                      <strong style="font-size:13px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                      <span style="font-size:11px; color:#64748b; font-weight:600;">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
                    </div>
                    ${formatBullets(x.responsibilities)}
                  </div>
                `)}
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top:auto; padding-top:14px; border-top:1.5px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; font-size:11px; color:#64748b;">
          <span>Declaration: I hereby declare that all details above are accurate to the best of my knowledge.</span>
          <span style="font-weight:600; color:#0f172a;">${nameText}</span>
        </div>
      </div>`;
    }

    // 9. Cloud & DevOps Architect Layout
    if (theme.layout === "cloud") {
      return `<div style="font-family:'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:#0f172a; padding:24px; border-radius:10px; color:#ffffff; border-top:4px solid #0284c7; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <div style="font-size:11px; font-weight:700; color:#38bdf8; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px">☁️ CLOUD & SYSTEMS ARCHITECT</div>
            <h1 style="margin:0 0 4px; font-size:28px; font-weight:800">${nameText}</h1>
            <div style="font-size:14px; color:#94a3b8; font-weight:600">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:68px;height:68px;border-radius:10px;object-fit:cover;border:2px solid #38bdf8">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:12px; color:#475569; padding-bottom:12px; border-bottom:1px solid #cbd5e1; margin-bottom:20px; font-family:monospace">
          <span style="background:#f0f9ff;padding:3px 8px;border-radius:4px;color:#0369a1">📧 ${emailText}</span>
          <span style="background:#f0f9ff;padding:3px 8px;border-radius:4px;color:#0369a1">📞 ${phoneText}</span>
          <span style="background:#f0f9ff;padding:3px 8px;border-radius:4px;color:#0369a1">📍 ${addressText}</span>
          ${p.linkedin ? `<a href="${escape(p.linkedin)}" target="_blank" style="background:#0284c7;color:#fff;padding:3px 8px;border-radius:4px;text-decoration:none">LinkedIn</a>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14px; font-weight:800; color:#0284c7; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1.5px solid #0284c7; padding-bottom:3px; margin:0 0 6px">Architecture & Systems Summary</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; color:#0284c7; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1.5px solid #0284c7; padding-bottom:3px; margin:0 0 10px">Infrastructure Experience</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:12px; padding-left:10px; border-left:2px solid #0284c7">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:13.5px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                    <span style="font-size:11.5px; color:#64748b">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                  </div>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; color:#0284c7; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1.5px solid #0284c7; padding-bottom:3px; margin:0 0 10px">Deployments & Systems</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:10px; background:#f8fafc; border:1px solid #e2e8f0; padding:8px 10px; border-radius:6px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:13px; color:#0f172a">${escape(proj.name || "")}</strong>
                    <span style="font-size:11px; font-family:monospace; color:#0284c7">${escape(proj.tech || "")}</span>
                  </div>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; color:#0284c7; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1.5px solid #0284c7; padding-bottom:3px; margin:0 0 8px">DevOps & Cloud Stack</h3>
              ${formatSkillsChips("#e0f2fe", "#7dd3fc", "#0369a1")}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; color:#0284c7; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1.5px solid #0284c7; padding-bottom:3px; margin:0 0 8px">Education</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:8px">
                  <strong style="font-size:13px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // 10. AI & Data Scientist Layout
    if (theme.layout === "ai-data") {
      return `<div style="font-family:'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); padding:24px; border-radius:12px; color:#ffffff; border-bottom:3px solid #06b6d4; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <div style="font-size:11px; font-weight:700; color:#22d3ee; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px">🤖 AI & DATA SCIENCE SPECIALIST</div>
            <h1 style="margin:0 0 4px; font-size:28px; font-weight:800">${nameText}</h1>
            <div style="font-size:14px; color:#cbd5e1; font-weight:600">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:68px;height:68px;border-radius:12px;object-fit:cover;border:2px solid #22d3ee">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:14px; font-size:12px; color:#475569; padding-bottom:12px; border-bottom:1px solid #cbd5e1; margin-bottom:20px">
          <span>📧 ${emailText}</span> • <span>📞 ${phoneText}</span> • <span>📍 ${addressText}</span>
          ${p.portfolio ? `• <a href="${escape(p.portfolio)}" target="_blank" style="color:#0891b2;font-weight:700">Kaggle / Portfolio</a>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14px; font-weight:800; color:#0891b2; text-transform:uppercase; margin:0 0 6px">Research & Quantitative Focus</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; color:#0891b2; text-transform:uppercase; border-bottom:1.5px solid #0891b2; padding-bottom:3px; margin:0 0 10px">AI & ML Projects</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:12px; background:#ecfeff; border:1px solid #a5f3fc; border-left:3px solid #0891b2; padding:10px; border-radius:6px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:13.5px; color:#0e7490">${escape(proj.name || "")}</strong>
                    <span style="font-size:11.5px; color:#0891b2; font-weight:600">${escape(proj.tech || "")}</span>
                  </div>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; color:#0891b2; text-transform:uppercase; border-bottom:1.5px solid #0891b2; padding-bottom:3px; margin:0 0 10px">Professional Experience</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:12px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:13.5px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                    <span style="font-size:11.5px; color:#64748b">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                  </div>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; color:#0891b2; text-transform:uppercase; border-bottom:1.5px solid #0891b2; padding-bottom:3px; margin:0 0 8px">Machine Learning & Tools</h3>
              ${formatSkillsChips("#cffafe", "#67e8f9", "#0e7490")}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; color:#0891b2; text-transform:uppercase; border-bottom:1.5px solid #0891b2; padding-bottom:3px; margin:0 0 8px">Education</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:8px">
                  <strong style="font-size:13px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // 11. Ivy League Academic Layout (Oxford / Harvard Traditional Serif ATS Standard)
    if (theme.layout === "ivy") {
      return `<div style="font-family:'Georgia', 'Cambria', serif; color:#1c1917; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="text-align:center; border-bottom:2px solid #7f1d1d; padding-bottom:14px; margin-bottom:18px">
          <h1 style="margin:0 0 4px; font-size:30px; font-weight:700; color:#7f1d1d; letter-spacing:0.5px">${nameText}</h1>
          <div style="font-size:14px; font-style:italic; color:#44403c">${headlineText}</div>
          <div style="font-family:'Inter', sans-serif; display:flex; justify-content:center; flex-wrap:wrap; gap:14px; font-size:11.5px; color:#57534e; margin-top:8px">
            <span>${emailText}</span> • <span>${phoneText}</span> • <span>${addressText}</span>
            ${p.linkedin ? `• <a href="${escape(p.linkedin)}" target="_blank" style="color:#7f1d1d">LinkedIn</a>` : ""}
          </div>
        </div>
        <div style="margin-bottom:18px">
          <h3 style="font-size:13.5px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#7f1d1d; border-bottom:1px solid #d6d3d1; padding-bottom:2px; margin:0 0 6px">Academic & Career Profile</h3>
          ${summaryBlock}
        </div>
        <div style="margin-bottom:18px">
          <h3 style="font-size:13.5px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#7f1d1d; border-bottom:1px solid #d6d3d1; padding-bottom:2px; margin:0 0 10px">Professional Experience</h3>
          ${expBlock((x) => `
            <div style="margin-bottom:12px">
              <div style="display:flex; justify-content:space-between; align-items:baseline">
                <strong style="font-size:14px; color:#1c1917">${escape(x.title || "")}, ${escape(x.company || "")}</strong>
                <span style="font-family:'Inter', sans-serif; font-size:11.5px; color:#78716c">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
              </div>
              <div style="font-family:'Inter', sans-serif;">${formatBullets(x.responsibilities)}</div>
            </div>
          `)}
        </div>
        <div style="margin-bottom:18px">
          <h3 style="font-size:13.5px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#7f1d1d; border-bottom:1px solid #d6d3d1; padding-bottom:2px; margin:0 0 10px">Education & Degrees</h3>
          ${eduBlock((edu) => `
            <div style="margin-bottom:8px">
              <div style="display:flex; justify-content:space-between; align-items:baseline">
                <strong style="font-size:13.5px; color:#1c1917">${escape(edu.degree || "")}</strong>
                <span style="font-family:'Inter', sans-serif; font-size:11.5px; color:#78716c">${escape(edu.start || "")} – ${escape(edu.end || "")}</span>
              </div>
              <div style="font-size:12.5px; color:#57534e">${escape(edu.institution || "")}</div>
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px">
          <div>
            <h3 style="font-size:13.5px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#7f1d1d; border-bottom:1px solid #d6d3d1; padding-bottom:2px; margin:0 0 8px">Key Projects & Research</h3>
            ${projBlock((proj) => `
              <div style="margin-bottom:8px">
                <strong style="font-size:13px">${escape(proj.name || "")}</strong>
                <div style="font-family:'Inter', sans-serif;">${formatBullets(proj.description)}</div>
              </div>
            `)}
          </div>
          <div>
            <h3 style="font-size:13.5px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#7f1d1d; border-bottom:1px solid #d6d3d1; padding-bottom:2px; margin:0 0 8px">Skills & Competencies</h3>
            <div style="font-family:'Inter', sans-serif;">${formatSkillsChips("#fef2f2", "#fecaca", "#7f1d1d")}</div>
          </div>
        </div>
      </div>`;
    }

    // 12. UX/UI Product Designer Layout
    if (theme.layout === "ux") {
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:linear-gradient(135deg, #4338ca 0%, #06b6d4 100%); padding:26px; border-radius:16px; color:#ffffff; display:flex; justify-content:space-between; align-items:center; margin-bottom:22px; box-shadow:0 8px 24px rgba(67,56,202,0.2)">
          <div>
            <div style="font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; opacity:0.9">PRODUCT & INTERACTION DESIGN</div>
            <h1 style="margin:2px 0 4px; font-size:30px; font-weight:800">${nameText}</h1>
            <div style="font-size:14.5px; font-weight:600; opacity:0.95">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:72px;height:72px;border-radius:18px;object-fit:cover;border:3px solid #fff">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:14px; font-size:12.5px; color:#475569; padding-bottom:12px; border-bottom:2px solid #e0e7ff; margin-bottom:20px">
          <span>📧 ${emailText}</span>
          <span>📞 ${phoneText}</span>
          <span>📍 ${addressText}</span>
          ${p.portfolio ? `<a href="${escape(p.portfolio)}" target="_blank" style="color:#4338ca;font-weight:700">🎨 Figma / Portfolio</a>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14.5px; font-weight:800; color:#4338ca; text-transform:uppercase; letter-spacing:0.04em; margin:0 0 6px">Product Design Philosophy</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14.5px; font-weight:800; color:#4338ca; text-transform:uppercase; letter-spacing:0.04em; margin:0 0 10px">Featured Case Studies</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:12px; background:#f5f3ff; padding:12px; border-radius:10px; border-left:4px solid #4338ca">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:14px; color:#312e81">${escape(proj.name || "")}</strong>
                    <span style="font-size:11.5px; color:#4338ca; font-weight:700">${escape(proj.tech || "")}</span>
                  </div>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:14.5px; font-weight:800; color:#4338ca; text-transform:uppercase; letter-spacing:0.04em; margin:0 0 10px">Design Experience</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:12px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:13.5px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                    <span style="font-size:12px; color:#64748b">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                  </div>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14.5px; font-weight:800; color:#4338ca; text-transform:uppercase; letter-spacing:0.04em; margin:0 0 8px">Design Systems & Tools</h3>
              ${formatSkillsChips("#eef2ff", "#c7d2fe", "#3730a3")}
            </div>
            <div>
              <h3 style="font-size:14.5px; font-weight:800; color:#4338ca; text-transform:uppercase; letter-spacing:0.04em; margin:0 0 8px">Education</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:8px">
                  <strong style="font-size:13px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // 14. Cybersecurity & SecOps Layout
    if (theme.layout === "cyber") {
      return `<div style="font-family:'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:#0f172a; padding:24px; border-radius:10px; color:#ffffff; border-left:5px solid #dc2626; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <div style="font-family:monospace; font-size:11px; color:#f87171; letter-spacing:1px; margin-bottom:2px">&lt;SECURITY_OPERATIONS_PROFILE /&gt;</div>
            <h1 style="margin:0 0 4px; font-size:28px; font-weight:800">${nameText}</h1>
            <div style="font-size:14px; color:#94a3b8; font-weight:600">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:68px;height:68px;border-radius:8px;object-fit:cover;border:2px solid #ef4444">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:12px; color:#475569; padding-bottom:12px; border-bottom:1px solid #cbd5e1; margin-bottom:20px; font-family:monospace">
          <span style="background:#fef2f2;padding:3px 8px;border-radius:4px;color:#991b1b">📧 ${emailText}</span>
          <span style="background:#fef2f2;padding:3px 8px;border-radius:4px;color:#991b1b">📞 ${phoneText}</span>
          <span style="background:#fef2f2;padding:3px 8px;border-radius:4px;color:#991b1b">📍 ${addressText}</span>
          ${p.linkedin ? `<a href="${escape(p.linkedin)}" target="_blank" style="background:#dc2626;color:#fff;padding:3px 8px;border-radius:4px;text-decoration:none">LinkedIn</a>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-family:monospace; font-size:13.5px; font-weight:800; color:#dc2626; text-transform:uppercase; border-bottom:1.5px solid #dc2626; padding-bottom:3px; margin:0 0 6px">// 01. SECURITY POSTURE & SUMMARY</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-family:monospace; font-size:13.5px; font-weight:800; color:#dc2626; text-transform:uppercase; border-bottom:1.5px solid #dc2626; padding-bottom:3px; margin:0 0 10px">// 02. SEC OPS EXPERIENCE</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:12px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:13.5px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                    <span style="font-size:11.5px; color:#64748b; font-family:monospace">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                  </div>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-family:monospace; font-size:13.5px; font-weight:800; color:#dc2626; text-transform:uppercase; border-bottom:1.5px solid #dc2626; padding-bottom:3px; margin:0 0 10px">// 03. THREAT AUDITS & CVE LABS</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:10px; background:#f8fafc; border:1px solid #e2e8f0; border-left:3px solid #dc2626; padding:8px 10px; border-radius:6px">
                  <strong style="font-size:13px; color:#0f172a">${escape(proj.name || "")}</strong>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-family:monospace; font-size:13.5px; font-weight:800; color:#dc2626; text-transform:uppercase; border-bottom:1.5px solid #dc2626; padding-bottom:3px; margin:0 0 8px">// 04. SECURITY STACK</h3>
              ${formatSkillsChips("#fef2f2", "#fca5a5", "#991b1b")}
            </div>
            <div>
              <h3 style="font-family:monospace; font-size:13.5px; font-weight:800; color:#dc2626; text-transform:uppercase; border-bottom:1.5px solid #dc2626; padding-bottom:3px; margin:0 0 8px">// 05. CREDENTIALS</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:8px">
                  <strong style="font-size:13px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // 15. Swiss International Typography Layout (Crisp Contrast)
    if (theme.layout === "swiss") {
      return `<div style="font-family:'Helvetica Neue', Arial, sans-serif; color:#18181b; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="border-bottom:4px solid #18181b; padding-bottom:16px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:flex-end">
          <div>
            <span style="background:#e11d48; color:#fff; font-size:10px; font-weight:900; letter-spacing:1.5px; padding:2px 6px; text-transform:uppercase">SWISS GRID ATS</span>
            <h1 style="margin:4px 0 0; font-size:32px; font-weight:900; letter-spacing:-0.03em; text-transform:uppercase">${nameText}</h1>
            <div style="font-size:14px; font-weight:700; color:#52525b">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:64px;height:64px;border-radius:0;border:2px solid #18181b;object-fit:cover">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:14px; font-size:11.5px; font-weight:700; color:#3f3f46; padding-bottom:12px; border-bottom:1px solid #e4e4e7; margin-bottom:20px">
          <span>${emailText}</span> / <span>${phoneText}</span> / <span>${addressText}</span>
          ${p.linkedin ? `/ <span><a href="${escape(p.linkedin)}" target="_blank" style="color:#e11d48">LINKEDIN</a></span>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:13px; font-weight:900; text-transform:uppercase; letter-spacing:1px; color:#18181b; border-bottom:2px solid #18181b; padding-bottom:2px; margin:0 0 6px">01. EXECUTIVE SUMMARY</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:13px; font-weight:900; text-transform:uppercase; letter-spacing:1px; color:#18181b; border-bottom:2px solid #18181b; padding-bottom:2px; margin:0 0 10px">02. WORK EXPERIENCE</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:12px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:14px; color:#18181b">${escape(x.title || "")} / ${escape(x.company || "")}</strong>
                    <span style="font-size:11.5px; color:#71717a">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
                  </div>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:13px; font-weight:900; text-transform:uppercase; letter-spacing:1px; color:#18181b; border-bottom:2px solid #18181b; padding-bottom:2px; margin:0 0 10px">03. PROJECTS</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:10px">
                  <strong style="font-size:13px">${escape(proj.name || "")}</strong>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:13px; font-weight:900; text-transform:uppercase; letter-spacing:1px; color:#18181b; border-bottom:2px solid #18181b; padding-bottom:2px; margin:0 0 8px">04. COMPETENCIES</h3>
              ${formatSkillsChips("#f4f4f5", "#d4d4d8", "#18181b")}
            </div>
            <div>
              <h3 style="font-size:13px; font-weight:900; text-transform:uppercase; letter-spacing:1px; color:#18181b; border-bottom:2px solid #18181b; padding-bottom:2px; margin:0 0 8px">05. EDUCATION</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:8px">
                  <strong style="font-size:13px; color:#18181b; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px; color:#71717a">${escape(edu.institution || "")}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // 16. Nordic Clean Slate Layout
    if (theme.layout === "nordic") {
      return `<div style="font-family:'Inter', sans-serif; color:#334155; line-height:1.6; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="padding-bottom:16px; margin-bottom:20px; border-bottom:1px solid #cbd5e1; display:flex; justify-content:space-between; align-items:center">
          <div>
            <h1 style="margin:0 0 2px; font-size:28px; font-weight:700; color:#1e293b">${nameText}</h1>
            <div style="font-size:14px; color:#64748b; font-weight:500">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:60px;height:60px;border-radius:50%;object-fit:cover">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:12px; color:#94a3b8; margin-bottom:20px">
          <span>${emailText}</span> • <span>${phoneText}</span> • <span>${addressText}</span>
          ${p.linkedin ? `• <span><a href="${escape(p.linkedin)}" target="_blank" style="color:#475569">LinkedIn</a></span>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#475569; margin:0 0 6px">About</h3>
          ${summaryBlock}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#475569; margin:0 0 10px">Experience</h3>
          ${expBlock((x) => `
            <div style="margin-bottom:12px">
              <div style="display:flex; justify-content:space-between">
                <strong style="font-size:13.5px; color:#0f172a">${escape(x.title || "")}, ${escape(x.company || "")}</strong>
                <span style="font-size:11.5px; color:#94a3b8">${escape(x.start || "")} — ${escape(x.end || "Present")}</span>
              </div>
              ${formatBullets(x.responsibilities)}
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <h3 style="font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#475569; margin:0 0 8px">Projects</h3>
            ${projBlock((proj) => `
              <div style="margin-bottom:8px">
                <strong style="font-size:13px; color:#1e293b">${escape(proj.name || "")}</strong>
                ${formatBullets(proj.description)}
              </div>
            `)}
          </div>
          <div>
            <h3 style="font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#475569; margin:0 0 8px">Skills & Education</h3>
            ${formatSkillsChips()}
          </div>
        </div>
      </div>`;
    }

    // 17. Motion & 3D Animator Layout
    if (theme.layout === "motion") {
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:linear-gradient(135deg, #9333ea 0%, #ec4899 100%); padding:26px; border-radius:16px; color:#ffffff; display:flex; justify-content:space-between; align-items:center; margin-bottom:22px">
          <div>
            <div style="font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; opacity:0.9">🎬 3D ART & MOTION DESIGN</div>
            <h1 style="margin:2px 0 4px; font-size:30px; font-weight:800">${nameText}</h1>
            <div style="font-size:14.5px; font-weight:600; opacity:0.95">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:72px;height:72px;border-radius:16px;object-fit:cover;border:3px solid #fff">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:14px; font-size:12.5px; color:#475569; padding-bottom:12px; border-bottom:2px solid #fae8ff; margin-bottom:20px">
          <span>📧 ${emailText}</span> • <span>📞 ${phoneText}</span> • <span>📍 ${addressText}</span>
          ${p.portfolio ? `• <a href="${escape(p.portfolio)}" target="_blank" style="color:#9333ea;font-weight:700">ArtStation / Reel</a>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14.5px; font-weight:800; color:#9333ea; text-transform:uppercase; margin:0 0 6px">Artist Statement & Reel Summary</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14.5px; font-weight:800; color:#9333ea; text-transform:uppercase; margin:0 0 10px">Key Productions & Shows</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:12px; background:#faf5ff; border-left:4px solid #9333ea; padding:10px 12px; border-radius:8px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:14px; color:#581c87">${escape(proj.name || "")}</strong>
                    <span style="font-size:11.5px; color:#9333ea; font-weight:700">${escape(proj.tech || "")}</span>
                  </div>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:14.5px; font-weight:800; color:#9333ea; text-transform:uppercase; margin:0 0 10px">Studio History</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:12px">
                  <div style="display:flex; justify-content:space-between">
                    <strong style="font-size:13.5px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                    <span style="font-size:11.5px; color:#64748b">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                  </div>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14.5px; font-weight:800; color:#9333ea; text-transform:uppercase; margin:0 0 8px">VFX & Software Stack</h3>
              ${formatSkillsChips("#fdf4ff", "#f5d0fe", "#86198f")}
            </div>
            <div>
              <h3 style="font-size:14.5px; font-weight:800; color:#9333ea; text-transform:uppercase; margin:0 0 8px">Education</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:8px">
                  <strong style="font-size:13px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // 18. Editorial & Publishing Layout
    if (theme.layout === "editorial") {
      return `<div style="font-family:'Georgia', serif; color:#1c1917; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="border-top:3px solid #831843; border-bottom:1px solid #831843; padding:18px 0; margin-bottom:20px; text-align:center">
          <div style="font-family:'Inter', sans-serif; font-size:10px; font-weight:800; color:#be185d; letter-spacing:2px; text-transform:uppercase">EDITORIAL & ART DIRECTION</div>
          <h1 style="margin:2px 0 4px; font-size:32px; font-weight:700; color:#831843">${nameText}</h1>
          <div style="font-size:14px; font-style:italic; color:#701a75">${headlineText}</div>
          <div style="font-family:'Inter', sans-serif; display:flex; justify-content:center; flex-wrap:wrap; gap:16px; font-size:11.5px; color:#78716c; margin-top:8px">
            <span>${emailText}</span> • <span>${phoneText}</span> • <span>${addressText}</span>
          </div>
        </div>
        <div style="margin-bottom:20px; font-size:13.5px; font-style:italic; border-left:3px solid #be185d; padding-left:14px">
          ${summaryBlock}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:13.5px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#831843; border-bottom:1px solid #fbcfe8; padding-bottom:3px; margin:0 0 10px">Editorial & Creative Experience</h3>
          ${expBlock((x) => `
            <div style="margin-bottom:12px">
              <div style="display:flex; justify-content:space-between">
                <strong style="font-size:14px; color:#1c1917">${escape(x.title || "")} — ${escape(x.company || "")}</strong>
                <span style="font-family:'Inter', sans-serif; font-size:11.5px; color:#78716c">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
              </div>
              <div style="font-family:'Inter', sans-serif;">${formatBullets(x.responsibilities)}</div>
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <h3 style="font-size:13.5px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#831843; border-bottom:1px solid #fbcfe8; padding-bottom:3px; margin:0 0 8px">Major Publications</h3>
            ${projBlock((proj) => `
              <div style="margin-bottom:8px">
                <strong style="font-size:13px">${escape(proj.name || "")}</strong>
                <div style="font-family:'Inter', sans-serif;">${formatBullets(proj.description)}</div>
              </div>
            `)}
          </div>
          <div>
            <h3 style="font-size:13.5px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#831843; border-bottom:1px solid #fbcfe8; padding-bottom:3px; margin:0 0 8px">Creative Direction Matrix</h3>
            <div style="font-family:'Inter', sans-serif;">${formatSkillsChips("#fdf2f8", "#fbcfe8", "#831843")}</div>
          </div>
        </div>
      </div>`;
    }

    // 19. Vice President & GM Layout
    if (theme.layout === "vp") {
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%); padding:26px; border-radius:12px; color:#ffffff; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
          <div>
            <div style="font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; opacity:0.9">GENERAL MANAGEMENT & ENTERPRISE LEADERSHIP</div>
            <h1 style="margin:2px 0 4px; font-size:30px; font-weight:800">${nameText}</h1>
            <div style="font-size:15px; font-weight:600; opacity:0.95">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:72px;height:72px;border-radius:10px;object-fit:cover;border:3px solid #fff">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:12.5px; color:#475569; padding-bottom:12px; border-bottom:1.5px solid #cbd5e1; margin-bottom:20px; font-weight:600">
          <span>EMAIL: ${emailText}</span> | <span>PHONE: ${phoneText}</span> | <span>LOCATION: ${addressText}</span>
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14.5px; font-weight:800; color:#1e3a8a; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1.5px solid #1e3a8a; padding-bottom:3px; margin:0 0 6px">Executive Summary & P&L Scale</h3>
          ${summaryBlock}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14.5px; font-weight:800; color:#1e3a8a; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1.5px solid #1e3a8a; padding-bottom:3px; margin:0 0 10px">Executive Career Milestones</h3>
          ${expBlock((x) => `
            <div style="margin-bottom:12px">
              <div style="display:flex; justify-content:space-between; align-items:baseline">
                <strong style="font-size:14px; color:#0f172a">${escape(x.title || "")} — ${escape(x.company || "")}</strong>
                <span style="font-size:11.5px; color:#64748b; font-weight:600">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
              </div>
              ${formatBullets(x.responsibilities)}
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <h3 style="font-size:14.5px; font-weight:800; color:#1e3a8a; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1.5px solid #1e3a8a; padding-bottom:3px; margin:0 0 8px">Enterprise Competencies</h3>
            ${formatSkillsChips("#eff6ff", "#bfdbfe", "#1e40af")}
          </div>
          <div>
            <h3 style="font-size:14.5px; font-weight:800; color:#1e3a8a; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1.5px solid #1e3a8a; padding-bottom:3px; margin:0 0 8px">Executive Credentials</h3>
            ${eduBlock((edu) => `
              <div style="margin-bottom:8px">
                <strong style="font-size:13px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
              </div>
            `)}
          </div>
        </div>
      </div>`;
    }

    // 20. Chief Financial Officer Layout
    if (theme.layout === "cfo") {
      return `<div style="font-family:'Outfit', 'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="border-top:4px solid #047857; border-bottom:2px solid #064e3b; padding:18px 0; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center">
          <div>
            <div style="font-size:11px; font-weight:800; color:#047857; letter-spacing:1px; text-transform:uppercase">CHIEF FINANCIAL OFFICER & FISCAL STRATEGY</div>
            <h1 style="margin:2px 0 4px; font-size:30px; font-weight:800; color:#064e3b">${nameText}</h1>
            <div style="font-size:15px; color:#334155; font-weight:700">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:70px;height:70px;border-radius:6px;object-fit:cover;border:2px solid #047857">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:12px; color:#475569; padding-bottom:12px; border-bottom:1px solid #cbd5e1; margin-bottom:20px; font-weight:600">
          <span>EMAIL: ${emailText}</span> | <span>PHONE: ${phoneText}</span> | <span>LOCATION: ${addressText}</span>
        </div>
        <div style="margin-bottom:20px; background:#ecfdf5; border-left:4px solid #047857; padding:12px; border-radius:4px">
          <h3 style="font-size:13.5px; font-weight:800; color:#064e3b; text-transform:uppercase; margin:0 0 4px">Financial Governance & Capital Leadership</h3>
          ${summaryBlock}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14px; font-weight:800; color:#047857; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1.5px solid #047857; padding-bottom:3px; margin:0 0 10px">Financial Leadership & Treasury Track Record</h3>
          ${expBlock((x) => `
            <div style="margin-bottom:12px">
              <div style="display:flex; justify-content:space-between">
                <strong style="font-size:14px; color:#0f172a">${escape(x.title || "")} — ${escape(x.company || "")}</strong>
                <span style="font-size:11.5px; color:#64748b; font-weight:600">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
              </div>
              ${formatBullets(x.responsibilities)}
            </div>
          `)}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <h3 style="font-size:14px; font-weight:800; color:#047857; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1.5px solid #047857; padding-bottom:3px; margin:0 0 8px">Fiscal Strategy Matrix</h3>
            ${formatSkillsChips("#ecfdf5", "#a7f3d0", "#064e3b")}
          </div>
          <div>
            <h3 style="font-size:14px; font-weight:800; color:#047857; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1.5px solid #047857; padding-bottom:3px; margin:0 0 8px">Degrees & Credentials</h3>
            ${eduBlock((edu) => `
              <div style="margin-bottom:8px">
                <strong style="font-size:13px; color:#0f172a; display:block">${escape(edu.degree || "")}</strong>
                <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
              </div>
            `)}
          </div>
        </div>
      </div>`;
    }

    // 21. STEM Engineering Graduate Layout
    if (theme.layout === "stem") {
      return `<div style="font-family:'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%); padding:24px; border-radius:12px; color:#ffffff; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
          <div>
            <div style="font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; opacity:0.9">⚙️ STEM ENGINEERING & APPLIED SCIENCE</div>
            <h1 style="font-family:'Outfit', sans-serif; margin:2px 0 4px; font-size:28px; font-weight:800">${nameText}</h1>
            <div style="font-size:14px; font-weight:600; opacity:0.95">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:68px;height:68px;border-radius:12px;object-fit:cover;border:2px solid #fff">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:14px; font-size:12px; color:#475569; padding-bottom:12px; border-bottom:2px solid #dbeafe; margin-bottom:20px">
          <span>📧 ${emailText}</span> • <span>📞 ${phoneText}</span> • <span>📍 ${addressText}</span>
          ${p.linkedin ? `• <a href="${escape(p.linkedin)}" target="_blank" style="color:#1d4ed8;font-weight:600">LinkedIn</a></span>` : ""}
        </div>
        <div style="margin-bottom:20px">
          <h3 style="font-size:14px; font-weight:800; color:#1d4ed8; text-transform:uppercase; border-bottom:2px solid #dbeafe; padding-bottom:3px; margin:0 0 6px">Engineering Focus & Objectives</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; color:#1d4ed8; text-transform:uppercase; border-bottom:2px solid #dbeafe; padding-bottom:3px; margin:0 0 8px">Engineering Degree</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:10px; background:#eff6ff; padding:10px; border-radius:6px; border-left:3px solid #1d4ed8">
                  <strong style="font-size:13.5px; color:#1e40af">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
                  <div style="font-size:11px; color:#3b82f6">${escape(edu.start || "")} - ${escape(edu.end || "")}</div>
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; color:#1d4ed8; text-transform:uppercase; border-bottom:2px solid #dbeafe; padding-bottom:3px; margin:0 0 8px">Capstone Projects & Labs</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:10px">
                  <strong style="font-size:13px; color:#0f172a">${escape(proj.name || "")}</strong>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; color:#1d4ed8; text-transform:uppercase; border-bottom:2px solid #dbeafe; padding-bottom:3px; margin:0 0 8px">Technical & Lab Skills</h3>
              ${formatSkillsChips("#eff6ff", "#bfdbfe", "#1d4ed8")}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; color:#1d4ed8; text-transform:uppercase; border-bottom:2px solid #dbeafe; padding-bottom:3px; margin:0 0 8px">Internships & Co-Ops</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:10px">
                  <strong style="font-size:13px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // 22. High-Potential Intern Layout
    if (theme.layout === "intern") {
      return `<div style="font-family:'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:linear-gradient(135deg, #0d9488 0%, #10b981 100%); padding:24px; border-radius:12px; color:#ffffff; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
          <div>
            <div style="font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; opacity:0.9">🌱 EMERGING TALENT & INTERNSHIP READY</div>
            <h1 style="font-family:'Outfit', sans-serif; margin:2px 0 4px; font-size:28px; font-weight:800">${nameText}</h1>
            <div style="font-size:14px; font-weight:600; opacity:0.95">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:68px;height:68px;border-radius:50%;object-fit:cover;border:3px solid #fff">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:14px; font-size:12px; color:#475569; padding-bottom:12px; border-bottom:2px solid #ccfbf1; margin-bottom:20px">
          <span>📧 ${emailText}</span> • <span>📞 ${phoneText}</span> • <span>📍 ${addressText}</span>
        </div>
        <div style="margin-bottom:20px; background:#f0fdfa; border-left:4px solid #0d9488; padding:12px; border-radius:4px">
          <h3 style="font-size:13.5px; font-weight:800; color:#0f766e; text-transform:uppercase; margin:0 0 4px">Career Aspirations</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; color:#0d9488; text-transform:uppercase; border-bottom:2px solid #ccfbf1; padding-bottom:3px; margin:0 0 8px">Education & Honors</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:10px">
                  <strong style="font-size:13.5px; color:#0f172a">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; color:#0d9488; text-transform:uppercase; border-bottom:2px solid #ccfbf1; padding-bottom:3px; margin:0 0 8px">Extracurricular Leadership</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:10px">
                  <strong style="font-size:13px; color:#0f172a">${escape(proj.name || "")}</strong>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
          </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; color:#0d9488; text-transform:uppercase; border-bottom:2px solid #ccfbf1; padding-bottom:3px; margin:0 0 8px">Core Skills</h3>
              ${formatSkillsChips("#ccfbf1", "#5eead4", "#0f766e")}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; color:#0d9488; text-transform:uppercase; border-bottom:2px solid #ccfbf1; padding-bottom:3px; margin:0 0 8px">Practical Experience</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:10px">
                  <strong style="font-size:13px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // 23. Dean's List Honors Scholar Layout
    if (theme.layout === "honors") {
      return `<div style="font-family:'Inter', sans-serif; color:#0f172a; line-height:1.5; padding:32px 36px; box-sizing:border-box; min-height:1123px; width:100%;">
        <div style="background:linear-gradient(135deg, #6b21a8 0%, #9333ea 100%); padding:24px; border-radius:12px; color:#ffffff; display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
          <div>
            <div style="font-size:11px; font-weight:800; letter-spacing:1px; text-transform:uppercase; opacity:0.9">🏆 DEAN'S LIST HONORS & DISTINCTION</div>
            <h1 style="font-family:'Outfit', sans-serif; margin:2px 0 4px; font-size:28px; font-weight:800">${nameText}</h1>
            <div style="font-size:14px; font-weight:600; opacity:0.95">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:68px;height:68px;border-radius:12px;object-fit:cover;border:3px solid #fff">` : ""}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:14px; font-size:12px; color:#475569; padding-bottom:12px; border-bottom:2px solid #f3e8ff; margin-bottom:20px">
          <span>📧 ${emailText}</span> • <span>📞 ${phoneText}</span> • <span>📍 ${addressText}</span>
        </div>
        <div style="margin-bottom:20px; background:#faf5ff; border-left:4px solid #7e22ce; padding:12px; border-radius:4px">
          <h3 style="font-size:13.5px; font-weight:800; color:#581c87; text-transform:uppercase; margin:0 0 4px">Academic Honors Profile</h3>
          ${summaryBlock}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px">
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; color:#7e22ce; text-transform:uppercase; border-bottom:2px solid #f3e8ff; padding-bottom:3px; margin:0 0 8px">Academic Degrees</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:10px; background:#faf5ff; padding:10px; border-radius:6px; border-left:3px solid #7e22ce">
                  <strong style="font-size:13.5px; color:#581c87">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px; color:#64748b">${escape(edu.institution || "")}</div>
                </div>
              `)}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; color:#7e22ce; text-transform:uppercase; border-bottom:2px solid #f3e8ff; padding-bottom:3px; margin:0 0 8px">Research & Academic Projects</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:10px">
                  <strong style="font-size:13px; color:#0f172a">${escape(proj.name || "")}</strong>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
          <div>
            <div style="margin-bottom:20px">
              <h3 style="font-size:14px; font-weight:800; color:#7e22ce; text-transform:uppercase; border-bottom:2px solid #f3e8ff; padding-bottom:3px; margin:0 0 8px">Core Competencies</h3>
              ${formatSkillsChips("#faf5ff", "#e9d5ff", "#581c87")}
            </div>
            <div>
              <h3 style="font-size:14px; font-weight:800; color:#7e22ce; text-transform:uppercase; border-bottom:2px solid #f3e8ff; padding-bottom:3px; margin:0 0 8px">Fellowships & Experience</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:10px">
                  <strong style="font-size:13px; color:#0f172a">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>`;
    }

    // Default Modern Layout (Corporate standard — Full A4 balanced height)
    return `<div style="font-family:'Inter',sans-serif;color:#0e131f;line-height:1.45;padding:24px 26px;box-sizing:border-box;width:100%;min-height:1123px;background:#ffffff;display:flex;flex-direction:column;justify-content:flex-start;">
      <div style="flex:1;">
        <div style="background:${theme.gradient};padding:16px 20px;border-radius:10px;color:#ffffff;display:flex;align-items:center;justify-content:space-between;margin-bottom:13px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          <div>
            <h1 style="font-family:'Outfit',sans-serif;margin:0 0 3px;font-size:26px;font-weight:800;letter-spacing:-0.02em;">${nameText}</h1>
            <div style="font-size:14px;font-weight:600;opacity:0.95;">${headlineText}</div>
          </div>
          ${p.photo ? `<img src="${p.photo}" style="width:58px;height:58px;border-radius:50%;object-fit:cover;border:2.5px solid #ffffff;box-shadow:0 2px 6px rgba(0,0,0,0.15);">` : ""}
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:7px;font-size:12px;color:#475569;padding-bottom:10px;border-bottom:1.5px solid #e2e8f0;margin-bottom:13px;">
          <span style="background:#f8fafc;padding:3px 8px;border-radius:4px;border:1px solid #e2e8f0;">📧 ${emailText}</span>
          <span style="background:#f8fafc;padding:3px 8px;border-radius:4px;border:1px solid #e2e8f0;">📞 ${phoneText}</span>
          <span style="background:#f8fafc;padding:3px 8px;border-radius:4px;border:1px solid #e2e8f0;">📍 ${addressText}</span>
          ${linkedinUrl !== '#' ? `<a href="${linkedinUrl}" target="_blank" style="background:#eff6ff;color:${theme.primary};text-decoration:none;font-weight:700;padding:3px 8px;border-radius:4px;border:1px solid #dbeafe;">💼 LinkedIn</a>` : ""}
          ${portfolioUrl !== '#' ? `<a href="${portfolioUrl}" target="_blank" style="background:#f0fdf4;color:#059669;text-decoration:none;font-weight:700;padding:3px 8px;border-radius:4px;border:1px solid #bbf7d0;">🌐 Portfolio</a>` : ""}
        </div>

        <div style="display:grid;grid-template-columns:1.8fr 1.2fr;gap:16px;margin-bottom:10px;">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <h3 style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;color:${theme.primary};text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid ${theme.primary}33;padding-bottom:3px;margin:0 0 6px;">Professional Summary</h3>
              <p style="font-size:12.5px;color:#334155;margin:0;line-height:1.55;overflow-wrap:break-word;word-break:break-word;overflow:hidden;">${summaryText}</p>
            </div>

            <div>
              <h3 style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;color:${theme.primary};text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid ${theme.primary}33;padding-bottom:3px;margin:0 0 7px;">Experience & Internships</h3>
              ${expBlock((x) => `
                <div style="margin-bottom:9px;padding-left:10px;border-left:2px solid ${theme.primary}44;">
                  <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:3px;margin-bottom:2px;">
                    <div>
                      <strong style="font-size:13px;color:#0e131f;">${escape(x.title || "")}</strong>
                      <span style="font-size:12.5px;color:#475569;"> @ ${escape(x.company || "")}</span>
                      ${x.type ? `<span style="font-size:10px;background:#f1f5f9;color:#475569;padding:1px 5px;border-radius:3px;margin-left:3px;font-weight:600;">${escape(x.type)}</span>` : ""}
                    </div>
                    <span style="font-size:11px;color:#64748b;font-weight:600;white-space:nowrap;">${escape(x.start || "")} – ${escape(x.end || "Present")}</span>
                  </div>
                  ${formatBullets(x.responsibilities)}
                </div>
              `)}
            </div>

            <div>
              <h3 style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;color:${theme.primary};text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid ${theme.primary}33;padding-bottom:3px;margin:0 0 7px;">Key Projects</h3>
              ${projBlock((proj) => `
                <div style="margin-bottom:8px;background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid ${theme.primary};padding:8px 10px;border-radius:5px;">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:3px;margin-bottom:3px;">
                    <div>
                      <strong style="font-size:13px;color:#0e131f;">${escape(proj.name || "")}</strong>
                      ${proj.tech ? `<div style="font-size:11.5px;color:${theme.primary};font-weight:700;margin-top:1px;">${escape(proj.tech)}</div>` : ""}
                    </div>
                    <div style="display:flex;gap:4px;align-items:center;">
                      ${proj.github ? `<a href="${escape(proj.github)}" target="_blank" style="font-size:10px;color:${theme.primary};text-decoration:none;font-weight:700;background:#fff;border:1px solid #cbd5e1;padding:2px 6px;border-radius:3px;">💻 Code</a>` : ""}
                      ${proj.demo ? `<a href="${escape(proj.demo)}" target="_blank" style="font-size:10px;color:#059669;text-decoration:none;font-weight:700;background:#ecfdf5;border:1px solid #a7f3d0;padding:2px 6px;border-radius:3px;">🔗 Demo</a>` : ""}
                    </div>
                  </div>
                  ${formatBullets(proj.description)}
                </div>
              `)}
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <h3 style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;color:${theme.primary};text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid ${theme.primary}33;padding-bottom:3px;margin:0 0 7px;">Skills & Tools</h3>
              ${formatSkillsChips()}
            </div>

            <div>
              <h3 style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;color:${theme.primary};text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid ${theme.primary}33;padding-bottom:3px;margin:0 0 7px;">Education</h3>
              ${eduBlock((edu) => `
                <div style="margin-bottom:7px;background:#f8fafc;border:1px solid #e2e8f0;padding:8px 10px;border-radius:5px;">
                  <strong style="font-size:13px;color:#0e131f;display:block;">${escape(edu.degree || "")}</strong>
                  <div style="font-size:12px;color:#475569;font-weight:500;margin-top:2px;">${escape(edu.institution || "")}</div>
                  <div style="font-size:11px;color:#64748b;margin-top:2px;font-weight:600;">${escape(edu.start || "")}${edu.end ? ` – ${escape(edu.end)}` : ""}</div>
                </div>
              `)}
            </div>

            ${achList.length > 0 ? `
              <div>
                <h3 style="font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;color:${theme.primary};text-transform:uppercase;letter-spacing:0.06em;border-bottom:2px solid ${theme.primary}33;padding-bottom:3px;margin:0 0 7px;">Honors & Awards</h3>
                ${achBlock((ach) => `
                  <div style="margin-bottom:7px;background:#fffbeb;border:1px solid #fef3c7;border-left:3px solid #f59e0b;padding:7px 9px;border-radius:5px;">
                    <strong style="font-size:12.5px;color:#92400e;display:block;">🏆 ${escape(ach.title || "")}</strong>
                    <div style="font-size:11.5px;color:#78350f;margin-top:2px;">${escape(ach.org || "")}${ach.date ? ` · ${escape(ach.date)}` : ""}</div>
                  </div>
                `)}
              </div>
            ` : ""}
          </div>
        </div>
      </div>

      <div style="margin-top:6px;padding-top:6px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:flex-end;font-size:11px;color:#64748b;">
        <div>
          <strong style="color:#334155;">Declaration:</strong> I hereby declare that all information above is true and verified.
        </div>
        <div style="text-align:right;min-width:120px;border-top:1px dashed #cbd5e1;padding-top:2px;margin-left:10px;">
          <strong style="color:#0f172a;display:block;font-size:12px;">${nameText}</strong>
          <span style="font-size:10px;color:#64748b;">Authorized Signatory</span>
        </div>
      </div>
    </div>`;
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

  function showFormErrorModal(missingFields = []) {
    const errorModal = document.getElementById("formErrorModal");
    const errorList = document.getElementById("formErrorList");

    if (errorList) {
      if (missingFields.length === 0) {
        errorList.innerHTML = "<li>❌ <strong>Personal Information & required sections missing</strong></li>";
      } else {
        errorList.innerHTML = missingFields.map(field => `<li>❌ <strong>${escape(field)}</strong></li>`).join("");
      }
    }

    if (errorModal) {
      errorModal.setAttribute("aria-hidden", "false");
    } else {
      alert("❌ Cannot Export PDF!\n\nPlease fill out your resume details before downloading/exporting.\n\nMissing Required Sections:\n• " + missingFields.join("\n• "));
    }

    showToast("Please fill out your resume details before exporting PDF!", 4500);
  }

  function closeFormErrorModal() {
    const errorModal = document.getElementById("formErrorModal");
    if (errorModal) {
      errorModal.setAttribute("aria-hidden", "true");
    }
  }

  // Export PDF with 3.5s page loader overlay & direct download via html2pdf
  function exportPDF(evt) {
    const check = checkFormCompletion();
    if (!check.isComplete) {
      showFormErrorModal(check.missingFields);
      return;
    }

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

    showToast("Generating high-quality PDF document, please wait...");

    // ── Reliable PDF: styled print window ────────────────────────────────
    const rawName = state.personal?.fullName
      ? state.personal.fullName.trim().replace(/\s+/g, "_")
      : "My";
    const resumeHtml = buildResumeHtml();
    const title = `${rawName}_Resume`;

    const printWin = window.open("", "_blank", "width=900,height=700");
    if (!printWin) {
      showToast("Popup blocked! Please allow popups and try again.");
      if (overlay) overlay.setAttribute("aria-hidden", "true");
      if (btn) { btn.disabled = false; btn.style.pointerEvents = "auto"; btn.style.opacity = "1"; btn.innerHTML = originalContent; }
      return;
    }

    printWin.document.write(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { font-family: 'Inter', sans-serif; background: #ffffff; color: #0f172a; width: 210mm; margin: 0 auto; }
    @page { size: A4 portrait; margin: 0; }
    @media print { html, body { width: 210mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    ul.resume-bullets { margin: 3px 0 0 12px; padding: 0; list-style: none; }
    ul.resume-bullets li { font-size: 10.5px; color: #334155; line-height: 1.5; margin-bottom: 2px; padding-left: 10px; position: relative; }
    ul.resume-bullets li::before { content: "•"; position: absolute; left: 0; opacity: 0.6; }
    .skill-chip { display: inline-block; font-size: 9.5px; padding: 2px 7px; border-radius: 20px; margin: 2px; font-weight: 600; }
  </style>
</head>
<body>
  ${resumeHtml}
  <script>
    window.addEventListener('load', function() { setTimeout(function() { window.print(); }, 600); });
  <\/script>
</body>
</html>`);
    printWin.document.close();

    if (overlay) overlay.setAttribute("aria-hidden", "true");
    if (btn) { btn.disabled = false; btn.style.pointerEvents = "auto"; btn.style.opacity = "1"; btn.innerHTML = originalContent; }
    showToast("Print dialog opened — choose 'Save as PDF' to download! 🎉");
  }

  function fallbackPrint() {
    const rawName = state.personal?.fullName ? state.personal.fullName.trim().replace(/\s+/g, "_") : "My";
    const title = `${rawName}_Resume`;
    const resumeHtml = buildResumeHtml();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800&display=swap');
    * { box-sizing: border-box; }
    html, body { font-family: 'Inter', sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 0; width: 100%; }
    @page { size: A4 portrait; margin: 0; }
  </style>
</head>
<body>
  ${resumeHtml}
</body>
</html>`);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    } else {
      window.print();
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

  // ── ACCURATE REAL-TIME ATS COMPATIBILITY ENGINE ──
  const ATS_ACTION_VERBS = [
    "spearheaded", "architected", "optimized", "streamlined", "engineered",
    "developed", "deployed", "implemented", "orchestrated", "designed",
    "accelerated", "boosted", "maximized", "automated", "mentored",
    "executed", "directed", "built", "managed", "formulated", "established",
    "transformed", "collaborated", "achieved", "delivered", "negotiated", "created",
    "reduced", "increased", "generated", "solved", "resolved", "improved", "launched",
    "programmed", "authored", "led", "facilitated", "integrated", "constructed", "scaled"
  ];

  function calculateAtsScore() {
    let score = 0;
    const tips = [];
    const foundVerbs = [];

    const details = {
      format: 100,
      metrics: 0,
      verbs: 0,
      sections: 0
    };

    // 1. Personal & Contact Completeness (max 20 pts)
    const p = state.personal || {};
    let personalScore = 0;
    if (p.fullName && p.fullName.trim().length >= 2) {
      personalScore += 4;
    } else {
      tips.push({ text: "Add your full legal name", done: false });
    }

    if (p.headline && p.headline.trim().length >= 3) {
      personalScore += 4;
    } else {
      tips.push({ text: "Add a specific target Job Title / Headline (e.g. 'Software Engineer')", done: false });
    }

    if (p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) {
      personalScore += 4;
    } else {
      tips.push({ text: "Add a valid professional email address", done: false });
    }

    if (p.phone && p.phone.replace(/\D/g, '').length >= 7) {
      personalScore += 4;
    } else {
      tips.push({ text: "Add a phone number with country/area code", done: false });
    }

    if (p.address && p.address.trim().length >= 2) {
      personalScore += 2;
    }

    if (p.linkedin || p.portfolio) {
      personalScore += 2;
    } else {
      tips.push({ text: "Add a LinkedIn or Portfolio link for recruiter verification", done: false });
    }
    score += personalScore;

    // 2. Professional Summary (max 15 pts)
    const sumText = (state.summary?.text || "").trim();
    const sumWords = sumText.length > 0 ? sumText.split(/\s+/).filter(Boolean).length : 0;
    if (sumWords >= 10) score += 5;
    if (sumWords >= 30) score += 5;
    if (sumWords >= 50) score += 5;
    if (sumWords < 20) {
      tips.push({ text: "Expand Professional Summary to at least 30-50 words highlighting strengths", done: false });
    }

    // 3. Technical & Soft Skills Matrix (max 20 pts)
    const techSkills = Array.isArray(state.skills?.technical) ? state.skills.technical : [];
    const softSkills = Array.isArray(state.skills?.soft) ? state.skills.soft : [];
    const langSkills = Array.isArray(state.skills?.languages) ? state.skills.languages : [];
    const certSkills = Array.isArray(state.skills?.certifications) ? state.skills.certifications : [];

    if (techSkills.length >= 1) score += 3;
    if (techSkills.length >= 4) score += 4;
    if (techSkills.length >= 7) score += 4; // up to 11 pts
    if (softSkills.length >= 2) score += 4;
    if (langSkills.length >= 1) score += 2;
    if (certSkills.length >= 1) score += 3;

    if (techSkills.length < 5) {
      tips.push({ text: `Add ${Math.max(1, 5 - techSkills.length)} more Technical Skill(s) for keyword scanning`, done: false });
    }
    if (softSkills.length < 2) {
      tips.push({ text: "Add 2+ Soft Skills (e.g. Team Collaboration, Problem Solving)", done: false });
    }

    // 4. Education Credentials (max 15 pts)
    const eduList = Array.isArray(state.education) ? state.education : [];
    if (eduList.length >= 1) {
      score += 6;
      const firstEdu = eduList[0] || {};
      if (firstEdu.degree || firstEdu.major || firstEdu.field) score += 5;
      if (firstEdu.institution || firstEdu.school) score += 4;
    } else {
      tips.push({ text: "Add your Education details (Degree & College/University)", done: false });
    }

    // 5. Work Experience & Projects (max 30 pts)
    const expList = Array.isArray(state.experience) ? state.experience : [];
    const projList = Array.isArray(state.projects) ? state.projects : [];
    const achList = Array.isArray(state.achievements) ? state.achievements : [];

    // Experience pts (up to 18)
    if (expList.length >= 1) {
      score += 7;
      if (expList[0]?.title && expList[0]?.company) score += 4;
      if (expList[0]?.responsibilities && expList[0].responsibilities.length >= 30) score += 4;
      if (expList.length >= 2) score += 3;
    }

    // Projects pts (up to 12)
    if (projList.length >= 1) {
      score += 5;
      if (projList[0]?.tech) score += 3;
      if (projList[0]?.description && projList[0].description.length >= 20) score += 4;
    }

    // If candidate has no experience, projects can bridge the gap for freshers
    if (expList.length === 0 && projList.length >= 2) {
      score += 6;
    }

    if (expList.length === 0 && projList.length === 0) {
      tips.push({ text: "Add at least 1 Work Experience role or hands-on Project", done: false });
    }

    // Combine all text to analyze metrics & action verbs
    const allText = [
      sumText,
      ...expList.map(e => `${e.title || ""} ${e.company || ""} ${e.responsibilities || ""}`),
      ...projList.map(p => `${p.name || ""} ${p.tech || ""} ${p.description || ""}`),
      ...achList.map(a => `${a.title || ""} ${a.org || ""} ${a.description || ""}`),
    ].join(" ").toLowerCase();

    // Metric Impact Score (check for %, numbers, metrics, $, k, x, etc.)
    const metricMatches = allText.match(/\b\d+(\.\d+)?%|\b\$\d+(\.\d+)?[km]?\b|\b\d+[kKxX]\b|\b\d+\+\b|\b[1-9]\d{1,3}\b/g) || [];
    const metricCount = metricMatches.length;
    if (metricCount === 0) {
      details.metrics = 15;
      tips.push({ text: "Include quantified impact (e.g. 'Improved efficiency by 25%', 'Handled 500+ users')", done: false });
    } else if (metricCount === 1) {
      details.metrics = 55;
    } else if (metricCount === 2) {
      details.metrics = 80;
    } else {
      details.metrics = 100;
    }

    // Power Verbs Score
    ATS_ACTION_VERBS.forEach(v => {
      if (allText.includes(v)) {
        if (!foundVerbs.includes(v)) foundVerbs.push(v);
      }
    });

    if (foundVerbs.length === 0) {
      details.verbs = 20;
      tips.push({ text: "Start bullet points with power action verbs (e.g. Spearheaded, Engineered, Optimized)", done: false });
    } else if (foundVerbs.length === 1) {
      details.verbs = 50;
    } else if (foundVerbs.length === 2) {
      details.verbs = 75;
    } else {
      details.verbs = 100;
    }

    // Section Completeness
    let filledSections = 0;
    if (p.fullName && p.email && p.phone) filledSections++;
    if (sumWords >= 15) filledSections++;
    if (techSkills.length >= 3) filledSections++;
    if (eduList.length > 0) filledSections++;
    if (expList.length > 0 || projList.length > 0) filledSections++;
    details.sections = Math.round((filledSections / 5) * 100);

    // Final score calculation
    const finalScore = Math.min(100, Math.max(0, score));

    return {
      score: finalScore,
      details: details,
      tips: tips.slice(0, 4), // Top 4 priority recommendations
      foundVerbs: foundVerbs
    };
  }

  function updateAtsScore() {
    const result = calculateAtsScore();
    const score = result.score;
    const details = result.details;
    const tips = result.tips;
    const foundVerbs = result.foundVerbs;

    // Header badge
    const headerBadge = document.getElementById("headerAtsBadge");
    if (headerBadge) {
      headerBadge.textContent = `${score}%`;
      if (score >= 80) {
        headerBadge.style.background = "#16a34a"; // Green
        headerBadge.style.color = "#ffffff";
      } else if (score >= 50) {
        headerBadge.style.background = "#d97706"; // Amber
        headerBadge.style.color = "#ffffff";
      } else {
        headerBadge.style.background = "#dc2626"; // Red
        headerBadge.style.color = "#ffffff";
      }
    }

    // Modal score number
    const modalScoreNum = document.getElementById("modalAtsScoreNum");
    if (modalScoreNum) {
      modalScoreNum.textContent = score;
      modalScoreNum.style.color = score >= 80 ? "#16a34a" : (score >= 50 ? "#d97706" : "#dc2626");
    }

    // Modal Status Header
    const modalStatusTitle = document.getElementById("modalAtsStatusTitle");
    const modalStatusDesc = document.getElementById("modalAtsStatusDesc");
    if (modalStatusTitle) {
      if (score >= 80) {
        modalStatusTitle.textContent = "ATS Ready & Verified! 🚀";
        modalStatusTitle.style.color = "#15803d";
      } else if (score >= 50) {
        modalStatusTitle.textContent = "Moderate ATS Match — Needs Optimization ⚡";
        modalStatusTitle.style.color = "#b45309";
      } else {
        modalStatusTitle.textContent = "Incomplete Profile — Low ATS Pass Rate ⚠️";
        modalStatusTitle.style.color = "#b91c1c";
      }
    }
    if (modalStatusDesc) {
      if (score >= 80) {
        modalStatusDesc.textContent = "Your resume structure adheres to standard parsing headings, recruiter keyword density, and metrics.";
      } else if (score >= 50) {
        modalStatusDesc.textContent = "Your resume is in good shape. Complete the remaining recommendations below to achieve top ranking.";
      } else {
        modalStatusDesc.textContent = "Several critical ATS sections and keywords are missing. Fill in the suggested fields to pass scanner audits.";
      }
    }

    // Update modal breakdown bars
    const formatText = document.getElementById("formatScoreText");
    const formatBar = document.getElementById("formatScoreBar");
    if (formatText && formatBar) {
      formatText.textContent = `${details.format}%`;
      formatBar.style.width = `${details.format}%`;
    }

    const metricText = document.getElementById("metricScoreText");
    const metricBar = document.getElementById("metricScoreBar");
    if (metricText && metricBar) {
      metricText.textContent = `${details.metrics}%`;
      metricBar.style.width = `${details.metrics}%`;
      metricBar.style.background = details.metrics >= 75 ? "#0284c7" : (details.metrics >= 40 ? "#d97706" : "#dc2626");
    }

    const verbText = document.getElementById("verbScoreText");
    const verbBar = document.getElementById("verbScoreBar");
    if (verbText && verbBar) {
      verbText.textContent = `${details.verbs}%`;
      verbBar.style.width = `${details.verbs}%`;
      verbBar.style.background = details.verbs >= 75 ? "#7c3aed" : (details.verbs >= 40 ? "#d97706" : "#dc2626");
    }

    const sectionText = document.getElementById("sectionScoreText");
    const sectionBar = document.getElementById("sectionScoreBar");
    if (sectionText && sectionBar) {
      sectionText.textContent = `${details.sections}%`;
      sectionBar.style.width = `${details.sections}%`;
      sectionBar.style.background = details.sections >= 80 ? "#16a34a" : (details.sections >= 50 ? "#d97706" : "#dc2626");
    }

    // Dynamic Recommendations / Tips List
    const tipsContainer = document.getElementById("atsDynamicTipsContainer");
    if (tipsContainer) {
      if (tips.length === 0) {
        tipsContainer.innerHTML = `
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:10px 14px;border-radius:8px;display:flex;align-items:center;gap:8px;font-size:12px;color:#166534;font-weight:600">
            <span>🎉</span>
            <span>All ATS optimization criteria met! Your resume is primed to beat applicant tracking bots.</span>
          </div>
        `;
      } else {
        tipsContainer.innerHTML = `
          <div style="background:#fffbeb;border:1px solid #fde68a;padding:12px 14px;border-radius:10px">
            <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:8px;display:flex;align-items:center;gap:6px">
              <span>⚡</span> <span>Real-Time Optimization Steps to Reach 100%:</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              ${tips.map(t => `
                <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:#78350f">
                  <span style="color:#d97706;font-size:13px">⚠️</span>
                  <span>${escape(t.text)}</span>
                </div>
              `).join("")}
            </div>
          </div>
        `;
      }
    }

    // Found Power Verbs
    const foundVerbsWrap = document.getElementById("atsFoundVerbsList");
    if (foundVerbsWrap) {
      if (foundVerbs.length > 0) {
        foundVerbsWrap.innerHTML = foundVerbs.map(v => `
          <span style="background:#e0e7ff;border:1px solid #c7d2fe;padding:2px 8px;border-radius:4px;color:#3730a3;font-weight:700;text-transform:capitalize">✓ ${escape(v)}</span>
        `).join("");
      } else {
        foundVerbsWrap.innerHTML = `<span style="color:#94a3b8;font-size:11.5px;font-style:italic">None detected yet. Try adding action verbs in experience/projects!</span>`;
      }
    }
  }

  function openAtsScoreModal() {
    const atsModal = document.getElementById("atsScoreModal");
    if (atsModal) {
      updateAtsScore();
      atsModal.setAttribute("aria-hidden", "false");
    }
  }

  // Update progress/completion estimation & Real-Time ATS Score
  function updateProgress() {
    if (progressFill && progressPct) {
      const total = 6; // fullName,headline,email,phone, at least one education, at least one skill
      let done = 0;
      if (state.personal?.fullName) done++;
      if (state.personal?.headline) done++;
      if (state.personal?.email) done++;
      if (state.personal?.phone) done++;
      if (state.education && state.education.length > 0) done++;
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
    updateAtsScore();
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
        if (state.current > 1) {
          state.current--;
          renderStep(state.current);
          saveState();
        }
      };
    }

    // Form Error Modal Listeners
    document.getElementById("closeFormError")?.addEventListener("click", closeFormErrorModal);
    document.getElementById("closeFormErrorBtn")?.addEventListener("click", closeFormErrorModal);
    document.getElementById("fillFormBtn")?.addEventListener("click", () => {
      closeFormErrorModal();
      state.current = 1;
      renderStep(1);
      saveState();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

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

    // Zoom Canvas controls (Resume4U Studio standard)
    let currentZoom = 100;
    const paperCanvasEl = document.getElementById("paperCanvas");
    const zoomLevelDisplay = document.getElementById("zoomLevelDisplay");
    
    function applyZoom(zoom) {
      currentZoom = Math.min(150, Math.max(50, zoom));
      if (paperCanvasEl) {
        paperCanvasEl.style.transform = `scale(${currentZoom / 100})`;
        paperCanvasEl.style.transformOrigin = "top center";
      }
      if (zoomLevelDisplay) {
        zoomLevelDisplay.textContent = `${currentZoom}%`;
      }
    }

    document.getElementById("zoomInBtn")?.addEventListener("click", () => applyZoom(currentZoom + 10));
    document.getElementById("zoomOutBtn")?.addEventListener("click", () => applyZoom(currentZoom - 10));
    function autoFitCanvas() {
      const isTablet = window.innerWidth >= 769 && window.innerWidth <= 1200;
      if (isTablet) {
        const studioWorkspace = document.querySelector(".studio-workspace");
        if (studioWorkspace) {
          const availableW = studioWorkspace.clientWidth - 36;
          const fitScale = Math.min(100, Math.max(45, Math.floor((availableW / 794) * 100)));
          applyZoom(fitScale);
        }
      }
    }

    document.getElementById("zoomFitBtn")?.addEventListener("click", () => {
      const studioWorkspace = document.querySelector(".studio-workspace");
      if (studioWorkspace) {
        const availableW = studioWorkspace.clientWidth - 36;
        const fitScale = Math.min(100, Math.max(45, Math.floor((availableW / 794) * 100)));
        applyZoom(fitScale);
      } else {
        applyZoom(100);
      }
    });

    // Auto-fit canvas on tablet on load and resize
    setTimeout(autoFitCanvas, 300);
    window.addEventListener("resize", debounce(autoFitCanvas, 150));

    // ATS Score Modal Handlers
    document.getElementById("checkAtsScoreBtn")?.addEventListener("click", openAtsScoreModal);
    document.getElementById("closeAtsModal")?.addEventListener("click", () => {
      document.getElementById("atsScoreModal")?.setAttribute("aria-hidden", "true");
    });
    document.getElementById("closeAtsModalBtn")?.addEventListener("click", () => {
      document.getElementById("atsScoreModal")?.setAttribute("aria-hidden", "true");
    });
    document.getElementById("atsModalExportBtn")?.addEventListener("click", (e) => {
      document.getElementById("atsScoreModal")?.setAttribute("aria-hidden", "true");
      exportPDF(e);
    });
    document.getElementById("headerExportPdf")?.addEventListener("click", (e) => {
      exportPDF(e);
    });

    // Template Color Swatches and Custom Color Picker Handlers
    document.addEventListener("click", (e) => {
      const swatchBtn = e.target.closest(".color-swatch-dot");
      if (swatchBtn) {
        const color = swatchBtn.dataset.color;
        if (color) {
          applyCustomColor(color);
        }
      }
    });

    const topColorPicker = document.getElementById("templateColorPicker");
    if (topColorPicker) {
      topColorPicker.addEventListener("input", (e) => {
        applyCustomColor(e.target.value);
      });
      topColorPicker.addEventListener("change", (e) => {
        applyCustomColor(e.target.value);
      });
    }

    document.getElementById("resetColorBtn")?.addEventListener("click", () => {
      resetCustomColor();
    });

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

    // ── 300+ COMPREHENSIVE DIVERSE RESUME TEMPLATES (Global Catalog) ──
    function createTemplateCardElement(t) {
      const a = document.createElement("a");
      a.href = `fresher.html?template=${t.id}`;
      a.className = "tmpl-card";
      a.setAttribute("data-category", t.category);
      a.setAttribute("data-tags", t.tags);

      let sheetContent = "";
      if (t.layout === "left-sidebar") {
        sheetContent = `
          <div class="tmpl-paper-sheet layout-left-sidebar" style="background:#ffffff">
            <div class="tmpl-mock-sidebar" style="background:${t.sidebarBg || t.primary}">
              <div class="tmpl-mock-avatar ${t.isPhoto ? 'photo' : ''}" style="border-color:#ffffff"></div>
              <div class="tmpl-mock-name" style="background:#ffffff;width:80%"></div>
              <div class="tmpl-mock-sub" style="background:rgba(255,255,255,0.7);width:60%"></div>
              <div class="tmpl-mock-chips" style="margin-top:4px">
                <div class="tmpl-mock-chip" style="background:rgba(255,255,255,0.3)"></div>
                <div class="tmpl-mock-chip" style="background:rgba(255,255,255,0.3)"></div>
              </div>
            </div>
            <div class="tmpl-mock-content">
              <div class="tmpl-mock-sec-title" style="background:${t.primary}"></div>
              <div class="tmpl-mock-card" style="border-left-color:${t.primary};background:#f8fafc">
                <div class="tmpl-mock-line full" style="height:5px;background:${t.primary}"></div>
                <div class="tmpl-mock-line med"></div>
              </div>
              <div class="tmpl-mock-sec-title" style="background:${t.secondary || t.primary};margin-top:4px"></div>
              <div class="tmpl-mock-line full"></div>
            </div>
          </div>
        `;
      } else if (t.layout === "centered") {
        sheetContent = `
          <div class="tmpl-paper-sheet layout-minimalist-centered" style="border-top:3px solid ${t.primary}">
            <div class="tmpl-mock-center-head" style="border-bottom-color:${t.primary}">
              <div class="tmpl-mock-name" style="background:${t.primary};width:65%;height:8px"></div>
              <div class="tmpl-mock-sub" style="background:${t.secondary || '#64748b'};width:45%"></div>
            </div>
            <div class="tmpl-mock-sec-row">
              <div class="tmpl-mock-sec-title" style="background:${t.primary};width:50%"></div>
              <div class="tmpl-mock-line full" style="height:4.5px;background:${t.secondary || '#64748b'}"></div>
              <div class="tmpl-mock-line med"></div>
            </div>
            <div class="tmpl-mock-sec-row">
              <div class="tmpl-mock-sec-title" style="background:${t.primary};width:40%"></div>
              <div class="tmpl-mock-line full"></div>
            </div>
          </div>
        `;
      } else if (t.layout === "executive") {
        sheetContent = `
          <div class="tmpl-paper-sheet layout-executive-frame" style="border-color:${t.primary}">
            <div style="border-bottom:2px solid ${t.primary};padding-bottom:4px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center">
              <div>
                <div class="tmpl-mock-name" style="background:${t.primary};width:75%;height:8px"></div>
                <div class="tmpl-mock-sub" style="background:${t.secondary || '#64748b'};width:50%"></div>
              </div>
              <div class="tmpl-mock-avatar sq" style="background:${t.primary}"></div>
            </div>
            <div class="tmpl-mock-body">
              <div class="tmpl-mock-col-main">
                <div class="tmpl-mock-sec-title" style="background:${t.primary}"></div>
                <div class="tmpl-mock-line full" style="height:5px;background:${t.primary}"></div>
                <div class="tmpl-mock-line med"></div>
              </div>
              <div class="tmpl-mock-col-side">
                <div class="tmpl-mock-sec-title" style="background:${t.secondary || '#94a3b8'}"></div>
                <div class="tmpl-mock-chips">
                  <div class="tmpl-mock-chip" style="background:#e2e8f0"></div>
                  <div class="tmpl-mock-chip" style="background:#e2e8f0"></div>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (t.layout === "timeline") {
        sheetContent = `
          <div class="tmpl-paper-sheet layout-timeline">
            <div class="tmpl-mock-head" style="background:${t.headBg || t.primary};padding:5px 8px">
              <div style="flex:1">
                <div class="tmpl-mock-name" style="width:65%"></div>
                <div class="tmpl-mock-sub" style="width:45%"></div>
              </div>
            </div>
            <div class="tmpl-timeline-rail">
              <div class="tmpl-timeline-node">
                <div class="tmpl-mock-line full" style="height:4.5px;background:${t.primary}"></div>
                <div class="tmpl-mock-line med"></div>
              </div>
              <div class="tmpl-timeline-node">
                <div class="tmpl-mock-line full" style="height:4.5px;background:${t.secondary || t.primary}"></div>
                <div class="tmpl-mock-line short"></div>
              </div>
            </div>
          </div>
        `;
      } else {
        sheetContent = `
          <div class="tmpl-paper-sheet" style="background:#ffffff">
            <div class="tmpl-mock-head" style="background:${t.headBg || t.primary}">
              <div style="flex:1">
                <div class="tmpl-mock-name" style="width:65%"></div>
                <div class="tmpl-mock-sub" style="width:45%"></div>
              </div>
              <div class="tmpl-mock-avatar ${t.isPhoto ? 'photo' : ''}"></div>
            </div>
            <div class="tmpl-mock-body">
              <div class="tmpl-mock-col-main">
                <div class="tmpl-mock-sec-title" style="background:${t.primary}"></div>
                <div class="tmpl-mock-card" style="border-left-color:${t.primary};background:#f8fafc">
                  <div class="tmpl-mock-line full" style="height:5px;background:${t.primary}"></div>
                  <div class="tmpl-mock-line med"></div>
                </div>
              </div>
              <div class="tmpl-mock-col-side">
                <div class="tmpl-mock-sec-title" style="background:${t.secondary || '#64748b'}"></div>
                <div class="tmpl-mock-chips">
                  <div class="tmpl-mock-chip" style="background:#e2e8f0"></div>
                  <div class="tmpl-mock-chip" style="background:#e2e8f0"></div>
                </div>
              </div>
            </div>
          </div>
        `;
      }

      a.innerHTML = `
        <div class="tmpl-preview-box">
          ${sheetContent}
          <span class="tmpl-badge">${t.badge}</span>
        </div>
        <div class="tmpl-info">
          <div class="tmpl-title">${t.title}</div>
          <div class="tmpl-tag">${t.tag}</div>
        </div>
      `;
      return a;
    }

    // Template Search & Category Filter handler for landing page
    const templatesGrid = document.querySelector(".templates-grid");
    if (templatesGrid) {
      // Clear and populate 320+ templates
      templatesGrid.innerHTML = "";
      ALL_320_TEMPLATES.forEach(t => {
        templatesGrid.appendChild(createTemplateCardElement(t));
      });
    }

    const templateSearch = document.getElementById("templateSearch");
    const filterPills = document.querySelectorAll(".filter-pills .pill:not(#morePillsToggleBtn), .more-pills-drawer .pill");
    const templateCards = document.querySelectorAll(".templates-grid .tmpl-card");
    const toggleTemplatesBtn = document.getElementById("toggleTemplatesBtn");
    const toggleWrap = document.querySelector(".show-more-templates-wrap");
    const morePillsToggleBtn = document.getElementById("morePillsToggleBtn");
    const morePillsDrawer = document.getElementById("morePillsDrawer");

    if (morePillsToggleBtn && morePillsDrawer) {
      morePillsToggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        morePillsDrawer.classList.toggle("open");
        const isOpen = morePillsDrawer.classList.contains("open");
        morePillsToggleBtn.textContent = isOpen ? "✕ Close" : "··· More";
      });
    }

    let activeCategory = "all";
    let searchQuery = "";
    let showAllTemplates = false;

    function getInitialRowLimit() {
      const width = window.innerWidth;
      if (width <= 1024) return 4;
      if (width <= 1240) return 6;
      return 8;
    }

    function applyTemplateFilters() {
      let visibleCount = 0;
      let staggeredIndex = 0;
      let matchIndex = 0;

      const isMobile = window.innerWidth <= 768;
      const isAllCategory = (activeCategory === "all" || activeCategory === "all templates") && !searchQuery;
      // On mobile responsive, strictly show at most 4 templates
      const maxLimit = isMobile ? 4 : ((isAllCategory && showAllTemplates) ? 9999 : 4);

      templateCards.forEach((card) => {
        const cardCat = (card.getAttribute("data-category") || "").toLowerCase().trim();
        const cardTags = (card.getAttribute("data-tags") || "").toLowerCase().trim();
        const title = (card.querySelector(".tmpl-title")?.textContent || "").toLowerCase();
        const tag = (card.querySelector(".tmpl-tag")?.textContent || "").toLowerCase();

        const catClean = activeCategory.replace(/resumes?$/i, '').trim();
        const catWords = catClean.split(/[\s&+/]+/).filter(w => w.length > 2 && w !== "and");
        const hasAllWords = catWords.length > 0 && catWords.every(w => 
          cardCat.includes(w) || cardTags.includes(w) || title.includes(w) || tag.includes(w)
        );

        const matchesCat = activeCategory === "all" || activeCategory === "all templates" ||
          cardCat === activeCategory || cardCat.includes(activeCategory) ||
          cardTags.includes(activeCategory) ||
          title.includes(activeCategory) || tag.includes(activeCategory) ||
          cardTags.includes(catClean) || hasAllWords;
        const matchesSearch = !searchQuery || title.includes(searchQuery) || tag.includes(searchQuery) || cardCat.includes(searchQuery) || cardTags.includes(searchQuery);

        if (matchesCat && matchesSearch) {
          if (matchIndex < maxLimit) {
            card.style.display = "flex";
            card.style.animation = "none";
            // Trigger reflow to restart CSS animation smoothly
            void card.offsetWidth;
            card.style.animation = `tmplCardPopIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${staggeredIndex * 0.05}s forwards`;
            staggeredIndex++;
            visibleCount++;
          } else {
            card.style.display = "none";
            card.style.animation = "none";
          }
          matchIndex++;
        } else {
          card.style.display = "none";
          card.style.animation = "none";
        }
      });

      // Update Explore All / Show Fewer button visibility & text
      if (toggleWrap && toggleTemplatesBtn) {
        if (!isMobile && isAllCategory && matchIndex > 4) {
          toggleWrap.style.display = "flex";
          toggleWrap.style.justifyContent = "center";
          toggleWrap.style.alignItems = "center";
          toggleWrap.style.textAlign = "center";
          toggleTemplatesBtn.textContent = showAllTemplates ? "Show Fewer Templates ↑" : "Explore All Templates ↓";
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

// Clean up and completely eradicate any mouse trail / star / geometric shapes / cursor elements
(function removeMouseEffects() {
  function purgeTrails() {
    const elements = document.querySelectorAll(
      "#mouseStarCanvas, #magneticCursorDot, #magneticCursorRing, #mouseFirefliesCanvas, #mouseCreativeTrailCanvas, canvas[id*='mouse'], canvas[class*='mouse'], canvas[id*='star'], canvas[class*='star'], canvas[id*='trail'], canvas[style*='999999'], .mouse-star, .mouse-trail, .sparkle, .star-particle"
    );
    elements.forEach(el => {
      try {
        el.style.display = "none";
        el.remove();
      } catch(e) {}
    });
  }
  purgeTrails();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", purgeTrails);
  }
  window.addEventListener("load", purgeTrails);
  setInterval(purgeTrails, 1000);
})();

/* ---------- Global Professional Constellation Screensaver (60s Inactivity) ---------- */
(function initProfessionalScreensaver() {
  const IDLE_TIMEOUT_MS = 60000; // Exactly 60 seconds of inactivity
  let idleTimer = null;
  let clockInterval = null;
  let typewriterTimeout = null;
  let animFrameId = null;

  const quotes = [
    '"The secret of getting ahead is getting started." — Mark Twain',
    '"Your work is going to fill a large part of your life, and the only way to be satisfied is to do great work." — Steve Jobs',
    '"Opportunities don\'t happen, you create them." — Chris Grosser',
    '"Success is not final, failure is not fatal: It is the courage to continue that counts." — Winston Churchill',
    '"The future belongs to those who believe in the beauty of their dreams." — Eleanor Roosevelt',
    '"Failure is simply the opportunity to begin again, this time more intelligently." — Henry Ford',
    '"Believe you can and you\'re halfway there." — Theodore Roosevelt',
    '"Strive not to be a success, but rather to be of value." — Albert Einstein'
  ];

  let currentQuoteIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function ensureScreensaverMarkup() {
    let overlay = document.getElementById("screensaverOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "screensaverOverlay";
      overlay.className = "screensaver-overlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-label", "Idle Screensaver");
      overlay.innerHTML = `
        <canvas id="screensaverCanvas" class="screensaver-canvas"></canvas>
        <div class="screensaver-ambient-glow"></div>
        <div class="screensaver-content">

          <div id="screensaverClock" class="screensaver-clock">12:00:00 PM</div>
          <div id="screensaverDate" class="screensaver-date">Wednesday, August 12, 2026</div>

          <!-- USER COUNTRY LOCAL TIME BADGE -->
          <div class="screensaver-user-location-badge" id="ssUserLocationBadge">
            <span class="user-loc-pill">
              <span class="user-loc-icon"><span class="green-live-dot"></span> YOUR LOCAL TIME:</span>
              <span class="wc-flag-img-wrap"><img id="ssUserFlagImg" src="https://flagcdn.com/w40/in.png" srcset="https://flagcdn.com/w80/in.png 2x" width="18" height="13" alt="User Country Flag" class="wc-flag-img"></span>
              <span id="ssUserCountryText" class="user-loc-country">Detecting location...</span>
              <span id="ssUserLiveTime" class="user-loc-time">--:--:--</span>
            </span>
          </div>
          
          <!-- LIVE WORLD CLOCK GRID -->
          <div class="screensaver-world-clock" id="screensaverWorldClock">
            <div class="world-clock-grid">
              <div class="wc-card" id="wcCardNY">
                <div class="wc-header"><span class="wc-flag-img-wrap"><img src="https://flagcdn.com/w40/us.png" srcset="https://flagcdn.com/w80/us.png 2x" width="20" height="15" alt="USA Flag" class="wc-flag-img"></span><span class="wc-city">New York</span></div>
                <div class="wc-time" id="wcTimeNY">--:--:--</div>
                <div class="wc-meta"><span class="wc-tz">EDT</span> <span class="wc-sun" id="wcSunNY">☀️</span></div>
              </div>
              <div class="wc-card" id="wcCardLDN">
                <div class="wc-header"><span class="wc-flag-img-wrap"><img src="https://flagcdn.com/w40/gb.png" srcset="https://flagcdn.com/w80/gb.png 2x" width="20" height="15" alt="UK Flag" class="wc-flag-img"></span><span class="wc-city">London</span></div>
                <div class="wc-time" id="wcTimeLDN">--:--:--</div>
                <div class="wc-meta"><span class="wc-tz">BST</span> <span class="wc-sun" id="wcSunLDN">☀️</span></div>
              </div>
              <div class="wc-card" id="wcCardDEL">
                <div class="wc-header"><span class="wc-flag-img-wrap"><img src="https://flagcdn.com/w40/in.png" srcset="https://flagcdn.com/w80/in.png 2x" width="20" height="15" alt="India Flag" class="wc-flag-img"></span><span class="wc-city">New Delhi</span></div>
                <div class="wc-time" id="wcTimeDEL">--:--:--</div>
                <div class="wc-meta"><span class="wc-tz">IST</span> <span class="wc-sun" id="wcSunDEL">☀️</span></div>
              </div>
              <div class="wc-card" id="wcCardDXB">
                <div class="wc-header"><span class="wc-flag-img-wrap"><img src="https://flagcdn.com/w40/ae.png" srcset="https://flagcdn.com/w80/ae.png 2x" width="20" height="15" alt="UAE Flag" class="wc-flag-img"></span><span class="wc-city">Dubai</span></div>
                <div class="wc-time" id="wcTimeDXB">--:--:--</div>
                <div class="wc-meta"><span class="wc-tz">GST</span> <span class="wc-sun" id="wcSunDXB">☀️</span></div>
              </div>
              <div class="wc-card" id="wcCardTYO">
                <div class="wc-header"><span class="wc-flag-img-wrap"><img src="https://flagcdn.com/w40/jp.png" srcset="https://flagcdn.com/w80/jp.png 2x" width="20" height="15" alt="Japan Flag" class="wc-flag-img"></span><span class="wc-city">Tokyo</span></div>
                <div class="wc-time" id="wcTimeTYO">--:--:--</div>
                <div class="wc-meta"><span class="wc-tz">JST</span> <span class="wc-sun" id="wcSunTYO">🌙</span></div>
              </div>
              <div class="wc-card" id="wcCardSYD">
                <div class="wc-header"><span class="wc-flag-img-wrap"><img src="https://flagcdn.com/w40/au.png" srcset="https://flagcdn.com/w80/au.png 2x" width="20" height="15" alt="Australia Flag" class="wc-flag-img"></span><span class="wc-city">Sydney</span></div>
                <div class="wc-time" id="wcTimeSYD">--:--:--</div>
                <div class="wc-meta"><span class="wc-tz">AEST</span> <span class="wc-sun" id="wcSunSYD">🌙</span></div>
              </div>
            </div>
          </div>

          <div class="screensaver-quote-box">
            <div class="quote-box-header">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
              <span class="terminal-title">career_wisdom.sh</span>
            </div>
            <p id="screensaverTypedQuote" class="screensaver-typed-quote"></p><span class="typed-cursor">|</span>
          </div>
          <div class="screensaver-wake-hint">
            <span class="pulse-ring"></span> Move mouse or press any key to resume editing
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  function startCanvasConstellation() {
    const canvas = document.getElementById("screensaverCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 17000), 85);
    const particleColors = ["#6366f1", "#e60023", "#10b981", "#22c55e", "#34d399"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.3 + 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)]
      });
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            const isGreen = particles[i].color.includes("10b9") || particles[j].color.includes("10b9") || particles[i].color.includes("22c5");
            const strokeColor = isGreen
              ? `rgba(16, 185, 129, ${0.22 * (1 - dist / 140)})`
              : `rgba(99, 102, 241, ${0.18 * (1 - dist / 140)})`;

            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }

  function stopCanvasConstellation() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function detectUserLocation() {
    let userTz = "Asia/Kolkata";
    try {
      userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
    } catch (e) {}

    const parts = userTz.split("/");
    const cityName = (parts[parts.length - 1] || "Local").replace(/_/g, " ");

    let countryCode = "in";
    let countryName = "India";
    const tzLower = userTz.toLowerCase();

    if (tzLower.includes("kolkata") || tzLower.includes("calcutta") || tzLower.includes("india")) {
      countryCode = "in"; countryName = "India";
    } else if (tzLower.includes("dhaka") || tzLower.includes("bangladesh")) {
      countryCode = "bd"; countryName = "Bangladesh";
    } else if (tzLower.includes("new_york") || tzLower.includes("chicago") || tzLower.includes("los_angeles") || tzLower.includes("america")) {
      countryCode = "us"; countryName = "United States";
    } else if (tzLower.includes("london") || tzLower.includes("gb") || tzLower.includes("uk")) {
      countryCode = "gb"; countryName = "United Kingdom";
    } else if (tzLower.includes("dubai") || tzLower.includes("uae")) {
      countryCode = "ae"; countryName = "UAE";
    } else if (tzLower.includes("tokyo") || tzLower.includes("japan")) {
      countryCode = "jp"; countryName = "Japan";
    } else if (tzLower.includes("sydney") || tzLower.includes("australia") || tzLower.includes("melbourne")) {
      countryCode = "au"; countryName = "Australia";
    } else if (tzLower.includes("paris") || tzLower.includes("france")) {
      countryCode = "fr"; countryName = "France";
    } else if (tzLower.includes("berlin") || tzLower.includes("germany")) {
      countryCode = "de"; countryName = "Germany";
    } else if (tzLower.includes("singapore")) {
      countryCode = "sg"; countryName = "Singapore";
    } else if (tzLower.includes("toronto") || tzLower.includes("vancouver") || tzLower.includes("canada")) {
      countryCode = "ca"; countryName = "Canada";
    }

    return { userTz, cityName, countryCode, countryName };
  }

  const WORLD_CITIES = [
    { id: "NY", tz: "America/New_York" },
    { id: "LDN", tz: "Europe/London" },
    { id: "DEL", tz: "Asia/Kolkata" },
    { id: "DXB", tz: "Asia/Dubai" },
    { id: "TYO", tz: "Asia/Tokyo" },
    { id: "SYD", tz: "Australia/Sydney" }
  ];

  let highlightedUserCard = false;

  function updateClock() {
    const clockEl = document.getElementById("screensaverClock");
    const dateEl = document.getElementById("screensaverDate");
    const now = new Date();

    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    }

    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }

    // Update User Location Badge dynamically
    const userLoc = detectUserLocation();
    const userTimeEl = document.getElementById("ssUserLiveTime");
    const userCountryEl = document.getElementById("ssUserCountryText");
    const userFlagImg = document.getElementById("ssUserFlagImg");

    if (userTimeEl) {
      userTimeEl.textContent = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    }

    if (userCountryEl) {
      userCountryEl.textContent = `${userLoc.countryName} (${userLoc.cityName})`;
    }

    if (userFlagImg && !userFlagImg.src.includes(userLoc.countryCode)) {
      userFlagImg.src = `https://flagcdn.com/w40/${userLoc.countryCode}.png`;
      userFlagImg.srcset = `https://flagcdn.com/w80/${userLoc.countryCode}.png 2x`;
    }

    // Update Live World Clock for all 6 global cities & highlight user matching city card
    WORLD_CITIES.forEach((city) => {
      const timeEl = document.getElementById(`wcTime${city.id}`);
      const sunEl = document.getElementById(`wcSun${city.id}`);
      const cardEl = document.getElementById(`wcCard${city.id}`);

      if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString("en-US", {
          timeZone: city.tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        });

        // Determine Sun/Moon based on city's 24h local hour
        try {
          const cityHourStr = now.toLocaleTimeString("en-US", { timeZone: city.tz, hour: "numeric", hour12: false });
          const cityHour = parseInt(cityHourStr, 10);
          if (sunEl && !isNaN(cityHour)) {
            sunEl.textContent = (cityHour >= 6 && cityHour < 18) ? "☀️" : "🌙";
          }
        } catch (e) {}

        // Highlight matching user location card
        if (cardEl && !highlightedUserCard) {
          if (userLoc.userTz.toLowerCase().includes(city.tz.toLowerCase().split("/")[1])) {
            cardEl.classList.add("user-location-highlight");
            const header = cardEl.querySelector(".wc-header");
            if (header && !header.querySelector(".wc-user-tag")) {
              const tag = document.createElement("span");
              tag.className = "wc-user-tag";
              tag.textContent = "📍 YOUR TIME";
              header.appendChild(tag);
            }
          }
        }
      }
    });

    highlightedUserCard = true;
  }

  function typeQuote() {
    const quoteEl = document.getElementById("screensaverTypedQuote");
    if (!quoteEl) return;

    const fullQuote = quotes[currentQuoteIndex];

    if (isDeleting) {
      charIndex--;
      quoteEl.textContent = fullQuote.substring(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        typewriterTimeout = setTimeout(typeQuote, 500);
        return;
      }
      typewriterTimeout = setTimeout(typeQuote, 20);
    } else {
      charIndex++;
      quoteEl.textContent = fullQuote.substring(0, charIndex);
      if (charIndex === fullQuote.length) {
        isDeleting = true;
        typewriterTimeout = setTimeout(typeQuote, 3500);
        return;
      }
      typewriterTimeout = setTimeout(typeQuote, 45);
    }
  }

  function showScreensaver() {
    const overlay = ensureScreensaverMarkup();
    updateClock();

    if (!clockInterval) {
      clockInterval = setInterval(updateClock, 1000);
    }

    startCanvasConstellation();

    charIndex = 0;
    isDeleting = false;
    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    typeQuote();

    overlay.setAttribute("aria-hidden", "false");
  }

  function hideScreensaver() {
    const overlay = document.getElementById("screensaverOverlay");
    if (overlay && overlay.getAttribute("aria-hidden") === "false") {
      overlay.setAttribute("aria-hidden", "true");
    }

    stopCanvasConstellation();

    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }

    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      typewriterTimeout = null;
    }

    resetIdleTimer();
  }

  function resetIdleTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(showScreensaver, IDLE_TIMEOUT_MS);
  }

  let lastMouseX = -1;
  let lastMouseY = -1;

  function handleUserActivity(e) {
    if (e && e.type === "mousemove") {
      if (lastMouseX !== -1 && Math.abs(e.clientX - lastMouseX) < 5 && Math.abs(e.clientY - lastMouseY) < 5) {
        return; // Ignore micro jitter
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }

    const overlay = document.getElementById("screensaverOverlay");
    if (overlay && overlay.getAttribute("aria-hidden") === "false") {
      hideScreensaver();
    } else {
      resetIdleTimer();
    }
  }

  const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "pointerdown", "scroll"];
  activityEvents.forEach((evtName) => {
    window.addEventListener(evtName, handleUserActivity, { passive: true });
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", resetIdleTimer);
  } else {
    resetIdleTimer();
  }
})();


// ── ABOUT FEATURE CAROUSEL CONTROLLER ──────────────────────
(function () {
  function initFeatureCarousel() {
    var track = document.getElementById("aboutCarouselTrack");
    var container = document.getElementById("aboutCarouselContainer");
    var prevBtn = document.getElementById("aboutCarouselPrev");
    var nextBtn = document.getElementById("aboutCarouselNext");
    var dotsContainer = document.getElementById("aboutCarouselDots");

    if (!track || !container || !prevBtn || !nextBtn) return;

    var slides = track.querySelectorAll(".carousel-slide");
    if (!slides.length) return;

    var currentIndex = 0;
    var autoPlayTimer = null;

    function getVisibleCount() {
      var width = window.innerWidth;
      if (width <= 520) return 1;
      if (width <= 768) return 2;
      if (width <= 1100) return 3;
      return 4;
    }

    function getMaxIndex() {
      var visible = getVisibleCount();
      return Math.max(0, slides.length - visible);
    }

    function updateDots() {
      if (!dotsContainer) return;
      var maxIdx = getMaxIndex();
      dotsContainer.innerHTML = "";

      for (var i = 0; i <= maxIdx; i++) {
        (function (index) {
          var dot = document.createElement("button");
          dot.className = "carousel-dot" + (index === currentIndex ? " active" : "");
          dot.setAttribute("aria-label", "Go to slide " + (index + 1));
          dot.addEventListener("click", function () {
            goToSlide(index);
            restartAutoPlay();
          });
          dotsContainer.appendChild(dot);
        })(i);
      }
    }

    function goToSlide(index) {
      var maxIdx = getMaxIndex();
      if (index < 0) index = maxIdx;
      if (index > maxIdx) index = 0;

      currentIndex = index;

      var firstSlide = slides[0];
      var slideWidth = firstSlide ? firstSlide.offsetWidth + 24 : 300;
      track.style.transform = "translateX(" + (-currentIndex * slideWidth) + "px)";

      updateDots();
    }

    prevBtn.addEventListener("click", function () {
      goToSlide(currentIndex - 1);
      restartAutoPlay();
    });

    nextBtn.addEventListener("click", function () {
      goToSlide(currentIndex + 1);
      restartAutoPlay();
    });

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(function () {
        goToSlide(currentIndex + 1);
      }, 4500);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    function restartAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    // Pause auto-play on hover
    container.addEventListener("mouseenter", stopAutoPlay);
    container.addEventListener("mouseleave", startAutoPlay);

    // Touch/swipe support
    var startX = 0;
    var currentX = 0;
    var isSwiping = false;

    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      currentX = startX;
      isSwiping = true;
      stopAutoPlay();
    }, { passive: true });

    track.addEventListener("touchmove", function (e) {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", function () {
      if (!isSwiping) return;
      var diffX = startX - currentX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
      isSwiping = false;
      startAutoPlay();
    });

    window.addEventListener("resize", function () {
      goToSlide(Math.min(currentIndex, getMaxIndex()));
    });

    goToSlide(0);
    startAutoPlay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFeatureCarousel);
  } else {
    initFeatureCarousel();
  }
})();
