# DCC Operations Command Center & Executive Intelligence Dashboard

A modern, responsive, high-performance telemetry dashboard and cross-period incident intelligence platform for District Cooling & Operations Command Centers.

🌐 **Live Website**: [https://aordjk.github.io/dcc_dashboard/](https://aordjk.github.io/dcc_dashboard/)

---

## 🌟 Key Features

### 1. Dual-View Intelligence Architecture
- **Executive Dashboard**:
  - Live KPI metric cards (Total Filtered, Resolution Rate, Pending SLA Backlog, MTTR).
  - 5 Interactive telemetry charts: Monthly Volume Trends, Category Distribution, Created By Teams, Zone/Site Distribution, Top 10 Event Types.
  - Interactive Pending Incidents Management Table with live search, sorting, and pagination.
  - Dynamic AI/Executive Analyst Briefing with real-time insight generation and editable markdown persistence.
- **Cross-Period & Case Compare**:
  - Multi-file cross-year and cross-site comparison.
  - Sunday-to-Saturday weekly slicer.
  - Shift multi-bar analytics, True vs False alarm distribution, recurring incident root-cause intelligence.
  - Priority incident watchlist with severity ranking (CAT 1-3) and MTTR tracking.

### 2. Space-Efficient Modal Filter System
- Ultra-compact ~48px top navigation bar maximizing viewport height for data, charts, and analysis.
- Sleek **Filter Modal** (`#filterModal`) with dedicated tabs for Executive Dashboard slicers and Cross-Period comparison slicers.
- Real-time active filter counter badges and removable filter chips for rapid inspection without vertical clutter.

### 3. Full Bilingual Localization (EN / TH)
- Instant one-click toggle between English and Thai (`EN` / `TH`).
- 100% comprehensive coverage: navigation, slicers, KPI titles, chart labels, briefing summaries, table headers, and export descriptions.

### 4. Day & Night Mode
- High-contrast, accessibility-tested dark mode (Night) and light mode (Day).
- Tailored color palettes ensuring readable typography, cards, tables, and chart axes across all lighting environments.

### 5. Multi-Format Executive Exports
- **Executive Dashboard**:
  - Export Dashboard as PDF (presentation-ready print layout)
  - Export PowerPoint Slides (.pptx)
  - Export Pending & All Cases to Excel (.xlsx)
- **Case Compare**:
  - Export Intelligence Briefing to Microsoft Word (.docx)
  - Export Comparative Slides (.pptx)
  - Export All Records to Excel (.xlsx)

---

## 🚀 Running Locally

You can open `index.html` directly in any modern browser, or run a lightweight local server:

```bash
# Using Node.js
node server.js

# Or using Python
python -m http.server 8080
```

Then visit `http://localhost:8080`.

---

## 📂 Project Structure

- `index.html` - Primary production application entry point (hosted via GitHub Pages).
- `case_dashboard.html` - Full source dashboard with integrated compare engine and filter modal.
- `case-compare.html` - Comparative incident intelligence suite.
- `TPQ_Case_2026.csv` - Baseline sample dataset for The PARQ operations.
- `server.js` - Optional Node.js development server.
