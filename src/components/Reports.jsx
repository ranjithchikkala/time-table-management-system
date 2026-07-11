import React, { useState } from 'react';
import {
  BarChart3,
  AlertTriangle,
  Printer,
  Plus,
  Check,
  X,
  CheckCircle2,
  HelpCircle,
  Sliders,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { getFacultyWorkloadLimit } from '../utils/scheduler.js';

export default function Reports({
  timetable = [],
  faculties = [],
  subjects = [],
  classes = [],
  workloadRequests = [],
  setWorkloadRequests,
  conflictReport = { hasConflicts: false, conflicts: [] }
}) {
  const [activeReportTab, setActiveReportTab] = useState('workload'); // workload | conflicts

  // Form states for submitting new workload request
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reqFacultyId, setReqFacultyId] = useState(faculties[0]?.id || '');
  const [reqSubjectId, setReqSubjectId] = useState(subjects[0]?.id || '');
  const [reqProposedHours, setReqProposedHours] = useState(2);
  const [reqType, setReqType] = useState('ADDITIONAL'); // ADDITIONAL | REDUCTION
  const [reqDesc, setReqDesc] = useState('');

  const activeConflicts = conflictReport.conflicts || [];

  // Compute assigned hours per faculty
  const getAssignedHours = (facultyId) => {
    return timetable.filter(slot => slot.facultyId === facultyId).length;
  };

  const handleAddWorkloadRequest = (e) => {
    e.preventDefault();
    if (!reqFacultyId || !reqSubjectId) {
      return alert('Please select a faculty and subject.');
    }

    const proposedNum = Number(reqProposedHours);
    const finalHours = reqType === 'REDUCTION' ? -Math.abs(proposedNum) : Math.abs(proposedNum);

    const newRequest = {
      id: 'WR_' + Math.floor(Math.random() * 100000),
      facultyId: reqFacultyId,
      subjectId: reqSubjectId,
      proposedHours: finalHours,
      type: reqType,
      status: 'Pending',
      description: reqDesc || `${reqType === 'ADDITIONAL' ? 'Additional' : 'Reduction'} hours requested`
    };

    setWorkloadRequests([...workloadRequests, newRequest]);
    setIsFormOpen(false);
    setReqDesc('');
  };

  const handleRequestStatus = (id, newStatus) => {
    setWorkloadRequests(
      workloadRequests.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors & Print Button */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start">
          <button
            onClick={() => setActiveReportTab('workload')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeReportTab === 'workload'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Faculty Workloads</span>
          </button>
          <button
            onClick={() => setActiveReportTab('conflicts')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-md text-xs font-bold transition-all ${
              activeReportTab === 'conflicts'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Conflict Analytics</span>
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Export Report</span>
        </button>
      </div>

      {/* WORKLOAD TAB */}
      {activeReportTab === 'workload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Workload list & progress (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <h2 className="text-md font-bold text-slate-800 m-0">Faculty Workload Distribution</h2>
              </div>
              <span className="text-xs text-slate-400">Assigned periods vs. Adjusted limits</span>
            </div>

            <div className="p-5 space-y-6">
              {faculties.map(faculty => {
                const assigned = getAssignedHours(faculty.id);
                const limit = getFacultyWorkloadLimit(faculty.id, faculties, workloadRequests);
                const percent = limit > 0 ? Math.min(100, Math.round((assigned / limit) * 100)) : 0;

                // Determine health color
                let barColor = 'bg-indigo-600';
                let textColor = 'text-indigo-600';
                let statusLabel = 'Optimal';

                if (assigned > limit) {
                  barColor = 'bg-red-500';
                  textColor = 'text-red-500';
                  statusLabel = 'Overloaded';
                } else if (assigned < 4) {
                  barColor = 'bg-amber-500';
                  textColor = 'text-amber-500';
                  statusLabel = 'Underutilized';
                } else if (percent > 90) {
                  barColor = 'bg-emerald-500';
                  textColor = 'text-emerald-500';
                  statusLabel = 'At Capacity';
                }

                return (
                  <div key={faculty.id} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 space-y-1 sm:space-y-0">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">{faculty.name}</h3>
                        <p className="text-[10px] text-slate-400">{faculty.department} • Max Cap: {faculty.maxHours} hrs/week</p>
                      </div>
                      <div className="flex items-center space-x-3 text-right">
                        <div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            statusLabel === 'Overloaded' ? 'bg-red-50 text-red-700 border border-red-100' :
                            statusLabel === 'Underutilized' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}>
                            {statusLabel}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-800">{assigned}</span>
                          <span className="text-xs text-slate-400"> / {limit} hrs</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                      <div className={`h-full rounded-full transition-all duration-550 ${barColor}`} style={{ width: `${percent}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Utilization Rate: {percent}%</span>
                      {limit !== faculty.maxHours && (
                        <span className="text-indigo-600 font-bold">
                          Adjusted: {limit > faculty.maxHours ? `+${limit - faculty.maxHours}` : `${limit - faculty.maxHours}`} hrs approved
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workload Adjustment Requests Panel */}
          <div className="space-y-6">
            {/* Submit adjustment request */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sliders className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800 m-0">Propose Workload Change</h3>
                </div>
                {!isFormOpen && (
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="p-1 hover:bg-indigo-50 text-indigo-600 rounded border border-indigo-100 inline-flex"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isFormOpen && (
                <form onSubmit={handleAddWorkloadRequest} className="p-4 space-y-3 text-xs text-slate-700">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Select Faculty</label>
                    <select
                      value={reqFacultyId}
                      onChange={(e) => setReqFacultyId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-medium"
                    >
                      {faculties.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Type</label>
                      <select
                        value={reqType}
                        onChange={(e) => setReqType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-medium"
                      >
                        <option value="ADDITIONAL">Increase (+)</option>
                        <option value="REDUCTION">Decrease (-)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Amount (Hrs)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={reqProposedHours}
                        onChange={(e) => setReqProposedHours(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 font-semibold">Subject Context</label>
                    <select
                      value={reqSubjectId}
                      onChange={(e) => setReqSubjectId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-medium"
                    >
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Justification Reason</label>
                    <textarea
                      value={reqDesc}
                      onChange={(e) => setReqDesc(e.target.value)}
                      rows="2"
                      placeholder="Tutoring, remedial labs..."
                      className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-3 py-1.5 border border-slate-250 rounded text-slate-500 hover:bg-slate-50 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition shadow-sm"
                    >
                      Propose
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Workload Requests Registry Queue */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800 m-0">Workload Requests Queue</h3>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
                  {workloadRequests.length} total
                </span>
              </div>

              <div className="p-3 divide-y divide-slate-150 max-h-[300px] overflow-y-auto">
                {workloadRequests.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No workload requests found.</p>
                ) : (
                  workloadRequests.map(req => {
                    const fac = faculties.find(f => f.id === req.facultyId);
                    const isPlus = req.proposedHours > 0;
                    return (
                      <div key={req.id} className="py-3 first:pt-0 last:pb-0 text-xs">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-slate-800">{fac ? fac.name : req.facultyId}</p>
                            <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">{req.description}</p>
                          </div>
                          <div>
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                              isPlus ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isPlus ? `+${req.proposedHours}` : `${req.proposedHours}`} hrs
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            req.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>

                          <div className="flex items-center space-x-1.5">
                            {req.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleRequestStatus(req.id, 'Approved')}
                                  className="p-1 hover:bg-emerald-50 text-emerald-600 rounded border border-emerald-100"
                                  title="Approve Request"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleRequestStatus(req.id, 'Rejected')}
                                  className="p-1 hover:bg-red-50 text-red-500 rounded border border-red-100"
                                  title="Reject Request"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleRequestStatus(req.id, 'Pending')}
                                className="text-[10px] text-indigo-600 hover:underline font-bold"
                              >
                                Reset to Pending
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFLICT ANALYTICS TAB */}
      {activeReportTab === 'conflicts' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-indigo-600" />
              <h2 className="text-md font-bold text-slate-800 m-0">Comprehensive Schedule Conflict Report</h2>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              conflictReport.hasConflicts ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {conflictReport.hasConflicts ? `${activeConflicts.length} Conflict(s) Pending` : 'All Clean!'}
            </span>
          </div>

          <div className="p-5 space-y-4">
            {activeConflicts.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-md font-bold text-slate-700">Perfect Alignment Detected</h3>
                <p className="text-slate-400 text-xs mt-1">There are currently 0 resource scheduling clashes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeConflicts.map((c, idx) => {
                  // Determine smart resolution suggestions
                  let resolution = "Ensure you check the availability of teachers before scheduling.";
                  if (c.type === 'Faculty Double Booking') {
                    resolution = `Reassign one of the class sections to an alternate eligible faculty member for that subject, or reschedule one section to an alternative vacant period.`;
                  } else if (c.type === 'Class Double Booking') {
                    resolution = `Ensure periods are split evenly. Reschedule one subject's slots to an alternate period where the class is vacant.`;
                  } else if (c.type === 'Faculty Unavailability') {
                    resolution = `Update the availability grid for ${c.details?.facultyName || 'faculty'} in the Faculty Directory or shift this slot to a period when they are available.`;
                  } else if (c.type === 'Workload Limit Exceeded') {
                    resolution = `Submit and approve a Workload Request to increase ${c.details?.facultyName || 'faculty'}'s weekly hours limit, or re-assign some of their subject periods to another eligible teacher.`;
                  } else if (c.type === 'Room Conflict') {
                    resolution = `Update the room number of one of the colliding classes in the Class Registry to prevent room double-booking.`;
                  }

                  return (
                    <div key={idx} className="border border-slate-150 rounded-xl overflow-hidden shadow-sm">
                      <div className={`p-4 flex items-start space-x-3 ${
                        c.severity === 'Danger' ? 'bg-red-50/40 text-slate-800' : 'bg-amber-50/40 text-slate-800'
                      }`}>
                        <div className={`p-1.5 rounded ${c.severity === 'Danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              c.severity === 'Danger' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {c.type}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">• ID: {c.id}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-800 mt-1.5">{c.message}</p>
                        </div>
                      </div>

                      {/* Intelligent Resolution Suggestions Block */}
                      <div className="bg-slate-50 border-t border-slate-100 p-4 text-xs">
                        <span className="font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Recommended Resolution:</span>
                        <p className="text-slate-600 leading-relaxed font-medium">{resolution}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
