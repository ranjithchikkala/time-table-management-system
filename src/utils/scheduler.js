import { DAYS, PERIODS } from './mockData.js';

/**
 * Calculates the active workload limit for a faculty member including approved workload requests.
 */
export function getFacultyWorkloadLimit(facultyId, faculties, workloadAdjustments = []) {
  const faculty = faculties.find(f => f.id === facultyId);
  if (!faculty) return 0;

  let limit = faculty.maxHours;
  workloadAdjustments.forEach(req => {
    if (req.facultyId === facultyId && req.status === 'Approved') {
      limit += Number(req.proposedHours);
    }
  });
  return Math.max(0, limit);
}

/**
 * Generates an optimized timetable grid based on constraints, availability, and workloads.
 * Uses a heuristic penalty-based slot finder to optimize placements.
 */
export function generateTimetable(faculties, subjects, classes, workloadAdjustments = []) {
  const timetable = []; // array of { day, periodId, classId, subjectId, facultyId, roomNumber }

  // Map to track assigned hours per faculty during generation
  const assignedHours = {};
  faculties.forEach(f => {
    assignedHours[f.id] = 0;
  });

  // Calculate workloads limits for all faculties
  const facultyLimits = {};
  faculties.forEach(f => {
    facultyLimits[f.id] = getFacultyWorkloadLimit(f.id, faculties, workloadAdjustments);
  });

  // To distribute subjects well, let's process classes one by one
  classes.forEach(cls => {
    const classSubjects = cls.subjects || [];

    classSubjects.forEach(subjectId => {
      const subject = subjects.find(s => s.id === subjectId);
      if (!subject) return;

      const neededPeriods = subject.weeklyPeriodsNeeded || 3;
      const eligibleFacIds = subject.eligibleFaculty || [];

      // We need to schedule 'neededPeriods' slots for this subject in this class
      for (let p = 0; p < neededPeriods; p++) {
        let bestSlot = null;
        let lowestPenalty = Infinity;
        let selectedFacultyId = null;

        // Iterate through eligible faculty members
        eligibleFacIds.forEach(facId => {
          const faculty = faculties.find(f => f.id === facId);
          if (!faculty) return;

          const limit = facultyLimits[facId] || 0;
          const currentHours = assignedHours[facId] || 0;

          // Test all possible days and period slots
          DAYS.forEach(day => {
            PERIODS.forEach(period => {
              let penalty = 0;

              // Check if class already has a lecture in this slot
              const isClassBusy = timetable.some(
                slot => slot.classId === cls.id && slot.day === day && slot.periodId === period.id
              );
              if (isClassBusy) {
                penalty += 10000; // Extremely high penalty, avoid scheduling twice for same class in same period
              }

              // Check if faculty is available
              const isAvailable = faculty.availability &&
                                  faculty.availability[day] &&
                                  faculty.availability[day].includes(period.id);
              if (!isAvailable) {
                penalty += 100; // Unavailable penalty
              }

              // Check if faculty is already teaching in another class in this slot
              const isFacultyBusy = timetable.some(
                slot => slot.facultyId === facId && slot.day === day && slot.periodId === period.id
              );
              if (isFacultyBusy) {
                penalty += 500; // Double-booking penalty
              }

              // Check if faculty exceeds workload limit
              if (currentHours >= limit) {
                penalty += 50; // Workload limit exceeded penalty
              }

              // Check how many times this subject is already scheduled on this day (prefer even distribution)
              const sameDayCount = timetable.filter(
                slot => slot.classId === cls.id && slot.subjectId === subjectId && slot.day === day
              ).length;
              penalty += sameDayCount * 5; // Prefer placing on different days

              if (penalty < lowestPenalty) {
                lowestPenalty = penalty;
                bestSlot = { day, periodId: period.id, classId: cls.id, subjectId, roomNumber: cls.roomNumber };
                selectedFacultyId = facId;
              }
            });
          });
        });

        // Assign the best slot found
        if (bestSlot && selectedFacultyId) {
          bestSlot.facultyId = selectedFacultyId;
          timetable.push(bestSlot);
          assignedHours[selectedFacultyId] = (assignedHours[selectedFacultyId] || 0) + 1;
        }
      }
    });
  });

  return timetable;
}

