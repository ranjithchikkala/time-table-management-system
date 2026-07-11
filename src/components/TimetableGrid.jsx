import React, { useState } from 'react';
import {
  Calendar,
  User,
  HelpCircle,
  Plus,
  Check,
  X,
  Info,
  Clock,
  Shuffle
} from 'lucide-react';
import { DAYS, PERIODS } from '../utils/mockData.js';

export default function TimetableGrid({
  baseTimetable = [],
  temporaryTimetable = [],
  faculties = [],
  classes = [],
  subjects = [],
  temporaryRequests = [],
  setTemporaryRequests
}) {
  const [viewType, setViewType] = useState('class'); // class | faculty
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedFacultyId, setSelectedFacultyId] = useState(faculties[0]?.id || '');
  const [isTemporaryMode, setIsTemporaryMode] = useState(false); // view base or temp

  // Form states for submitting a new temporary request
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reqDay, setReqDay] = useState('Monday');
  const [reqPeriodId, setReqPeriodId] = useState(1);
  const [reqClassId, setReqClassId] = useState('');
  const [reqOrigFacId, setReqOrigFacId] = useState('');
  const [reqSubFacId, setReqSubFacId] = useState('');
  const [reqSubjId, setReqSubjId] = useState('');
  const [reqReason, setReqReason] = useState('');

  // Active timetable based on mode
  const activeTimetable = isTemporaryMode ? temporaryTimetable : baseTimetable;

  // Auto-populate form suggestions on change
  const handleClassChangeInForm = (cId) => {
    setReqClassId(cId);
    // Find active subjects for this class to make it easier to prefill original faculty
    const clsObj = classes.find(c => c.id === cId);
    if (clsObj && clsObj.subjects && clsObj.subjects.length > 0) {
      setReqSubjId(clsObj.subjects[0]);
      const subObj = subjects.find(s => s.id === clsObj.subjects[0]);
      if (subObj && subObj.eligibleFaculty && subObj.eligibleFaculty.length > 0) {
        setReqOrigFacId(subObj.eligibleFaculty[0]);
      }
    }
  };

  const handleSubjectChangeInForm = (sId) => {
    setReqSubjId(sId);
    const subObj = subjects.find(s => s.id === sId);
    if (subObj && subObj.eligibleFaculty && subObj.eligibleFaculty.length > 0) {
      setReqOrigFacId(subObj.eligibleFaculty[0]);
    }
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
    // Set initial defaults
    const defaultClsId = classes[0]?.id || '';
    handleClassChangeInForm(defaultClsId);
    setReqDay('Monday');
    setReqPeriodId(1);
    setReqReason('Attending official department workshop');

    // Choose a substitute faculty that isn't the original
    const otherFac = faculties.find(f => f.id !== reqOrigFacId);
    setReqSubFacId(otherFac?.id || faculties[0]?.id || '');
  };

  const handleAddRequest = (e) => {
    e.preventDefault();
    if (!reqClassId || !reqSubFacId || !reqOrigFacId || !reqSubjId) {
      return alert('Please fill in all substitution request fields.');
    }

    if (reqOrigFacId === reqSubFacId) {
      return alert('Original faculty and substitute faculty cannot be the same person.');
    }

    const newRequest = {
      id: 'TR_' + Math.floor(Math.random() * 100000),
      day: reqDay,
      periodId: Number(reqPeriodId),
      classId: reqClassId,
      originalFacultyId: reqOrigFacId,
      substituteFacultyId: reqSubFacId,
      subjectId: reqSubjId,
      status: 'Pending',
      reason: reqReason || 'Temporary substitution required'
    };

    setTemporaryRequests([...temporaryRequests, newRequest]);
    setIsFormOpen(false);
    setReqReason('');
  };

  const handleRequestStatus = (id, newStatus) => {
    setTemporaryRequests(
      temporaryRequests.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
  };

  // Find slot for a specific Day, Period ID and criteria
  const findGridSlot = (day, periodId) => {
    if (viewType === 'class') {
      return activeTimetable.find(
        slot => slot.day === day && slot.periodId === periodId && slot.classId === selectedClassId
      );
    } else {
      return activeTimetable.find(
        slot => slot.day === day && slot.periodId === periodId && slot.facultyId === selectedFacultyId
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* View Selectors and Mode Toggles */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Main Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewType('class')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewType === 'class'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Class-wise
            </button>
            <button
              onClick={() => setViewType('faculty')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewType === 'faculty'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Faculty-wise
            </button>
          </div>

          {/* Filter dropdown */}
          {viewType === 'class' ? (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Class:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.roomNumber})</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Faculty:</span>
              <select
                value={selectedFacultyId}
                onChange={(e) => setSelectedFacultyId(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {faculties.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Temporary Schedule Toggle */}
        <div className="flex items-center justify-end space-x-3">
          <label className="flex items-center space-x-2.5 cursor-pointer bg-slate-50 border border-slate-200 p-2 rounded-lg">
            <input
              type="checkbox"
              className="h-4.5 w-4.5 text-indigo-600 rounded border-slate-200 focus:ring-indigo-500"
              checked={isTemporaryMode}
              onChange={(e) => setIsTemporaryMode(e.target.checked)}
            />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-700 leading-none">Temporary Overlay</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Toggle substitution view</p>
            </div>
          </label>

          <button
            onClick={handleOpenForm}
            className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <Shuffle className="h-4 w-4" />
            <span>Request Substitute</span>
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Grid title */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <h2 className="text-md font-bold text-slate-800 m-0">
              {viewType === 'class' ? 'Class Timetable Grid' : 'Faculty Workload Matrix'}
              <span className="text-indigo-600 ml-1.5 font-semibold text-xs bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                {isTemporaryMode ? 'Temporary Overlay Active' : 'Regular Base Schedule'}
              </span>
            </h2>
          </div>
          <span className="text-xs text-slate-400">5 Days • 5 Periods / Day</span>
        </div>

        {/* Timetable Grid mapping */}
        <div className="p-5 overflow-x-auto">
          <div className="min-w-[800px] border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50/50">
            {/* Header: Periods */}
            <div className="grid grid-cols-6 text-center bg-slate-100 font-semibold border-b border-slate-200">
              <div className="py-4 text-xs uppercase tracking-wider text-slate-500 font-bold border-r border-slate-200">Days</div>
              {PERIODS.map(p => (
                <div key={p.id} className="py-2 border-r border-slate-200 last:border-r-0">
                  <p className="text-xs font-bold text-slate-700">{p.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.time}</p>
                </div>
              ))}
            </div>

            {/* Rows: Days */}
            {DAYS.map(day => (
              <div key={day} className="grid grid-cols-6 border-b border-slate-150 last:border-b-0 bg-white hover:bg-slate-50/20 transition">
                {/* Day label */}
                <div className="py-5 font-bold text-slate-700 border-r border-slate-200 bg-slate-50 flex items-center justify-center text-xs">
                  {day}
                </div>

                {/* Slots */}
                {PERIODS.map(period => {
                  const slot = findGridSlot(day, period.id);
                  const isTemp = slot?.isTemporary;

                  return (
                    <div
                      key={period.id}
                      className={`p-3.5 border-r border-slate-150 last:border-r-0 min-h-[100px] flex flex-col justify-between transition-all ${
                        isTemp
                          ? 'bg-amber-50/60 border-amber-200 text-amber-900 shadow-inner'
                          : slot
                            ? 'bg-indigo-50/10 hover:bg-indigo-50/30'
                            : 'bg-white'
                      }`}
                    >
                      {slot ? (
                        <>
                          <div className="space-y-1">
                            {/* Class ID / Room / Temporary Tag */}
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                isTemp
                                  ? 'bg-amber-200 text-amber-800 border border-amber-300'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {viewType === 'class'
                                  ? subjects.find(s => s.id === slot.subjectId)?.code || slot.subjectId
                                  : classes.find(c => c.id === slot.classId)?.name.split(' ').slice(0,2).join(' ') || slot.classId
                                }
                              </span>

                              {isTemp && (
                                <span className="inline-flex text-[9px] font-bold text-amber-700 uppercase bg-amber-100 px-1 rounded animate-pulse" title={slot.tempReason}>
                                  Temp
                                </span>
                              )}
                            </div>

                            {/* Main Title / Faculty Name */}
                            <p className="text-xs font-bold text-slate-800 truncate mt-1">
                              {viewType === 'class'
                                ? subjects.find(s => s.id === slot.subjectId)?.name || 'Subject'
                                : subjects.find(s => s.id === slot.subjectId)?.name || 'Subject'
                              }
                            </p>
                          </div>

                          {/* Footer Info: Faculty Name or Class Name + Room */}
                          <div className="pt-2 border-t border-slate-100/50 flex flex-col space-y-0.5 text-[10px] text-slate-500 font-medium">
                            <span className="flex items-center space-x-1 truncate text-slate-600">
                              <User className="h-3 w-3 inline shrink-0" />
                              <span>{faculties.find(f => f.id === slot.facultyId)?.name || slot.facultyId}</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold block">
                              {viewType === 'class' ? slot.roomNumber : `Room: ${slot.roomNumber}`}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-[10px] text-slate-300 font-medium italic select-none">
                          Unassigned
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Temporary Requests & Substitutions Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Substitution Request Form (Modal-like Inline) */}
        {isFormOpen && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:col-span-1">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 m-0">Substitution Request</h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-slate-200 text-slate-400 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddRequest} className="p-4 space-y-3.5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Target Day</label>
                  <select
                    value={reqDay}
                    onChange={(e) => setReqDay(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-medium"
                  >
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Period ID</label>
                  <select
                    value={reqPeriodId}
                    onChange={(e) => setReqPeriodId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-medium"
                  >
                    {PERIODS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.time})</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Target Class</label>
                <select
                  value={reqClassId}
                  onChange={(e) => handleClassChangeInForm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-medium"
                >
                  <option value="" disabled>-- Choose Class --</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {reqClassId && (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Class Subject</label>
                    <select
                      value={reqSubjId}
                      onChange={(e) => handleSubjectChangeInForm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-medium"
                    >
                      {/* Only list subjects active for this class */}
                      {(classes.find(c => c.id === reqClassId)?.subjects || []).map(sId => {
                        const sub = subjects.find(s => s.id === sId);
                        return <option key={sId} value={sId}>{sub ? sub.code : sId}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Original Faculty</label>
                    <select
                      value={reqOrigFacId}
                      onChange={(e) => setReqOrigFacId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-medium"
                    >
                      {/* Eligible faculty for this subject */}
                      {(subjects.find(s => s.id === reqSubjId)?.eligibleFaculty || []).map(fId => {
                        const fac = faculties.find(f => f.id === fId);
                        return <option key={fId} value={fId}>{fac ? fac.name : fId}</option>;
                      })}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Substitute Faculty</label>
                <select
                  value={reqSubFacId}
                  onChange={(e) => setReqSubFacId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg font-medium text-xs"
                >
                  {faculties.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Reason / Note</label>
                <textarea
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  rows="2"
                  className="w-full border border-slate-200 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Attending conference..."
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Temporary Requests Queue / Approval list */}
        <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:col-span-${isFormOpen ? '2' : '3'}`}>
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <h2 className="text-md font-bold text-slate-800 m-0">Temporary Timetable Requests Queue</h2>
            </div>
            <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-semibold">
              {temporaryRequests.filter(r => r.status === 'Pending').length} Pending
            </span>
          </div>

          <div className="p-5 overflow-x-auto">
            {temporaryRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No temporary schedule requests found. Use "Request Substitute" to add one.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-sm text-slate-600 min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-2.5">Schedule Slot</th>
                    <th className="px-4 py-2.5">Class & Subject</th>
                    <th className="px-4 py-2.5">Original → Substitute</th>
                    <th className="px-4 py-2.5">Reason</th>
                    <th className="px-4 py-2.5 text-center">Status</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {temporaryRequests.map(req => {
                    const clsObj = classes.find(c => c.id === req.classId);
                    const subjObj = subjects.find(s => s.id === req.subjectId);
                    const origFac = faculties.find(f => f.id === req.originalFacultyId);
                    const subFac = faculties.find(f => f.id === req.substituteFacultyId);

                    return (
                      <tr key={req.id} className="hover:bg-slate-50 transition text-xs">
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">{req.day}</p>
                          <p className="text-slate-400 text-[10px]">Period {req.periodId}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-700">{clsObj ? clsObj.name : req.classId}</p>
                          <p className="text-indigo-600 font-bold text-[10px]">{subjObj ? `${subjObj.name} (${subjObj.code})` : req.subjectId}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <span className="text-slate-500 line-through truncate max-w-[80px]" title={origFac?.name}>{origFac ? origFac.name.split(' ').pop() : req.originalFacultyId}</span>
                            <span className="text-slate-400">→</span>
                            <span className="text-emerald-700 font-bold truncate max-w-[80px]" title={subFac?.name}>{subFac ? subFac.name.split(' ').pop() : req.substituteFacultyId}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 italic text-slate-500 truncate max-w-[150px]" title={req.reason}>
                          {req.reason}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            req.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1">
                          {req.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => handleRequestStatus(req.id, 'Approved')}
                                className="p-1 hover:bg-emerald-50 text-emerald-600 rounded border border-emerald-100"
                                title="Approve Substitution"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleRequestStatus(req.id, 'Rejected')}
                                className="p-1 hover:bg-red-50 text-red-500 rounded border border-red-100"
                                title="Reject Substitution"
                              >
                                <X className="h-3.5 w-3.5" />
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
