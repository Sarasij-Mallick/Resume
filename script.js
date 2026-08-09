
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
    } catch (e) {
      console.warn("Load state failed", e);
    }
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

  // Sidebar render and click wiring
  function renderSidebar() {
    const buttons = Array.from(stepsNav.querySelectorAll(".step"));
    buttons.forEach((btn) => {
      const step = Number(btn.dataset.step);
      btn.classList.toggle("active", step === state.current);
      btn.classList.toggle("completed", step < state.current);
      btn.onclick = () => {
        state.current = step;
        renderStep(step);
        saveState();
      };
    });
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
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `
      <div class="list" id="eduList"></div>
      <div style="margin-top:10px" class="actions"><button id="addEdu" class="btn neutral">Add Education</button><div style="flex:1"></div></div>
    `;
    const eduList = wrapper.querySelector("#eduList");
    function refresh() {
      eduList.innerHTML = "";
      state.education.forEach((e, idx) => {
        const el = document.createElement("div");
        el.className = "entry";
        el.innerHTML = `
          <div class="entry-head"><strong>${escape(e.degree || "Degree")}</strong><div><button class="btn neutral" data-idx="${idx}" data-act="edit">Edit</button><button class="btn" data-idx="${idx}" data-act="remove">Remove</button></div></div>
          <div class="small muted">${escape(e.institution || "Institution")} • ${escape(e.start || "")} - ${escape(e.end || "")}</div>
          <div style="margin-top:8px">${escape(e.description || "")}</div>
        `;
        eduList.appendChild(el);
      });
      // if none, show hint
      if (state.education.length === 0) {
        eduList.innerHTML = `<div class="small muted">No education entries yet. Click "Add Education".</div>`;
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
      saveState();
      renderEducationEditor(state.education.length - 1, refresh);
    });

    // delegate edit/remove
    eduList.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      const act = btn.dataset.act;
      if (act === "remove") {
        if (confirm("Remove entry?")) {
          state.education.splice(idx, 1);
          saveState();
          renderStep(2);
        }
      }
      if (act === "edit") renderEducationEditor(idx, refresh);
    });

    return wrapper;
  }

  function renderEducationEditor(index, onDone) {
    const data = state.education[index];
    const modalHtml = document.createElement("div");
    modalHtml.className = "modal";
    modalHtml.setAttribute("aria-hidden", "false");
    modalHtml.innerHTML = `<div class="modal-panel"><header><h3>Edit Education</h3></header><div style="padding:12px">
      <div class="form-row"><div class="field"><label>Degree</label><input class="form-control" id="e_degree" value="${escape(data.degree || "")}"/></div>
      <div class="field"><label>Institution</label><input class="form-control" id="e_institution" value="${escape(data.institution || "")}"/></div></div>
      <div class="form-row"><div class="field"><label>Field of study</label><input class="form-control" id="e_field" value="${escape(data.field || "")}"/></div><div class="field"><label>GPA</label><input class="form-control" id="e_gpa" value="${escape(data.gpa || "")}"/></div></div>
      <div class="form-row"><div class="field"><label>Start</label><input class="form-control" id="e_start" type="month" value="${escape(data.start || "")}"/></div><div class="field"><label>End</label><input class="form-control" id="e_end" type="month" value="${escape(data.end || "")}"/></div></div>
      <div class="field"><label>Description</label><textarea class="form-control" id="e_desc">${escape(data.description || "")}</textarea></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px"><button id="e_cancel" class="btn neutral">Cancel</button><button id="e_save" class="btn primary">Save</button></div>
      </div></div>`;
    document.body.appendChild(modalHtml);
    modalHtml.querySelector("#e_cancel").onclick = () => {
      modalHtml.remove();
    };
    modalHtml.querySelector("#e_save").onclick = () => {
      data.degree = modalHtml.querySelector("#e_degree").value;
      data.institution = modalHtml.querySelector("#e_institution").value;
      data.field = modalHtml.querySelector("#e_field").value;
      data.gpa = modalHtml.querySelector("#e_gpa").value;
      data.start = modalHtml.querySelector("#e_start").value;
      data.end = modalHtml.querySelector("#e_end").value;
      data.description = modalHtml.querySelector("#e_desc").value;
      saveState();
      modalHtml.remove();
      if (onDone) onDone();
      renderStep(2);
    };
  }

  // 3. Skills
 function renderSkills() {
  const wrapper = document.createElement("div");
  wrapper.className = "form";
  wrapper.innerHTML = `
    <div class="field"><label>Technical Skills</label><div id="techWrap" class="list"></div><div style="margin-top:8px"><input class="form-control" id="newTech" placeholder="Add a technical skill and press Enter"/></div></div>
    <div class="field"><label>Soft Skills</label><div id="softWrap" class="list"></div><div style="margin-top:8px"><input class="form-control" id="newSoft" placeholder="Add a soft skill and press Enter"/></div></div>
    <div class="field"><label>Languages</label><div id="langWrap" class="list"></div><div style="margin-top:8px"><input class="form-control" id="newLang" placeholder="Add a language and press Enter"/></div></div>
    <div class="field"><label>Certifications</label><div id="certWrap" class="list"></div><div style="margin-top:8px"><input class="form-control" id="newCert" placeholder="Add a certification and press Enter"/></div></div>
    <div class="actions"><div style="flex:1"></div><button id="saveSkills" class="btn bg-success text-white">Save</button><button id="toNext3" class="btn primary">Next</button></div>
  `;

  const techWrap = wrapper.querySelector("#techWrap");
  const softWrap = wrapper.querySelector("#softWrap");
  const langWrap = wrapper.querySelector("#langWrap");
  const certWrap = wrapper.querySelector("#certWrap");

  // Safeguard array structures to prevent undefined mutations
  if (!state.skills) state.skills = {};
  if (!Array.isArray(state.skills.technical)) state.skills.technical = [];
  if (!Array.isArray(state.skills.soft)) state.skills.soft = [];
  if (!Array.isArray(state.skills.languages)) state.skills.languages = [];
  if (!Array.isArray(state.skills.certifications)) state.skills.certifications = [];

  // Core array listing rendering engine
  function renderList(arr, el) {
    el.innerHTML = "";
    arr.forEach((v, i) => {
      const item = document.createElement("div");
      item.className = "entry mb-1 p-1 d-flex justify-content-between align-items-center";
      // Safe string escaping boundary management
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

  // --- Core Mutation Fix: Real-Time Dynamic Array Input Binding ---
  function handleAddSkill(inputId, storageArray, elementWrap) {
    const input = wrapper.querySelector(`#${inputId}`);
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // Intercept and block sudden native form postbacks
          const value = input.value.trim();
          if (value) {
            storageArray.push(value); // Mutate targeted state array index directly
            saveState(); // Commit current layout state snapshots locally
            renderList(storageArray, elementWrap); // Force clear and repaint local node map
            input.value = ""; // Empty out standard working buffer stream
          }
        }
      });
    }
  }

  // Bind keydown events across all operational skills form input elements
  handleAddSkill("newTech", state.skills.technical, techWrap);
  handleAddSkill("newSoft", state.skills.soft, softWrap);
  handleAddSkill("newLang", state.skills.languages, langWrap);
  handleAddSkill("newCert", state.skills.certifications, certWrap);

  // Delegation pipeline managing deletion handlers dynamically
  wrapper.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.act === "remove") {
      const idx = Number(btn.dataset.idx);
      const type = btn.dataset.type;
      
      if (type === "techWrap") state.skills.technical.splice(idx, 1);
      if (type === "softWrap") state.skills.soft.splice(idx, 1);
      if (type === "langWrap") state.skills.languages.splice(idx, 1);
      if (type === "certWrap") state.skills.certifications.splice(idx, 1);
      
      saveState();
      renderStep(3); // Redraw UI elements instantly to reflect current mutations
    }
  });

  wrapper.querySelector("#saveSkills").onclick = () => {
    saveState();
    alert("Skills saved successfully!");
  };

  wrapper.querySelector("#toNext3").onclick = () => {
    state.current = 4;
    saveState();
    if (typeof renderStep === "function") renderStep(4);
  };

  return wrapper;
}

  // 4. Projects
  function renderProjects() {
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `<div class="list" id="projList"></div><div style="margin-top:12px" class="actions"><button id="addProj" class="btn neutral">Add Project</button><div style="flex:1"></div></div>`;
    const list = wrapper.querySelector("#projList");
    function refresh() {
      list.innerHTML = "";
      state.projects.forEach((p, idx) => {
        const el = document.createElement("div");
        el.className = "entry";
        el.innerHTML = `<div class="entry-head"><strong>${escape(p.name || "Project")}</strong><div><button class="btn neutral" data-idx="${idx}" data-act="edit">Edit</button><button class="btn" data-idx="${idx}" data-act="remove">Remove</button></div></div><div class="small muted">${escape(p.tech || "")}</div><div style="margin-top:8px">${escape(p.description || "")}</div>`;
        list.appendChild(el);
      });
      if (state.projects.length === 0)
        list.innerHTML = `<div class="small muted">No projects yet.</div>`;
    }
    refresh();
    wrapper.querySelector("#addProj").onclick = () => {
      state.projects.push({
        name: "",
        description: "",
        tech: "",
        github: "",
        demo: "",
      });
      saveState();
      renderProjectEditor(state.projects.length - 1, refresh);
    };
    list.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      if (btn.dataset.act === "remove") {
        if (confirm("Remove project?")) {
          state.projects.splice(idx, 1);
          saveState();
          renderStep(4);
        }
      }
      if (btn.dataset.act === "edit") renderProjectEditor(idx, refresh);
    });
    return wrapper;
  }

  function renderProjectEditor(idx, onDone) {
    const data = state.projects[idx];
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    modalDiv.setAttribute("aria-hidden", "false");
    modalDiv.innerHTML = `<div class="modal-panel"><header><h3>Edit Project</h3></header><div style="padding:12px">
      <div class="field"><label>Project Name</label><input class="form-control" id="p_name" value="${escape(data.name || "")}"/></div>
      <div class="field"><label>Technologies</label><input class="form-control" id="p_tech" value="${escape(data.tech || "")}"/></div>
      <div class="field"><label>GitHub Link</label><input class="form-control" id="p_github" value="${escape(data.github || "")}"/></div>
      <div class="field"><label>Live Demo</label><input class="form-control" id="p_demo" value="${escape(data.demo || "")}"/></div>
      <div class="field"><label>Description</label><textarea class="form-control" id="p_desc">${escape(data.description || "")}</textarea></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px"><button id="p_cancel" class="btn neutral">Cancel</button><button id="p_save" class="btn primary">Save</button></div>
      </div></div>`;
    document.body.appendChild(modalDiv);
    modalDiv.querySelector("#p_cancel").onclick = () => modalDiv.remove();
    modalDiv.querySelector("#p_save").onclick = () => {
      data.name = modalDiv.querySelector("#p_name").value;
      data.tech = modalDiv.querySelector("#p_tech").value;
      data.github = modalDiv.querySelector("#p_github").value;
      data.demo = modalDiv.querySelector("#p_demo").value;
      data.description = modalDiv.querySelector("#p_desc").value;
      saveState();
      modalDiv.remove();
      if (onDone) onDone();
      renderStep(4);
    };
  }

  // 5. Experience
  function renderExperience() {
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `<div class="list" id="expList"></div><div style="margin-top:12px" class="actions"><button id="addExp" class="btn neutral">Add Experience</button><div style="flex:1"></div></div>`;
    const list = wrapper.querySelector("#expList");
    function refresh() {
      list.innerHTML = "";
      state.experience.forEach((e, idx) => {
        const el = document.createElement("div");
        el.className = "entry";
        el.innerHTML = `<div class="entry-head"><strong>${escape(e.title || "Title")} @ ${escape(e.company || "Company")}</strong><div><button class="btn neutral" data-idx="${idx}" data-act="edit">Edit</button><button class="btn" data-idx="${idx}" data-act="remove">Remove</button></div></div>
          <div class="small muted">${escape(e.start || "")} - ${escape(e.end || "")}</div><div style="margin-top:8px">${escape(e.responsibilities?.slice(0, 120) || "")}</div>`;
        list.appendChild(el);
      });
      if (state.experience.length === 0)
        list.innerHTML = `<div class="small muted">No experience entries yet.</div>`;
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
      saveState();
      renderExperienceEditor(state.experience.length - 1, refresh);
    };
    list.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      if (btn.dataset.act === "remove") {
        if (confirm("Remove?")) {
          state.experience.splice(idx, 1);
          saveState();
          renderStep(5);
        }
      }
      if (btn.dataset.act === "edit") renderExperienceEditor(idx, refresh);
    });
    return wrapper;
  }

  function renderExperienceEditor(idx, onDone) {
    const data = state.experience[idx];
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    modalDiv.setAttribute("aria-hidden", "false");
    modalDiv.innerHTML = `<div class="modal-panel"><header><h3>Edit Experience</h3></header><div style="padding:12px">
      <div class="field"><label>Company</label><input class="form-control" id="ex_company" value="${escape(data.company || "")}"/></div>
      <div class="field"><label>Job Title</label><input class="form-control" id="ex_title" value="${escape(data.title || "")}"/></div>
      <div class="form-row"><div class="field"><label>Type</label><input class="form-control" id="ex_type" value="${escape(data.type || "")}"/></div><div class="field"><label>Start</label><input class="form-control" id="ex_start" type="month" value="${escape(data.start || "")}"/></div></div>
      <div class="form-row"><div class="field"><label>End</label><input class="form-control" id="ex_end" type="month" value="${escape(data.end || "")}"/></div><div class="field"><label>Responsibilities (comma separated)</label><input class="form-control" id="ex_resp" value="${escape(data.responsibilities || "")}"/></div></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px"><button id="ex_cancel" class="btn neutral">Cancel</button><button id="ex_save" class="btn primary">Save</button></div>
    </div></div>`;
    document.body.appendChild(modalDiv);
    modalDiv.querySelector("#ex_cancel").onclick = () => modalDiv.remove();
    modalDiv.querySelector("#ex_save").onclick = () => {
      data.company = modalDiv.querySelector("#ex_company").value;
      data.title = modalDiv.querySelector("#ex_title").value;
      data.type = modalDiv.querySelector("#ex_type").value;
      data.start = modalDiv.querySelector("#ex_start").value;
      data.end = modalDiv.querySelector("#ex_end").value;
      data.responsibilities = modalDiv.querySelector("#ex_resp").value;
      saveState();
      modalDiv.remove();
      if (onDone) onDone();
      renderStep(5);
    };
  }

  // 6. Achievements
  function renderAchievements() {
    const wrapper = document.createElement("div");
    wrapper.className = "form";
    wrapper.innerHTML = `<div class="list" id="achList"></div><div style="margin-top:12px" class="actions"><button id="addAch" class="btn neutral">Add Achievement</button><div style="flex:1"></div></div>`;
    const list = wrapper.querySelector("#achList");
    function refresh() {
      list.innerHTML = "";
      state.achievements.forEach((a, idx) => {
        const el = document.createElement("div");
        el.className = "entry";
        el.innerHTML = `<div class="entry-head"><strong>${escape(a.title || "Achievement")}</strong><div><button class="btn neutral" data-idx="${idx}" data-act="edit">Edit</button><button class="btn" data-idx="${idx}" data-act="remove">Remove</button></div></div><div class="small muted">${escape(a.org || "")} • ${escape(a.date || "")}</div><div style="margin-top:8px">${escape(a.description || "")}</div>`;
        list.appendChild(el);
      });
      if (state.achievements.length === 0)
        list.innerHTML = `<div class="small muted">No achievements yet.</div>`;
    }
    refresh();
    wrapper.querySelector("#addAch").onclick = () => {
      state.achievements.push({
        title: "",
        org: "",
        date: "",
        description: "",
      });
      saveState();
      renderAchievementEditor(state.achievements.length - 1, refresh);
    };
    list.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = Number(btn.dataset.idx);
      if (btn.dataset.act === "remove") {
        if (confirm("Remove?")) {
          state.achievements.splice(idx, 1);
          saveState();
          renderStep(6);
        }
      }
      if (btn.dataset.act === "edit") renderAchievementEditor(idx, refresh);
    });
    return wrapper;
  }

  function renderAchievementEditor(idx, onDone) {
    const data = state.achievements[idx];
    const modalDiv = document.createElement("div");
    modalDiv.className = "modal";
    modalDiv.setAttribute("aria-hidden", "false");
    modalDiv.innerHTML = `<div class="modal-panel"><header><h3>Edit Achievement</h3></header><div style="padding:12px">
      <div class="field"><label>Title</label><input class="form-control" id="a_title" value="${escape(data.title || "")}"/></div>
      <div class="field"><label>Organization</label><input class="form-control" id="a_org" value="${escape(data.org || "")}"/></div>
      <div class="field"><label>Date</label><input class="form-control" id="a_date" type="month" value="${escape(data.date || "")}"/></div>
      <div class="field"><label>Description</label><textarea class="form-control" id="a_desc">${escape(data.description || "")}</textarea></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px"><button id="a_cancel" class="btn neutral">Cancel</button><button id="a_save" class="btn primary">Save</button></div>
    </div></div>`;
    document.body.appendChild(modalDiv);
    modalDiv.querySelector("#a_cancel").onclick = () => modalDiv.remove();
    modalDiv.querySelector("#a_save").onclick = () => {
      data.title = modalDiv.querySelector("#a_title").value;
      data.org = modalDiv.querySelector("#a_org").value;
      data.date = modalDiv.querySelector("#a_date").value;
      data.description = modalDiv.querySelector("#a_desc").value;
      saveState();
      modalDiv.remove();
      if (onDone) onDone();
      renderStep(6);
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
    livePreview.innerHTML = buildLivePreviewHtml();
  }

  function buildLivePreviewHtml() {
    const p = state.personal;
    return `<div style="display:flex;gap:12px;align-items:center">
      ${p.photo ? `<img src="${p.photo}" style="width:64px;height:64px;object-fit:cover;border-radius:10px">` : `<div style="width:64px;height:64px;border-radius:10px;background:#eef5ff"></div>`}
      <div><div style="font-weight:700;color:#0f172a">${escape(p.fullName || "Your Name")}</div><div class="small muted">${escape(p.headline || "Professional Headline")}</div></div>
    </div>
    <div style="margin-top:10px"><div class="small muted">Email: ${escape(p.email || "")}</div><div class="small muted">Phone: ${escape(p.phone || "")}</div></div>`;
  }

  function buildResumeHtml() {
    // simple formatted HTML for preview/export
    return `<div style="font-family:Inter,system-ui;line-height:1.4;color:var(--muted)">
      <div style="display:flex;gap:12px;align-items:center"><div style="flex:1"><h2 style="margin:0">${escape(state.personal.fullName || "")}</h2><div style="color:var(--muted)">${escape(state.personal.headline || "")}</div></div>${state.personal.photo ? `<img src="${state.personal.photo}" style="width:86px;height:86px;border-radius:10px;object-fit:cover">` : ""}</div>
      <hr style="margin:12px 0;border:none;border-top:1px solid rgba(15,23,42,0.04)">
      <h4 style="margin-bottom:6px">Contact</h4><div class="small muted">${escape(state.personal.email || "")} • ${escape(state.personal.phone || "")} • ${escape(state.personal.address || "")}</div>
      <h4 style="margin-top:12px">Education</h4>${state.education.map((e) => `<div><strong>${escape(e.degree || "")}</strong> — ${escape(e.institution || "")}<div class="small muted">${escape(e.start || "")} - ${escape(e.end || "")}</div><div style="margin-top:6px">${escape(e.description || "")}</div></div>`).join("")}
      <h4 style="margin-top:12px">Skills</h4><div class="small muted">${(state.skills.technical || []).join(", ")}</div>
      <h4 style="margin-top:12px">Projects</h4>${state.projects.map((p) => `<div><strong>${escape(p.name || "")}</strong><div class="small muted">${escape(p.tech || "")}</div><div>${escape(p.description || "")}</div></div>`).join("")}
      <h4 style="margin-top:12px">Experience</h4>${state.experience.map((x) => `<div><strong>${escape(x.title || "")} @ ${escape(x.company || "")}</strong><div class="small muted">${escape(x.start || "")} - ${escape(x.end || "")}</div><div>${escape(x.responsibilities || "")}</div></div>`).join("")}
      <h4 style="margin-top:12px">Achievements</h4>${state.achievements.map((a) => `<div><strong>${escape(a.title || "")}</strong><div class="small muted">${escape(a.org || "")} • ${escape(a.date || "")}</div><div>${escape(a.description || "")}</div></div>`).join("")}
      <h4 style="margin-top:12px">Summary</h4><div>${escape(state.summary.text || "")}</div>
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
    if ((state.skills.technical || []).length > 0) done++;
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
