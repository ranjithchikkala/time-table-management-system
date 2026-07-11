import React from 'react';
import {
  AlertTriangle,
  Calendar,
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function Dashboard({
  timetable = [],
  faculties = [],
  classes = [],
  subjects = [],
  workloadRequests = [],
  temporaryRequests = [],
  conflictReport = { hasConflicts: false, conflicts: [] },
  onNavigate
}) {
  const activeConflicts = conflictReport.conflicts || [];
  const dangerConflicts = activeConflicts.filter(c => c.severity === 'Danger');
  const warningConflicts = activeConflicts.filter(c => c.severity === 'Warning');

  // Compute stats
  const totalClasses = classes.length;
  const totalFaculty = faculties.length;
  const totalSubjects = subjects.length;
  const totalSlots = timetable.length;

  const pendingWorkloadCount = workloadRequests.filter(r => r.status === 'Pending').length;
  const pendingTempCount = temporaryRequests.filter(r => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Academic Scheduling Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time timetable stats, resource workloads, and conflict analysis.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${conflictReport.hasConflicts ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${conflictReport.hasConflicts ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="text-sm font-semibold text-slate-700">
            {conflictReport.hasConflicts ? `${activeConflicts.length} Active Conflict(s)` : 'System Conflict-Free'}
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Timetable Slots */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Lectures</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalSlots}</h3>
            <p className="text-xs text-indigo-600 mt-1 font-medium">{totalClasses} Active Classes</p>
          </div>
        </div>

        {/* Faculty count */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Faculty Members</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalFaculty}</h3>
            <p className="text-xs text-emerald-600 mt-1 font-medium">{totalSubjects} Subjects taught</p>
          </div>
        </div>

        {/* Workload requests */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition cursor-pointer" onClick={() => onNavigate('reports')}>
          <div className="p-3 rounded-lg bg-sky-50 text-sky-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workload Requests</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{workloadRequests.length}</h3>
            <p className="text-xs mt-1 font-medium text-slate-500">
              <span className="text-amber-500 font-bold">{pendingWorkloadCount}</span> pending
            </p>
          </div>
        </div>

        {/* Temporary Requests */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:shadow-md transition cursor-pointer" onClick={() => onNavigate('timetable')}>
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Temporary Schedules</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{temporaryRequests.length}</h3>
            <p className="text-xs mt-1 font-medium text-slate-500">
              <span className="text-amber-500 font-bold">{pendingTempCount}</span> pending approval
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Conflict & Warnings Center (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`h-5 w-5 ${dangerConflicts.length > 0 ? 'text-red-500' : 'text-amber-500'}`} />
              <h2 className="text-lg font-bold text-slate-800 m-0">Conflict Detection & Alerts Center</h2>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
              activeConflicts.length > 0
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {activeConflicts.length} active issue(s)
            </span>
          </div>

          <div className="p-5 flex-1 overflow-y-auto max-h-[350px] space-y-3">
            {activeConflicts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <CheckCircle2 className="h-14 w-14 text-emerald-500 mb-3" />
                <h3 className="text-lg font-semibold text-slate-700">Perfect Schedule Alignment!</h3>
                <p className="text-slate-400 text-sm max-w-md mt-1">
                  Our scheduler found zero faculty double-bookings, class double-bookings, room conflicts, or workload cap violations.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeConflicts.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-lg border flex items-start space-x-3 transition hover:bg-slate-50 ${
                      c.severity === 'Danger'
                        ? 'bg-red-50/50 border-red-100 text-red-900'
                        : 'bg-amber-50/50 border-amber-100 text-amber-900'
                    }`}
                  >
                    {c.severity === 'Danger' ? (
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                          c.severity === 'Danger' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.type}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">ID: {c.id}</span>
                      </div>
                      <p className="text-sm font-medium mt-1.5 text-slate-700">{c.message}</p>
                      {c.details && (
                        <div className="mt-2 text-xs text-slate-500 flex flex-wrap gap-2">
                          {c.details.day && <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded">Day: {c.details.day}</span>}
                          {c.details.periodId && <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded">Period: {c.details.periodId}</span>}
                          {c.details.room && <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded">Room: {c.details.room}</span>}
                          {c.details.limit && <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded">Cap: {c.details.limit} hrs</span>}
                          {c.details.assigned && <span className="bg-white/80 border border-slate-200 px-2 py-0.5 rounded">Assigned: {c.details.assigned} hrs</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - System Fast Facts & Setup */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800 m-0">Setup & Quick Actions</h2>
          </div>
          <div className="p-5 flex-1 space-y-4 text-sm text-slate-600">
            <div>
              <span className="font-semibold text-slate-700">How to allocate subjects?</span>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Go to the <span className="text-indigo-600 font-medium">Management tab</span>, assign subjects to a class. The scheduler automatically computes optimal assignments based on faculty eligibility and hours required.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <span className="font-semibold text-slate-700">Workload changes?</span>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Modify workloads in real-time. In the <span className="text-indigo-600 font-medium">Reports / Workload panel</span>, you can submit additional workload requests. Approving them immediately updates the faculty weekly limits and adapts the timetable dynamically!
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <span className="font-semibold text-slate-700">Temporary Schedule Substitution?</span>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Need a substitute teacher or temporary change for next week? Submit a request in the <span className="text-indigo-600 font-medium">Timetable tab</span>. Once approved, the scheduler instantly generates the Temporary Timetable!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