/**
 * Generates a temporary timetable by overlaying approved temporary substitution requests.
 */
export function generateTemporaryTimetable(baseTimetable, temporaryRequests = [], faculties = []) {
  // Create a deep copy of the base timetable
  const tempTimetable = baseTimetable.map(slot => ({ ...slot }));

  temporaryRequests.forEach(req => {
    if (req.status !== 'Approved') return;

    // Find if a matching slot exists in the base timetable
    const slotIndex = tempTimetable.findIndex(
      slot => slot.day === req.day &&
              slot.periodId === req.periodId &&
              slot.classId === req.classId
    );

    if (slotIndex !== -1) {
      // Overlay the substitute faculty and update the subject if specified
      tempTimetable[slotIndex].facultyId = req.substituteFacultyId;
      if (req.subjectId) {
        tempTimetable[slotIndex].subjectId = req.subjectId;
      }
      tempTimetable[slotIndex].isTemporary = true;
      tempTimetable[slotIndex].tempReason = req.reason;
    } else {
      // If no slot exists in base, we can optionally create one if it is a valid request
      tempTimetable.push({
        day: req.day,
        periodId: req.periodId,
        classId: req.classId,
        subjectId: req.subjectId,
        facultyId: req.substituteFacultyId,
        roomNumber: 'TBD',
        isTemporary: true,
        tempReason: req.reason
      });
    }
  });

  return tempTimetable;
}

/**
 * Detects and reports all conflicts in a given timetable state.
 * Returns { hasConflicts: boolean, conflicts: Array<{ type, severity, message, details }> }
 */
