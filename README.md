# ScheduleOptima: Intelligent Academic Timetable & Workload Scheduler

An advanced, high-fidelity web application built to automatically generate class-wise and faculty-wise academic timetables, dynamically optimize workloads, handle temporary substitutions, and provide real-time conflict detection and alerts.

---

## 🛠️ Technology Stack

- **Frontend Core:** [React 19](https://react.dev/) + [Vite](https://vite.dev/) (High-performance build & Hot Module Replacement)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/) (Fully customized dark/light responsive layout with grid-based matrix)
- **Iconography:** [Lucide React](https://lucide.dev/) (Vector-based crisp functional icons)
- **State Management:** Reactive local states integrated directly with automated heuristic calculations
- **Validation & Simulation:** Custom Node.js Heuristic Unit Runner

---

## ✨ Key Features

1. **Automatic Timetable Generation:**
   - Powered by a penalty-heuristic allocation algorithm (`src/utils/scheduler.js`) that automatically matches class subject requirements with eligible, available faculties.
2. **Dual-Mode Schedule Matrix:**
   - Display class-wise and faculty-wise timetables side-by-side or as toggleable views, mapped across regular weekdays and academic periods.
3. **Dynamic Workload Adaptation:**
   - Interactive panel to adjust and request faculty workload caps with automatic recalculations upon approval.
4. **Temporary Substitution Overlays:**
   - Log substitute requests, overlay temporary assignments, and revert easily.
5. **Real-Time Conflict Detection:**
   - Scans and detects rooms, class slots, and faculty timetables for double-bookings, unavailability, or workload limit violations with immediate notification prompts.

---

## 🚀 How to Run the Application

Follow these steps to set up, run, and test the application locally:

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your system.

### 2. Install Dependencies
Navigate to the root directory of the repository and install the required modules:
```bash
npm install
```

### 3. Run the Development Server
Start the Vite local development server on port `3000`:
```bash
__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=.com npm run dev -- --host 0.0.0.0 --port 3000
```
- Open `http://localhost:3000` in your web browser or click the **Web Preview** / **Live Preview** tab in your workspace.

### 4. Run Heuristic Unit Tests
To execute and verify the correctness of the scheduling logic, run:
```bash
node src/utils/testScheduler.js
```

### 5. Build for Production
To generate optimized production assets in the `dist/` directory, run:
```bash
npm run build
```

---

## 📂 Codebase Structure

```
├── src/
│   ├── assets/             # Shared logos and visual media
│   ├── components/
│   │   ├── Dashboard.jsx   # Metrics, KPIs, real-time conflict detector
│   │   ├── Management.jsx  # Complete CRUD for Faculty, Subjects, and Classes
│   │   ├── Reports.jsx     # Workload meters, requests, export reports
│   │   └── TimetableGrid.jsx # Interactive class/faculty schedule tables
│   ├── utils/
│   │   ├── mockData.js     # Default academic registries & constraints
│   │   ├── scheduler.js    # The allocation & conflict checking logic
│   │   └── testScheduler.js # Unit test runner for scheduler logic
│   ├── App.jsx             # Main Application root with state management
│   ├── index.css           # Global Tailwind and font styles
│   └── main.jsx            # React mounting entrypoint
├── tailwind.config.js      # Tailwind customization config
├── vite.config.js          # Vite configuration supporting proxy headers
└── README.md               # Documentation
```
