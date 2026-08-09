
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

// Animate visible elements on scroll
var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".fade-up").forEach(function (el) {
  observer.observe(el);
});

// Back-to-top button behavior
(function () {
  var backBtn = document.getElementById("backToTop");
  if (!backBtn) return;

  function toggleBack() {
    if (window.scrollY > 300) {
      backBtn.classList.add("visible");
    } else {
      backBtn.classList.remove("visible");
    }
  }

  // show/hide on scroll
  window.addEventListener("scroll", toggleBack, { passive: true });
  // init state
  toggleBack();

  backBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    backBtn.blur();
  });

  // keyboard accessibility: Enter/Space on button already works; also support Home key
  window.addEventListener("keydown", function (e) {
    if (e.key === "Home") window.scrollTo({ top: 0, behavior: "smooth" });
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
  const stepsMeta = [
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
    renderSidebar();
    mainCard.innerHTML = ""; // clear
    const meta = stepsMeta.find((s) => s.id === step);
    const header = createHeader(meta.title);
    const content = document.createElement("div");
    content.className = "card-body";
    // inject step-specific form
    switch (step) {
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
    wrapper.innerHTML = `<div class="list" id="expList"></div><div style="margin-top:12px" class="actions"><button id="addExp" class="btn neutral">+ Add Experience</button><div style="flex:1"></div><button id="saveExp" class="btn bg-success text-white">Save</button><button id="toNext5" class="btn primary">Next</button></div>`;
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
    wrapper.innerHTML = `<div class="list" id="achList"></div><div style="margin-top:12px" class="actions"><button id="addAch" class="btn neutral">+ Add Achievement</button><div style="flex:1"></div><button id="saveAch" class="btn bg-success text-white">Save</button><button id="toNext6" class="btn primary">Next</button></div>`;
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
    wrapper.innerHTML = `<div style="margin-bottom:12px"><strong>Preview</strong></div><div style="border:1px solid rgba(15,23,42,0.04);padding:12px;border-radius:12px;background:linear-gradient(180deg,var(--card),transparent)">${resumeHtml}</div>
      <div class="actions"><button id="editResume" class="btn neutral">Edit</button><button id="downloadPdf" class="btn neutral">Download PDF</button><button id="saveFinal" class="btn primary">Save Resume</button></div>`;
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
    const tech = (state.skills?.technical || []).join(", ");
    const soft = (state.skills?.soft || []).join(", ");
    const lang = (state.skills?.languages || []).join(", ");
    const cert = (state.skills?.certifications || []).join(", ");

    const nameText = p.fullName || "Alex Morgan";
    const headlineText = p.headline || "Computer Science Graduate & Software Developer";
    const emailText = p.email || "alex.morgan@email.com";
    const phoneText = p.phone || "+1 (555) 019-2834";
    const addressText = p.address || "San Francisco, CA";

    const summaryText = state.summary?.text || "Motivated Computer Science graduate with hands-on experience in full-stack web application development, algorithms, and responsive UI design. Eager to contribute to innovative software engineering projects.";

    const expList = (state.experience && state.experience.length > 0) ? state.experience : [
      { title: "Software Engineer Intern", company: "TechCorp Labs", start: "2023-06", end: "2023-09", responsibilities: "Developed responsive web features using JavaScript and REST APIs. Improved web performance and component reusability." }
    ];

    const projList = (state.projects && state.projects.length > 0) ? state.projects : [
      { name: "ResumeAI Builder Studio", tech: "JavaScript, HTML5, CSS3", description: "Built an interactive ATS-friendly resume builder with live A4 canvas preview and localStorage persistence." }
    ];

    const eduList = (state.education && state.education.length > 0) ? state.education : [
      { degree: "B.S. in Computer Science", institution: "State University", start: "2020-09", end: "2024-05" }
    ];

    const skillsParts = [];
    skillsParts.push(`<div style="margin-bottom:6px"><strong>Technical:</strong> ${escape(tech || "JavaScript, React, HTML5, CSS3, Git, SQL")}</div>`);
    if (soft) skillsParts.push(`<div style="margin-bottom:6px"><strong>Soft Skills:</strong> ${escape(soft)}</div>`);
    if (lang) skillsParts.push(`<div style="margin-bottom:6px"><strong>Languages:</strong> ${escape(lang)}</div>`);
    if (cert) skillsParts.push(`<div style="margin-bottom:6px"><strong>Certifications:</strong> ${escape(cert)}</div>`);

    return `<div style="font-family:'Inter', sans-serif; color:#0e131f; line-height:1.5;">
      <!-- Header Banner -->
      <div style="background: linear-gradient(135deg, #00c4cc 0%, #7d2ae8 100%); padding: 28px; border-radius: 12px; color: #ffffff; display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h1 style="font-family:'Outfit', sans-serif; margin: 0 0 4px; font-size: 30px; font-weight: 800; letter-spacing: -0.02em;">${escape(nameText)}</h1>
          <div style="font-size: 15px; font-weight: 600; opacity: 0.95;">${escape(headlineText)}</div>
        </div>
        ${p.photo ? `<img src="${p.photo}" style="width: 76px; height: 76px; border-radius: 50%; object-fit: cover; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.15)">` : ""}
      </div>

      <!-- Contact Bar -->
      <div style="display: flex; flex-wrap: wrap; gap: 16px; font-size: 13px; color: #475569; padding-bottom: 16px; border-bottom: 2px solid #f1f5f9; margin-bottom: 24px;">
        <span>📧 ${escape(emailText)}</span>
        <span>📞 ${escape(phoneText)}</span>
        <span>📍 ${escape(addressText)}</span>
        ${p.linkedin ? `<span>🔗 <a href="${escape(p.linkedin)}" target="_blank" style="color:#7d2ae8;text-decoration:none">LinkedIn</a></span>` : ""}
        ${p.portfolio ? `<span>🌐 <a href="${escape(p.portfolio)}" target="_blank" style="color:#7d2ae8;text-decoration:none">Portfolio</a></span>` : ""}
      </div>

      <!-- Main Layout Body -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
        <!-- Left Main Column -->
        <div>
          <div style="margin-bottom: 24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #7d2ae8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid rgba(125,42,232,0.15); padding-bottom: 4px; margin-bottom: 10px;">Professional Summary</h3>
            <p style="font-size: 13.5px; color: #334155; margin: 0; line-height: 1.6;">${escape(summaryText)}</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #7d2ae8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid rgba(125,42,232,0.15); padding-bottom: 4px; margin-bottom: 12px;">Experience</h3>
            ${expList.map((x) => `
              <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <strong style="font-size: 14.5px; color: #0e131f;">${escape(x.title || "")} @ ${escape(x.company || "")}</strong>
                  <span style="font-size: 12px; color: #64748b;">${escape(x.start || "")} - ${escape(x.end || "Present")}</span>
                </div>
                <div style="font-size: 13px; color: #475569; margin-top: 4px;">${escape(x.responsibilities || "")}</div>
              </div>
            `).join("")}
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #7d2ae8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid rgba(125,42,232,0.15); padding-bottom: 4px; margin-bottom: 12px;">Key Projects</h3>
            ${projList.map((proj) => `
              <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <strong style="font-size: 14.5px; color: #0e131f;">${escape(proj.name || "")}</strong>
                  <span style="font-size: 12px; color: #7d2ae8; font-weight: 600;">${escape(proj.tech || "")}</span>
                </div>
                <div style="font-size: 13px; color: #475569; margin-top: 4px;">${escape(proj.description || "")}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Right Side Column -->
        <div>
          <div style="margin-bottom: 24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #7d2ae8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid rgba(125,42,232,0.15); padding-bottom: 4px; margin-bottom: 12px;">Skills</h3>
            <div style="font-size: 13px; color: #334155;">
              ${skillsParts.join("")}
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #7d2ae8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid rgba(125,42,232,0.15); padding-bottom: 4px; margin-bottom: 12px;">Education</h3>
            ${eduList.map((edu) => `
              <div style="margin-bottom: 12px;">
                <strong style="font-size: 14px; color: #0e131f; display: block;">${escape(edu.degree || "")}</strong>
                <div style="font-size: 12.5px; color: #64748b;">${escape(edu.institution || "")}</div>
                <div style="font-size: 12px; color: #94a3b8;">${escape(edu.start || "")} - ${escape(edu.end || "")}</div>
              </div>
            `).join("")}
          </div>

          ${state.achievements?.length ? `
            <div style="margin-bottom: 24px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size: 16px; font-weight: 800; color: #7d2ae8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid rgba(125,42,232,0.15); padding-bottom: 4px; margin-bottom: 12px;">Achievements</h3>
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

  // Export PDF by opening new window and calling print
  function exportPDF() {
    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Resume</title><style>body{font-family:Inter,Arial;margin:28px;color:#111827}.small{color:#6b7280}</style></head><body>${buildResumeHtml()}</body></html>`;
    const w = window.open("", "_blank");
    w.document.write(html);
    w.document.close();
    setTimeout(() => {
      w.print();
    }, 600);
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
  const buttons = Array.from(stepsNav.querySelectorAll(".step"));
  buttons.forEach((btn) => {
    btn.classList.remove("completed", "active");
  });
  state.current = 1;
  renderSidebar();
  progressFill.style.width = "0%";
  progressPct.textContent = "0%";
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
    document.getElementById("nextBtn").onclick = () => {
      if (state.current < stepsMeta.length) {
        state.current++;
        renderStep(state.current);
        saveState();
      }
    };
    document.getElementById("prevBtn").onclick = () => {
      if (state.current > 1) {
        state.current--;
        renderStep(state.current);
        saveState();
      }
    };

    // preview modal
    previewBtn.onclick = () => {
      modal.setAttribute("aria-hidden", "false");
      modalBody.innerHTML = buildResumeHtml();
    };
    document
      .getElementById("closeModal")
      ?.addEventListener("click", () =>
        modal.setAttribute("aria-hidden", "true"),
      );
    document
      .getElementById("modalClose")
      ?.addEventListener("click", () =>
        modal.setAttribute("aria-hidden", "true"),
      );

    // save draft
    saveDraftBtn.onclick = () => {
      saveState();
      alert("Draft saved locally");
    };

    // export and save from preview panel
    exportPdfBtn.onclick = exportPDF;
    saveResumeBtn.onclick = () => {
      saveState();
      alert("Resume saved");
    };

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
        if (state.current < stepsMeta.length) {
          state.current++;
          renderStep(state.current);
          saveState();
        }
      }
      if (e.key === "ArrowLeft") {
        if (state.current > 1) {
          state.current--;
          renderStep(state.current);
          saveState();
        }
      }
    });
  }

  // Start
  init();
})();
