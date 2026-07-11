// Simple verification test script for our Scheduling Engine
import { generateTimetable, generateTemporaryTimetable, detectConflicts } from './scheduler.js';
import { initialFaculties, initialSubjects, initialClasses, initialWorkloadRequests, initialTemporaryRequests } from './mockData.js';

console.log('--- RUNNING SCHEDULER UNIT VERIFICATION TEST ---');

try {
  // Test 1: Base Timetable Generation
  console.log('Test 1: Generating base timetable...');
  const timetable = generateTimetable(initialFaculties, initialSubjects, initialClasses, initialWorkloadRequests);
  console.log(`Generated ${timetable.length} slots successfully.`);

  if (timetable.length === 0) {
    throw new Error('Timetable is empty!');
  }

  // Print first few slots
  console.log('Sample generated slots:');
  timetable.slice(0, 3).forEach((s, idx) => {
    console.log(`  Slot ${idx+1}: Class ${s.classId}, Subject ${s.subjectId}, Faculty ${s.facultyId}, Day ${s.day}, Period ${s.periodId}`);
  });

  // Test 2: Conflict Detection on Base Timetable
  console.log('\nTest 2: Detecting conflicts in base timetable...');
  const conflictReport = detectConflicts(timetable, initialFaculties, initialClasses, initialSubjects, initialWorkloadRequests);
  console.log(`Found ${conflictReport.conflicts.length} conflicts.`);
  conflictReport.conflicts.forEach(c => {
    console.log(`  [${c.severity}] - ${c.type}: ${c.message}`);
  });

  // Test 3: Temporary Timetable Generation
  console.log('\nTest 3: Generating temporary timetable...');
  const tempTimetable = generateTemporaryTimetable(timetable, initialTemporaryRequests, initialFaculties);
  const tempSlotsCount = tempTimetable.filter(s => s.isTemporary).length;
  console.log(`Generated temporary timetable. Overlaid temporary/substituted slots count: ${tempSlotsCount}`);

  // Test 4: Conflict Detection on Temporary Timetable
  console.log('\nTest 4: Detecting conflicts in temporary timetable...');
  const tempConflictReport = detectConflicts(tempTimetable, initialFaculties, initialClasses, initialSubjects, initialWorkloadRequests);
  console.log(`Found ${tempConflictReport.conflicts.length} conflicts in temporary timetable.`);

  console.log('\n--- SCHEDULER UNIT VERIFICATION COMPLETE: ALL SUCCESSFUL ---');
} catch (error) {
  console.error('--- SCHEDULER UNIT VERIFICATION FAILED ---');
  console.error(error);
  process.exit(1);
}
