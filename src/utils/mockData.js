// Mock Data definitions for the Timetable Management System

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const PERIODS = [
  { id: 1, name: 'Period 1', time: '09:00 - 10:00' },
  { id: 2, name: 'Period 2', time: '10:00 - 11:00' },
  { id: 3, name: 'Period 3', time: '11:15 - 12:15' },
  { id: 4, name: 'Period 4', time: '13:15 - 14:15' },
  { id: 5, name: 'Period 5', time: '14:15 - 15:15' }
];

export const initialFaculties = [
  {
    id: 'F1',
    name: 'Dr. Alan Turing',
    email: 'alan.turing@university.edu',
    department: 'Computer Science',
    joiningDate: '2018-08-15',
    maxHours: 16, // Maximum periods per week
    // Availability mapping: Day -> array of Period IDs available
    availability: {
      'Monday': [1, 2, 3, 4, 5],
      'Tuesday': [1, 2, 3],
      'Wednesday': [1, 2, 3, 4, 5],
      'Thursday': [4, 5],
      'Friday': [1, 2, 3, 4, 5]
    }
  },
  {
    id: 'F2',
    name: 'Dr. Grace Hopper',
    email: 'grace.hopper@university.edu',
    department: 'Computer Science',
    joiningDate: '2019-01-10',
    maxHours: 14,
    availability: {
      'Monday': [3, 4, 5],
      'Tuesday': [1, 2, 3, 4, 5],
      'Wednesday': [1, 2, 3],
      'Thursday': [1, 2, 3, 4, 5],
      'Friday': [1, 2, 3]
    }
  },
  {
    id: 'F3',
    name: 'Prof. Richard Feynman',
    email: 'richard.feynman@university.edu',
    department: 'Physics & ECE',
    joiningDate: '2015-07-20',
    maxHours: 12,
    availability: {
      'Monday': [1, 2, 3, 4, 5],
      'Tuesday': [4, 5],
      'Wednesday': [1, 2, 3, 4, 5],
      'Thursday': [1, 2, 3],
      'Friday': [4, 5]
    }
  },
  {
    id: 'F4',
    name: 'Dr. Ada Lovelace',
    email: 'ada.lovelace@university.edu',
    department: 'Computer Science',
    joiningDate: '2020-09-01',
    maxHours: 15,
    availability: {
      'Monday': [1, 2, 4, 5],
      'Tuesday': [1, 2, 4, 5],
      'Wednesday': [2, 3, 4, 5],
      'Thursday': [1, 2, 3, 4, 5],
      'Friday': [1, 2, 3, 4, 5]
    }
  },
  {
    id: 'F5',
    name: 'Prof. Marie Curie',
    email: 'marie.curie@university.edu',
    department: 'Physics & ECE',
    joiningDate: '2017-03-12',
    maxHours: 12,
    availability: {
      'Monday': [1, 2, 3],
      'Tuesday': [1, 2, 3],
      'Wednesday': [4, 5],
      'Thursday': [1, 2, 3, 4, 5],
      'Friday': [1, 2, 3, 4, 5]
    }
  }
];

export const initialSubjects = [
  {
    id: 'S1',
    code: 'CS-101',
    name: 'Data Structures & Algorithms',
    department: 'Computer Science',
    weeklyPeriodsNeeded: 4,
    eligibleFaculty: ['F1', 'F2', 'F4']
  },
  {
    id: 'S2',
    code: 'CS-202',
    name: 'Operating Systems',
    department: 'Computer Science',
    weeklyPeriodsNeeded: 3,
    eligibleFaculty: ['F1', 'F2', 'F4']
  },
  {
    id: 'S3',
    code: 'EC-101',
    name: 'Digital Electronics',
    department: 'Physics & ECE',
    weeklyPeriodsNeeded: 3,
    eligibleFaculty: ['F3', 'F5']
  },
  {
    id: 'S4',
    code: 'CS-303',
    name: 'Database Management Systems',
    department: 'Computer Science',
    weeklyPeriodsNeeded: 4,
    eligibleFaculty: ['F2', 'F4']
  },
  {
    id: 'S5',
    code: 'PH-101',
    name: 'Quantum Physics',
    department: 'Physics & ECE',
    weeklyPeriodsNeeded: 3,
    eligibleFaculty: ['F3', 'F5']
  },
  {
    id: 'S6',
    code: 'CS-404',
    name: 'Compiler Design',
    department: 'Computer Science',
    weeklyPeriodsNeeded: 3,
    eligibleFaculty: ['F1', 'F4']
  }
];

export const initialClasses = [
  {
    id: 'C1',
    name: 'Year 1 CSE - Sec A',
    department: 'Computer Science',
    semester: 'Semester I',
    roomNumber: 'Room 301',
    // Subject requirements for this class (subjectId -> frequency)
    subjects: ['S1', 'S3', 'S5']
  },
  {
    id: 'C2',
    name: 'Year 2 CSE - Sec B',
    department: 'Computer Science',
    semester: 'Semester III',
    roomNumber: 'Room 302',
    subjects: ['S2', 'S4', 'S1']
  },
  {
    id: 'C3',
    name: 'Year 1 ECE - Sec A',
    department: 'Physics & ECE',
    semester: 'Semester I',
    roomNumber: 'Room 401',
    subjects: ['S3', 'S5', 'S2']
  }
];

export const initialWorkloadRequests = [
  {
    id: 'WR1',
    facultyId: 'F1',
    subjectId: 'S1',
    proposedHours: 2, // requesting additional 2 hours/periods for tutoring/remedial
    type: 'ADDITIONAL', // ADDITIONAL or REDUCTION
    status: 'Approved', // Pending, Approved, Rejected
    description: 'Extra doubt clearing sessions for Year 1 CSE'
  },
  {
    id: 'WR2',
    facultyId: 'F3',
    subjectId: 'S5',
    proposedHours: 1,
    type: 'ADDITIONAL',
    status: 'Pending',
    description: 'Quantum Mechanics laboratory prep hour'
  },
  {
    id: 'WR3',
    facultyId: 'F2',
    subjectId: 'S4',
    proposedHours: -1, // requesting workload reduction
    type: 'REDUCTION',
    status: 'Pending',
    description: 'Personal medical reasons - reduction requested'
  }
];

export const initialTemporaryRequests = [
  {
    id: 'TR1',
    day: 'Monday',
    periodId: 1,
    classId: 'C1',
    originalFacultyId: 'F1', // Alan Turing
    substituteFacultyId: 'F4', // Ada Lovelace
    subjectId: 'S1',
    status: 'Approved', // Pending, Approved, Rejected
    reason: 'Dr. Alan Turing attending an academic conference'
  },
  {
    id: 'TR2',
    day: 'Wednesday',
    periodId: 3,
    classId: 'C2',
    originalFacultyId: 'F2', // Grace Hopper
    substituteFacultyId: 'F1', // Alan Turing
    subjectId: 'S4',
    status: 'Pending',
    reason: 'Dr. Grace Hopper has a short medical appointment'
  }
];