export function detectConflicts(timetable, faculties, classes, subjects, workloadAdjustments = []) {
  const conflicts = [];

  // 1. Calculate active limits and track assigned periods
  const facultyLimits = {};
  const facultyAssignedHours = {};

  faculties.forEach(f => {
    facultyLimits[f.id] = getFacultyWorkloadLimit(f.id, faculties, workloadAdjustments);
    facultyAssignedHours[f.id] = 0;
  });

  // To check double-bookings, we can map slots:
  // facultyBusyMap[facultyId][day][periodId] = [list of classes assigned]
  // classBusyMap[classId][day][periodId] = [list of subjects assigned]
  // roomBusyMap[roomNumber][day][periodId] = [list of classes assigned]
  const facultyBusyMap = {};
  const classBusyMap = {};
  const roomBusyMap = {};

  timetable.forEach(slot => {
    const { day, periodId, classId, subjectId, facultyId, roomNumber } = slot;

    // Increment assigned hours for the faculty
    if (facultyId) {
      facultyAssignedHours[facultyId] = (facultyAssignedHours[facultyId] || 0) + 1;
    }

    // Initialize map keys if not present
    if (!facultyBusyMap[facultyId]) facultyBusyMap[facultyId] = {};
    if (!facultyBusyMap[facultyId][day]) facultyBusyMap[facultyId][day] = {};
    if (!facultyBusyMap[facultyId][day][periodId]) facultyBusyMap[facultyId][day][periodId] = [];

    if (!classBusyMap[classId]) classBusyMap[classId] = {};
    if (!classBusyMap[classId][day]) classBusyMap[classId][day] = {};
    if (!classBusyMap[classId][day][periodId]) classBusyMap[classId][day][periodId] = [];

    if (roomNumber) {
      if (!roomBusyMap[roomNumber]) roomBusyMap[roomNumber] = {};
      if (!roomBusyMap[roomNumber][day]) roomBusyMap[roomNumber][day] = {};
      if (!roomBusyMap[roomNumber][day][periodId]) roomBusyMap[roomNumber][day][periodId] = [];
    }

    // Add to maps
    facultyBusyMap[facultyId][day][periodId].push({ classId, subjectId });
    classBusyMap[classId][day][periodId].push({ facultyId, subjectId });
    if (roomNumber && roomNumber !== 'TBD') {
      roomBusyMap[roomNumber][day][periodId].push({ classId, facultyId });
    }

    // Check if faculty is available for this assigned slot
    const facultyObj = faculties.find(f => f.id === facultyId);
    if (facultyObj) {
      const availablePeriods = (facultyObj.availability && facultyObj.availability[day]) || [];
      if (!availablePeriods.includes(periodId)) {
        conflicts.push({
          id: `C_AV_${facultyId}_${day}_${periodId}`,
          type: 'Faculty Unavailability',
          severity: 'Warning',
          message: `${facultyObj.name} is scheduled on ${day}, Period ${periodId} but is marked as Unavailable.`,
          details: { facultyId, facultyName: facultyObj.name, day, periodId, classId }
        });
      }
    }
  });

  // 2. Check for Faculty Double Bookings
  Object.keys(facultyBusyMap).forEach(facId => {
    const facultyObj = faculties.find(f => f.id === facId);
    const facultyName = facultyObj ? facultyObj.name : facId;

    Object.keys(facultyBusyMap[facId]).forEach(day => {
      Object.keys(facultyBusyMap[facId][day]).forEach(periodId => {
        const slots = facultyBusyMap[facId][day][periodId];
        if (slots.length > 1) {
          const classNames = slots.map(s => {
            const clsObj = classes.find(c => c.id === s.classId);
            return clsObj ? clsObj.name : s.classId;
          }).join(' and ');

          conflicts.push({
            id: `C_FAC_DB_${facId}_${day}_${periodId}`,
            type: 'Faculty Double Booking',
            severity: 'Danger',
            message: `Faculty ${facultyName} is double-booked on ${day}, Period ${periodId} in: ${classNames}.`,
            details: { facultyId: facId, facultyName, day, periodId: Number(periodId), slots }
          });
        }
      });
    });
  });

  // 3. Check for Class Double Bookings
  Object.keys(classBusyMap).forEach(classId => {
    const classObj = classes.find(c => c.id === classId);
    const className = classObj ? classObj.name : classId;

    Object.keys(classBusyMap[classId]).forEach(day => {
      Object.keys(classBusyMap[classId][day]).forEach(periodId => {
        const slots = classBusyMap[classId][day][periodId];
        if (slots.length > 1) {
          const subjectNames = slots.map(s => {
            const subObj = subjects.find(sub => sub.id === s.subjectId);
            return subObj ? `${subObj.name} (${subObj.code})` : s.subjectId;
          }).join(' and ');

          conflicts.push({
            id: `C_CLS_DB_${classId}_${day}_${periodId}`,
            type: 'Class Double Booking',
            severity: 'Danger',
            message: `Class ${className} has multiple subjects scheduled on ${day}, Period ${periodId}: ${subjectNames}.`,
            details: { classId, className, day, periodId: Number(periodId), slots }
          });
        }
      });
    });
  });

  // 4. Check for Room Double Bookings
  Object.keys(roomBusyMap).forEach(room => {
    Object.keys(roomBusyMap[room]).forEach(day => {
      Object.keys(roomBusyMap[room][day]).forEach(periodId => {
        const slots = roomBusyMap[room][day][periodId];
        if (slots.length > 1) {
          const classNames = slots.map(s => {
            const clsObj = classes.find(c => c.id === s.classId);
            return clsObj ? clsObj.name : s.classId;
          }).join(' and ');

          conflicts.push({
            id: `C_RM_DB_${room}_${day}_${periodId}`,
            type: 'Room Conflict',
            severity: 'Danger',
            message: `Room ${room} is double-booked on ${day}, Period ${periodId} for: ${classNames}.`,
            details: { room, day, periodId: Number(periodId), slots }
          });
        }
      });
    });
  });

  // 5. Check Workload Limit Violations
  faculties.forEach(faculty => {
    const limit = facultyLimits[faculty.id] || 0;
    const assigned = facultyAssignedHours[faculty.id] || 0;
    if (assigned > limit) {
      conflicts.push({
        id: `C_WL_${faculty.id}`,
        type: 'Workload Limit Exceeded',
        severity: 'Warning',
        message: `${faculty.name} is assigned ${assigned} periods, exceeding their active workload limit of ${limit} periods/week.`,
        details: { facultyId: faculty.id, facultyName: faculty.name, assigned, limit }
      });
    }
  });

  return {
    hasConflicts: conflicts.length > 0,
    conflicts
  };
}
