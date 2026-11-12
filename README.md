# MediQ AI 🏥⚡

> **AI-Powered Multi-Hospital Smart Queue & Patient Flow Management System**

MediQ AI modernizes emergency room and hospital outpatient operations through predictive patient queue balancing, AI triage, and real-time cross-facility telemetry.

---

## 🛠 Tech Stack

- **Frontend:** [React 18](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Backend / Database:** [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Utility:** `clsx` + `tailwind-merge`

---

## 📁 Project Folder Structure

```
MediQ-ai/
├── public/                  # Static assets & favicon
│   └── vite.svg             # Medical cross pulse vector
├── src/
│   ├── assets/              # Logos and graphics
│   ├── components/
│   │   ├── common/          # Reusable modals, badges, inputs
│   │   │   └── DemoModal.jsx
│   │   ├── landing/         # Landing page sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── StatsSection.jsx
│   │   │   ├── LiveQueuePreview.jsx
│   │   │   ├── HospitalNetworkSection.jsx
│   │   │   ├── FeaturesSection.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   └── CTASection.jsx
│   │   └── layout/          # Navigation and footer
│   │       ├── Navbar.jsx
│   │       └── Footer.jsx
│   ├── context/             # React context providers (Auth, Queue state)
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Third-party integrations
│   │   └── supabase.js      # Supabase client & connection validator
│   ├── pages/               # Top-level view routes
│   │   └── LandingPage.jsx
│   ├── services/            # Supabase API services
│   ├── types/               # Status enums, priority definitions, data models
│   │   └── index.js
│   ├── utils/               # Helper utilities
│   │   └── cn.js
│   ├── App.jsx              # Main App component
│   ├── index.css            # Tailwind directives & healthcare theme tokens
│   └── main.jsx             # React DOM root entry
├── .env.example             # Supabase environment variable template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase project credentials:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
```
Verify the production build locally:
```bash
npm run preview
```
