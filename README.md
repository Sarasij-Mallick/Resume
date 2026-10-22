# 📄 FolioCraft Pro Studio

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://resume-topaz-delta.vercel.app/)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)](#contributing)
[![Agent Rules](https://img.shields.io/badge/Agent%20Rules-AGENTS.md-blue.svg)](AGENTS.md)

Welcome to **FolioCraft Pro Studio**! A designer-grade, ATS-friendly resume builder and career studio featuring a modern **Charcoal + Violet** palette, **Lucite Glass** (frosted acrylic glassmorphism) aesthetics, real-time ATS scoring, dynamic templates, career insights, and 100% pixel-perfect responsive design.

---

## 🚀 Key Features

- **🎯 Smart ATS Scoring & Optimization:** Real-time resume evaluation, keyword density metrics, and recommendations to maximize job application success.
- **🎨 Dynamic & Modern Templates:** Curated resume designs tailored for professionals and freshers with customizable color palettes.
- **🔮 Charcoal + Violet Theme System:**
  - **Light Mode:** Deep Charcoal text (`#111827`), Electric Violet accents (`#7C3AED`, `#6D28D9`), and Ultra-Clean Canvas (`#F9FAFB`).
  - **Dark Mode:** Deep Obsidian Charcoal background (`#111827`), Dark Slate card containers (`#1F2937`), and Luminous Lavender Violet accents (`#A78BFA`, `#C4B5FD`).
  - **Zero-Flash Theme Loading:** Instant, flicker-free theme initialization script embedded in `<head>` across all pages.
- **💎 Lucite Glass Aesthetic:**
  - High-grade frosted acrylic glassmorphism (`backdrop-filter: blur(16px-24px) saturate(180%)`).
  - Specular top-rim bevel highlights (`box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.95)`).
  - Ambient chromatic aura meshes providing genuine optical refraction as components scroll over the viewport.
  - Applied across site header, floating navigation capsule, theme toggle button, hero banner, mockup frame, badges, unified card system, and modal sheets.
- **⚡ High-Definition Direct PDF Export:** 300 DPI client-side PDF generator (`html2canvas` + `jsPDF`) with pixel-perfect template parity and smart pagination.
- **🖥️ Real-Time Fullscreen Document Viewer:** Full-fidelity interactive canvas synchronized live with all form updates.
- **🎓 Fresher Resume Builder:** Dedicated interface ([`fresher.html`](file:///d:/resume_genarator/fresher.html)) crafted specifically for students and early-career job seekers with a SaaS-grade stepper header and dynamic progress indicator.
- **📚 Career & Resume Blog:** In-depth guides on ATS optimization, tech resumes, executive resumes, and career switching ([`blog.html`](file:///d:/resume_genarator/blog.html)).
- **🔐 Pinterest-Inspired Auth Experience:** Sleek split authentication card ([`login.html`](file:///d:/resume_genarator/login.html)) with frosted Lucite glass styling and smooth tab switching.
- **📱 100% Pixel-Perfect Responsive Design:** Optimized layout and seamless experience across mobile, tablet, desktop, and ultra-wide displays.
- **🔒 Privacy & Client-Side Execution:** Your data remains safe and processed directly in your browser.

---

## 🏗️ Tech Stack & Architecture

- **Frontend:** HTML5, CSS3 (Vanilla CSS, Modern Flexbox & CSS Grid Design System), JavaScript (ES6+)
- **Styling & Assets:** Custom modern stylesheets ([`css/style.css`](file:///d:/resume_genarator/css/style.css)), responsive media assets in [`images/`](file:///d:/resume_genarator/images/)
- **PDF Engine:** `html2pdf.js`, `html2canvas`, `jsPDF`
- **Typography:** Google Fonts (`Inter` & `Outfit`)
- **Version Control & Collaboration:** Git & GitHub
- **Deployment:** Vercel

---

## 📂 Project Structure

```text
Resume/
├── css/
│   ├── style.css           # Core Charcoal + Violet styling, Lucite Glass tokens & responsive rules
│   └── style.css.map       # Source map
├── images/                 # Icons, mascots, blog illustrations, and UI graphics
├── AGENTS.md               # Mandatory Antigravity AI pair programming rules & guidelines
├── app.js                  # Application state and helper logic
├── blog.html               # Career & resume guide hub
├── fresher.html            # Dedicated fresher resume builder interface
├── index.html              # Main interactive resume builder & landing page
├── login.html              # Authentication interface with Lucite Glass card
├── script.js               # Resume builder engine & ATS score calculation
└── README.md               # Project documentation
```

---

## 🤖 AI Pair Programming Guidelines

For developers and contributors using AI coding assistants (such as Antigravity), strict development rules and standards are maintained in [**`AGENTS.md`**](AGENTS.md). Please ensure all contributions adhere to these guidelines.

---

## 🤝 Contributing

1. Fork or clone the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes with clear, structured messages.
4. Open a Pull Request for review.
