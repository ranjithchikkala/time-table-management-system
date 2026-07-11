import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  CalendarRange,
  Settings,
  BarChart3,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

// Utilities & Components
import {
  initialFaculties,
  initialSubjects,
  initialClasses,
  initialWorkloadRequests,
  initialTemporaryRequests
} from './utils/mockData.js';
import {
  generateTimetable,
  generateTemporaryTimetable,
  detectConflicts
} from './utils/scheduler.js';

import Dashboard from './components/Dashboard.jsx';
import Management from './components/Management.jsx';
import TimetableGrid from './components/TimetableGrid.jsx';
import Reports from './components/Reports.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | timetable | management | reports

  // Persistent React State (Mock database in local memory)
  const [faculties, setFaculties] = useState(initialFaculties);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [classes, setClasses] = useState(initialClasses);
  const [workloadRequests, setWorkloadRequests] = useState(initialWorkloadRequests);
  const [temporaryRequests, setTemporaryRequests] = useState(initialTemporaryRequests);

  // Memoized schedule computation and conflict reporting
  const baseTimetable = useMemo(() => {
    return generateTimetable(faculties, subjects, classes, workloadRequests);
  }, [faculties, subjects, classes, workloadRequests]);

  const temporaryTimetable = useMemo(() => {
    return generateTemporaryTimetable(baseTimetable, temporaryRequests, faculties);
  }, [baseTimetable, temporaryRequests, faculties]);

  const conflictReport = useMemo(() => {
    return detectConflicts(baseTimetable, faculties, classes, subjects, workloadRequests);
  }, [baseTimetable, faculties, classes, subjects, workloadRequests]);

  const pendingRequestsCount = useMemo(() => {
    const workloadPending = workloadRequests.filter(r => r.status === 'Pending').length;
    const temporaryPending = temporaryRequests.filter(r => r.status === 'Pending').length;
    return workloadPending + temporaryPending;
  }, [workloadRequests, temporaryRequests]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Top Professional Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-inner flex items-center justify-center">
                <CalendarRange className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">
                  ScheduleOptima
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider text-indigo-400 block -mt-0.5">
                  Academic Engine
                </span>
              </div>
            </div>

            {/* Quick Stats / Action Status */}
            <div className="flex items-center space-x-4">
              {conflictReport.hasConflicts ? (
                <div className="flex items-center space-x-1.5 bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-semibold border border-red-500/30">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Clashes Detected</span>
                  <span className="bg-red-500 text-white text-[10px] h-4 px-1.5 rounded-full flex items-center justify-center font-bold">
                    {conflictReport.conflicts.length}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Conflict-Free</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout containing Navigation Drawer and Views */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm space-y-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Main Navigation</p>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <LayoutDashboard className="h-4.5 w-4.5" />
                <span>Dashboard</span>
              </div>
              {conflictReport.hasConflicts && (
                <span className="bg-amber-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('timetable')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'timetable'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CalendarRange className="h-4.5 w-4.5" />
                <span>Timetable Grid</span>
              </div>
              {temporaryRequests.filter(r => r.status === 'Pending').length > 0 && (
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {temporaryRequests.filter(r => r.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('management')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'management'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Settings className="h-4.5 w-4.5" />
                <span>Management Hub</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'reports'
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-4.5 w-4.5" />
                <span>Reports & Workloads</span>
              </div>
              {workloadRequests.filter(r => r.status === 'Pending').length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {workloadRequests.filter(r => r.status === 'Pending').length}
                </span>
              )}
            </button>
          </nav>

          {/* Quick System Summary */}
          <div className="mt-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-indigo-100 p-4.5 rounded-xl border border-indigo-950 shadow-sm text-xs space-y-2">
            <span className="font-extrabold uppercase text-[10px] tracking-wider text-indigo-400 block">Active Database State</span>
            <div className="space-y-1 text-indigo-200">
              <p className="flex justify-between"><span>Faculty count:</span> <span className="font-bold text-white">{faculties.length}</span></p>
              <p className="flex justify-between"><span>Subjects active:</span> <span className="font-bold text-white">{subjects.length}</span></p>
              <p className="flex justify-between"><span>Total Classrooms:</span> <span className="font-bold text-white">{classes.length}</span></p>
            </div>
            <div className="pt-2 border-t border-indigo-800/60 text-[10px] text-indigo-300 leading-relaxed">
              * Any change automatically triggers recalculation and optimizes slot scheduling!
            </div>
          </div>
        </aside>

        {/* Dynamic View container */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              timetable={baseTimetable}
              faculties={faculties}
              classes={classes}
              subjects={subjects}
              workloadRequests={workloadRequests}
              temporaryRequests={temporaryRequests}
              conflictReport={conflictReport}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'timetable' && (
            <TimetableGrid
              baseTimetable={baseTimetable}
              temporaryTimetable={temporaryTimetable}
              faculties={faculties}
              classes={classes}
              subjects={subjects}
              temporaryRequests={temporaryRequests}
              setTemporaryRequests={setTemporaryRequests}
            />
          )}

          {activeTab === 'management' && (
            <Management
              faculties={faculties}
              setFaculties={setFaculties}
              subjects={subjects}
              setSubjects={setSubjects}
              classes={classes}
              setClasses={setClasses}
            />
          )}

          {activeTab === 'reports' && (
            <Reports
              timetable={baseTimetable}
              faculties={faculties}
              subjects={subjects}
              classes={classes}
              workloadRequests={workloadRequests}
              setWorkloadRequests={setWorkloadRequests}
              conflictReport={conflictReport}
            />
          )}
        </main>
      </div>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 ScheduleOptima Inc. All rights reserved. Built with Vite, React & Tailwind.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0 font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600 transition">Terms of Use</a>
            <span>•</span>
            <a href="#" className="hover:text-indigo-600 transition">Contact Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
