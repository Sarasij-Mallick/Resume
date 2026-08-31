# Antigravity Agent Guidelines & Rules

This document outlines the mandatory rules and development guidelines that the AI agent must strictly follow for the **FolioCraft Pro Studio** workspace.

---

## 1. 🚫 Git & Remote Repository Control
- **Never push to GitHub** (`git push`) unless the owner specifically and explicitly asks to do so.
- Keep all git commits, branches, and changes strictly local until requested.

## 2. ⚡ AI Token & Quota Efficiency
- The owner operates with daily AI credit and quota considerations.
- Optimize context and token usage: keep responses concise, avoid redundant or looping tool calls, avoid unnecessary large file overwrites, and prioritize precise, one-pass implementations.

## 3. 🔄 Antigravity IDE Version Check
- On the first interaction of the day, check the Antigravity IDE version.
- If the IDE is not up to date, make sure it is updated before proceeding with core project work.

## 4. 🧠 High-Capability Model Usage
- Always utilize and recommend the latest high-capability model versions (e.g., Gemini High models) for Antigravity pair programming.

## 5. 📱 Pixel-Perfect Responsive Design
- Every UI component, template, and layout update must be **100% responsive** across all device viewports (mobile, tablet, desktop, ultra-wide).
- Ensure styling, typography, spacing, and interactive elements render consistently across all screen sizes and modern browsers.

## 6. 🎯 Targeted Scoping & Non-Invasive Edits
- When updating or adding a feature, modify **only** the necessary files and code blocks.
- Do not modify, refactor, or delete unrelated features, styles, or files unless explicitly requested.

## 7. 🔍 Research & Modern UI Inspiration
- Break complex requests into clear, manageable steps.
- Conduct thorough research and seek modern UI/UX design inspiration before building components.

## 8. 🎨 Designer-Grade Visual Standards
- The project owner is a **UI Designer** — maintain elite visual quality.
- Focus on clean typography, harmonious color palettes, smooth micro-interactions, precise padding/margins, and pixel-perfect layouts.

## 9. 🛡️ Safe Deletions & Regression Prevention
- When removing any element or feature, ensure no other existing functionality is broken.
- Cleanly refactor dependencies so the remaining parts of the application continue working seamlessly.

## 10. 📝 Structured Commits & Comprehensive Documentation
- Whenever a push to GitHub is requested by the owner:
  - Generate clear, professional commit messages listing all features, fixes, and modifications.
  - Update [`README.md`](file:///d:/codes/web_developement/ui%20design/Resume%28Sarasij%29/README.md) to reflect all new features, tech stack updates, and architecture changes.
