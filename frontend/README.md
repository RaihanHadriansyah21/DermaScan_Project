# 💻 DermaScan Frontend — React & Vite Application

This directory contains the user interface for the **DermaScan Web Application**, built with **React 18** and **Vite**.

---

## 📌 Purpose & Key Responsibilities

The frontend provides an intuitive web interface for skin lesion analysis:
- **Interactive File Uploader**: Drag-and-drop or file selector for skin images.
- **Real-Time Client-Side Validation**: Ensures file format (JPG, JPEG, PNG) and file size constraints before transmission.
- **Diagnostic Dashboard**: Displays risk gauge meter, primary lesion classification, and confidence probability breakdown.
- **Medical Education Module**: Interactive information cards detailing various skin lesion types, prevention guides, and self-examination tips.
- **Responsive Layout**: Designed for seamless accessibility on desktop, tablet, and mobile browsers.

---

## 📁 Directory Contents

```text
frontend/
├── package.json                 # Node.js project manifest & scripts
├── vite.config.js               # Vite bundler configuration
├── index.html                   # HTML document template
├── .env.example                 # Environment variable template
└── src/                         # React source code
    ├── main.jsx                 # Application entrypoint
    ├── App.jsx                  # Root React component & state manager
    ├── index.css                # CSS design system, utility tokens & custom styling
    ├── components/              # Modular UI components
    │   ├── Header.jsx           # App navigation bar
    │   ├── ImageUploader.jsx    # Image dropzone & file picker component
    │   ├── PredictionResult.jsx # AI prediction visualizer & risk badge
    │   └── EducationCard.jsx    # Medical knowledge cards
    └── services/                # API communication layer
        └── api.js               # Fetch wrapper connecting to FastAPI backend
```

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_API_URL` points to your local backend server:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server
```bash
npm run dev
```
Open browser at: `http://localhost:5173`

---

## 📦 Production Build

To test production bundle locally:
```bash
npm run build
npm run preview
```
