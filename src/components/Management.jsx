import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Users,
  BookOpen,
  GraduationCap,
  CalendarDays
} from 'lucide-react';
import { DAYS, PERIODS } from '../utils/mockData.js';

export default function Management({
  faculties = [],
  setFaculties,
  subjects = [],
  setSubjects,
  classes = [],
  setClasses
}) {
  const [activeSubTab, setActiveSubTab] = useState('faculty'); // faculty | subject | class

  // Forms states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Faculty form fields
  const [facName, setFacName] = useState('');
  const [facEmail, setFacEmail] = useState('');
  const [facDept, setFacDept] = useState('');
  const [facJoining, setFacJoining] = useState('');
  const [facMaxHours, setFacMaxHours] = useState(16);
  const [facAvailability, setFacAvailability] = useState(() => {
    const initial = {};
    DAYS.forEach(day => {
      initial[day] = [1, 2, 3, 4, 5]; // default fully available
    });
    return initial;
  });

  // Subject form fields
  const [subCode, setSubCode] = useState('');
  const [subName, setSubName] = useState('');
  const [subDept, setSubDept] = useState('');
  const [subPeriods, setSubPeriods] = useState(3);
  const [subEligibleFac, setSubEligibleFac] = useState([]);

  // Class form fields
  const [clsName, setClsName] = useState('');
  const [clsDept, setClsDept] = useState('');
  const [clsSemester, setClsSemester] = useState('');
  const [clsRoom, setClsRoom] = useState('');
  const [clsSubjects, setClsSubjects] = useState([]);

  // Reset form states
  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);

    // reset faculty
    setFacName('');
    setFacEmail('');
    setFacDept('');
    setFacJoining('');
    setFacMaxHours(16);
    const initialAvailability = {};
    DAYS.forEach(day => {
      initialAvailability[day] = [1, 2, 3, 4, 5];
    });
    setFacAvailability(initialAvailability);

    // reset subject
    setSubCode('');
    setSubName('');
    setSubDept('');
    setSubPeriods(3);
    setSubEligibleFac([]);

    // reset class
    setClsName('');
    setClsDept('');
    setClsSemester('');
    setClsRoom('');
    setClsSubjects([]);
  };

  // Triggered when opening form to Add
  const handleAddNew = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Populate form fields for edit
  const handleEdit = (item) => {
    setEditingId(item.id);
    setIsFormOpen(true);

    if (activeSubTab === 'faculty') {
      setFacName(item.name);
      setFacEmail(item.email);
      setFacDept(item.department);
      setFacJoining(item.joiningDate || '');
      setFacMaxHours(item.maxHours);
      setFacAvailability(item.availability || {});
    } else if (activeSubTab === 'subject') {
      setSubCode(item.code);
      setSubName(item.name);
      setSubDept(item.department);
      setSubPeriods(item.weeklyPeriodsNeeded);
      setSubEligibleFac(item.eligibleFaculty || []);
    } else if (activeSubTab === 'class') {
      setClsName(item.name);
      setClsDept(item.department);
      setClsSemester(item.semester || '');
      setClsRoom(item.roomNumber);
      setClsSubjects(item.subjects || []);
    }
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeSubTab === 'faculty') {
      if (!facName || !facEmail || !facDept) return alert('Please fill in required fields.');

      if (editingId) {
        setFaculties(faculties.map(f => f.id === editingId ? {
          ...f, name: facName, email: facEmail, department: facDept, joiningDate: facJoining, maxHours: Number(facMaxHours), availability: facAvailability
        } : f));
      } else {
        const newFaculty = {
          id: 'F' + (faculties.length + 1) + '_' + Math.floor(Math.random()*1000),
          name: facName,
          email: facEmail,
          department: facDept,
          joiningDate: facJoining || new Date().toISOString().split('T')[0],
          maxHours: Number(facMaxHours),
          availability: facAvailability
        };
        setFaculties([...faculties, newFaculty]);
      }
    }

    else if (activeSubTab === 'subject') {
      if (!subCode || !subName || !subDept) return alert('Please fill in required fields.');

      if (editingId) {
        setSubjects(subjects.map(s => s.id === editingId ? {
          ...s, code: subCode, name: subName, department: subDept, weeklyPeriodsNeeded: Number(subPeriods), eligibleFaculty: subEligibleFac
        } : s));
      } else {
        const newSubject = {
          id: 'S' + (subjects.length + 1) + '_' + Math.floor(Math.random()*1000),
          code: subCode,
          name: subName,
          department: subDept,
          weeklyPeriodsNeeded: Number(subPeriods),
          eligibleFaculty: subEligibleFac
        };
        setSubjects([...subjects, newSubject]);
      }
    }

    else if (activeSubTab === 'class') {
      if (!clsName || !clsRoom) return alert('Please fill in required fields.');

      if (editingId) {
        setClasses(classes.map(c => c.id === editingId ? {
          ...c, name: clsName, department: clsDept, semester: clsSemester, roomNumber: clsRoom, subjects: clsSubjects
        } : c));
      } else {
        const newClass = {
          id: 'C' + (classes.length + 1) + '_' + Math.floor(Math.random()*1000),
          name: clsName,
          department: clsDept,
          semester: clsSemester,
          roomNumber: clsRoom,
          subjects: clsSubjects
        };
        setClasses([...classes, newClass]);
      }
    }

    resetForm();
  };

  // Delete Handlers
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this item? This may affect the current timetable!')) return;

    if (activeSubTab === 'faculty') {
      setFaculties(faculties.filter(f => f.id !== id));
    } else if (activeSubTab === 'subject') {
      setSubjects(subjects.filter(s => s.id !== id));
    } else if (activeSubTab === 'class') {
      setClasses(classes.filter(c => c.id !== id));
    }
  };

  // Toggle single period availability
  const toggleAvailability = (day, periodId) => {
    const current = facAvailability[day] || [];
    let updated;
    if (current.includes(periodId)) {
      updated = current.filter(p => p !== periodId);
    } else {
      updated = [...current, periodId].sort();
    }
    setFacAvailability({
      ...facAvailability,
      [day]: updated
    });
  };

  // Toggle eligible faculty for subjects
  const toggleEligibleFaculty = (facId) => {
    if (subEligibleFac.includes(facId)) {
      setSubEligibleFac(subEligibleFac.filter(id => id !== facId));
    } else {
      setSubEligibleFac([...subEligibleFac, facId]);
    }
  };

  // Toggle subjects for class
  const toggleClassSubject = (subId) => {
    if (clsSubjects.includes(subId)) {
      setClsSubjects(clsSubjects.filter(id => id !== subId));
    } else {
      setClsSubjects([...clsSubjects, subId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm space-x-2">
        <button
          onClick={() => { setActiveSubTab('faculty'); resetForm(); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeSubTab === 'faculty'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Faculty Directory</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('subject'); resetForm(); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeSubTab === 'subject'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Subject Registry</span>
        </button>
        <button
          onClick={() => { setActiveSubTab('class'); resetForm(); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeSubTab === 'class'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Class Registry</span>
        </button>
      </div>

      {/* Main List & Form area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left/Middle Column: Table List (Takes 2 columns if form is open, otherwise 3) */}
        <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-${isFormOpen ? '2' : '3'}`}>
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 m-0">
              {activeSubTab === 'faculty' && 'Faculty Members'}
              {activeSubTab === 'subject' && 'Academic Subjects'}
              {activeSubTab === 'class' && 'Assigned Classes'}
            </h2>
            {!isFormOpen && (
              <button
                onClick={handleAddNew}
                className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add {activeSubTab === 'faculty' ? 'Faculty' : activeSubTab === 'subject' ? 'Subject' : 'Class'}</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            {activeSubTab === 'faculty' && (
              <table className="w-full text-left border-collapse text-sm text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-500">
                    <th className="px-5 py-3">Faculty Name</th>
                    <th className="px-5 py-3">Email & Dept</th>
                    <th className="px-5 py-3 text-center">Weekly Max</th>
                    <th className="px-5 py-3 text-center">Availability</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {faculties.map((f) => {
                    const totalAvailable = Object.values(f.availability || {}).reduce((acc, cur) => acc + cur.length, 0);
                    return (
                      <tr key={f.id} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-slate-800">{f.name}</p>
                          <p className="text-xs text-slate-400">ID: {f.id} • Joined: {f.joiningDate || 'N/A'}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p>{f.email}</p>
                          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{f.department}</p>
                        </td>
                        <td className="px-5 py-3.5 text-center font-bold text-slate-700">{f.maxHours} hrs</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                            {totalAvailable} slots / 25
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <button onClick={() => handleEdit(f)} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-md transition inline-flex">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(f.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition inline-flex">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {activeSubTab === 'subject' && (
              <table className="w-full text-left border-collapse text-sm text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-500">
                    <th className="px-5 py-3">Code & Name</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3 text-center">Periods/Week</th>
                    <th className="px-5 py-3 text-center">Eligible Faculty</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5">
                        <span className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold font-mono px-2 py-0.5 rounded mr-2">
                          {s.code}
                        </span>
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        <p className="text-xs text-slate-400 mt-1">ID: {s.id}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">{s.department}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-700">{s.weeklyPeriodsNeeded}</td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex flex-wrap justify-center gap-1">
                          {(s.eligibleFaculty || []).map(fId => {
                            const fac = faculties.find(f => f.id === fId);
                            return (
                              <span key={fId} className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded" title={fac?.name}>
                                {fac ? fac.name.split(' ').pop() : fId}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button onClick={() => handleEdit(s)} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-md transition inline-flex">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition inline-flex">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeSubTab === 'class' && (
              <table className="w-full text-left border-collapse text-sm text-slate-600">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-500">
                    <th className="px-5 py-3">Class Name</th>
                    <th className="px-5 py-3">Semester & Room</th>
                    <th className="px-5 py-3">Enrolled Subjects</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400">ID: {c.id} • Dept: {c.department || 'N/A'}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-700">{c.semester || 'N/A'}</p>
                        <p className="text-xs font-semibold text-emerald-600">{c.roomNumber}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {(c.subjects || []).map(subId => {
                            const sub = subjects.find(s => s.id === subId);
                            return (
                              <span key={subId} className="bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded" title={sub?.name}>
                                {sub ? sub.code : subId}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button onClick={() => handleEdit(c)} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-md transition inline-flex">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition inline-flex">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Inline Editor Form (Only visible when isFormOpen) */}
        {isFormOpen && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-md font-bold text-slate-800 m-0">
                {editingId ? 'Edit Record' : 'Add New Record'}
              </h3>
              <button onClick={resetForm} className="p-1.5 hover:bg-slate-150 text-slate-400 hover:text-slate-600 rounded-md">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-sm text-slate-700">
              {/* Faculty Form */}
              {activeSubTab === 'faculty' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={facName}
                      onChange={(e) => setFacName(e.target.value)}
                      placeholder="Dr. Grace Hopper"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={facEmail}
                      onChange={(e) => setFacEmail(e.target.value)}
                      placeholder="grace@university.edu"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Department *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={facDept}
                      onChange={(e) => setFacDept(e.target.value)}
                      placeholder="Computer Science"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Joining Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={facJoining}
                        onChange={(e) => setFacJoining(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Weekly Cap (Hrs) *</label>
                      <input
                        type="number"
                        min="1"
                        max="40"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={facMaxHours}
                        onChange={(e) => setFacMaxHours(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Availability Grid Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1">
                      <CalendarDays className="h-4 w-4 text-slate-500" />
                      <span>Availability Slots</span>
                    </label>
                    <div className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/50 p-2.5 space-y-2">
                      <div className="grid grid-cols-6 text-[10px] font-bold text-slate-400 text-center border-b border-slate-100 pb-1">
                        <div>Day</div>
                        <div>P1</div>
                        <div>P2</div>
                        <div>P3</div>
                        <div>P4</div>
                        <div>P5</div>
                      </div>
                      {DAYS.map(day => {
                        const available = facAvailability[day] || [];
                        return (
                          <div key={day} className="grid grid-cols-6 items-center text-center">
                            <span className="text-[10px] font-semibold text-slate-500 text-left truncate">{day.slice(0, 3)}</span>
                            {PERIODS.map(p => {
                              const isChecked = available.includes(p.id);
                              return (
                                <button
                                  type="button"
                                  key={p.id}
                                  onClick={() => toggleAvailability(day, p.id)}
                                  className={`mx-auto h-5 w-5 rounded flex items-center justify-center transition border ${
                                    isChecked
                                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                                      : 'bg-white border-slate-200 hover:border-slate-350 text-slate-300'
                                  }`}
                                >
                                  {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Subject Form */}
              {activeSubTab === 'subject' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Subject Code *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                      value={subCode}
                      onChange={(e) => setSubCode(e.target.value)}
                      placeholder="CS-101"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Subject Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      placeholder="Data Structures"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Department *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={subDept}
                      onChange={(e) => setSubDept(e.target.value)}
                      placeholder="Computer Science"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Weekly Periods Needed *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={subPeriods}
                      onChange={(e) => setSubPeriods(e.target.value)}
                      required
                    />
                  </div>
                  {/* Eligible Faculty Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Eligible Faculty *</label>
                    <div className="border border-slate-200 rounded-lg p-2.5 max-h-[160px] overflow-y-auto space-y-1.5 bg-slate-50/50">
                      {faculties.map(fac => {
                        const isChecked = subEligibleFac.includes(fac.id);
                        return (
                          <label key={fac.id} className="flex items-center space-x-2.5 cursor-pointer hover:bg-white p-1 rounded transition">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 rounded border-slate-200 focus:ring-indigo-500"
                              checked={isChecked}
                              onChange={() => toggleEligibleFaculty(fac.id)}
                            />
                            <span className="text-slate-700 font-medium">{fac.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Class Form */}
              {activeSubTab === 'class' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Class Name *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={clsName}
                      onChange={(e) => setClsName(e.target.value)}
                      placeholder="Year 1 CSE - Sec A"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Department *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={clsDept}
                      onChange={(e) => setClsDept(e.target.value)}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Semester</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={clsSemester}
                        onChange={(e) => setClsSemester(e.target.value)}
                        placeholder="Semester I"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Room Number *</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={clsRoom}
                        onChange={(e) => setClsRoom(e.target.value)}
                        placeholder="Room 301"
                        required
                      />
                    </div>
                  </div>
                  {/* Select Enrolled Subjects */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Required Subjects</label>
                    <div className="border border-slate-200 rounded-lg p-2.5 max-h-[160px] overflow-y-auto space-y-1.5 bg-slate-50/50">
                      {subjects.map(sub => {
                        const isChecked = clsSubjects.includes(sub.id);
                        return (
                          <label key={sub.id} className="flex items-center space-x-2.5 cursor-pointer hover:bg-white p-1 rounded transition">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 rounded border-slate-200 focus:ring-indigo-500"
                              checked={isChecked}
                              onChange={() => toggleClassSubject(sub.id)}
                            />
                            <span className="text-slate-700 font-medium">
                              <span className="font-mono text-xs text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded mr-1.5">{sub.code}</span>
                              {sub.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
