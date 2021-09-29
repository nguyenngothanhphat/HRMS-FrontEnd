import moment from 'moment';

const mockMyTimeSheetData = [
  {
    _id: 1,
    day: moment(),
    activity: 'Working hours',
    timeIn: '10:30 am',
    timeOut: '10:30 am',
    nightshift: false,
    totalHours: '02:30:00',
    notes:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint non deserunt ullamco est sit aliqua dolor do amet sint ',
  },
  {
    _id: 2,
    day: moment(),
    activity: 'Lunch Break',
    timeIn: '10:30 am',
    timeOut: '10:30 am',
    nightshift: false,
    totalHours: '02:30:00',
    notes: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor',
  },
  {
    _id: 3,
    day: moment(),
    activity: 'PTO',
    timeIn: '10:30 am',
    timeOut: '10:30 am',
    nightshift: false,
    totalHours: '02:30:00',
    notes:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint non deserunt ullamco est sit aliqua dolor do amet sint ',
  },
  {
    _id: 4,
    day: moment().add(1, 'days'),
    activity: 'Working hours',
    timeIn: '10:30 am',
    timeOut: '10:30 am',
    nightshift: false,
    totalHours: '02:30:00',
    notes: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint non',
  },
  {
    _id: 5,
    day: moment().add(3, 'days'),
    activity: 'Working hours',
    timeIn: '10:30 am',
    timeOut: '10:30 am',
    nightshift: false,
    totalHours: '02:30:00',
    notes:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint non deserunt ullamco est sit aliqua dolor do amet sint ',
  },
];

const mockManagerTimeSheetData = [
  {
    _id: 1,
    employeeName: 'Bessie Cooper',
    employeeId: 'bessiecooper',
    workedHours: '01:30:00',
    overtimeHours: '01:30:00',
    pto: '',
  },
  {
    _id: 2,
    employeeName: 'Eleanor Pena',
    employeeId: 'bessiecooper',
    workedHours: '01:30:00',
    overtimeHours: '01:30:00',
    pto: '',
  },
  {
    _id: 3,
    employeeName: 'Floyd Miles',
    employeeId: 'bessiecooper',
    workedHours: '01:30:00',
    overtimeHours: '01:30:00',
    pto: '',
  },
];

const TimeSheet = {
  namespace: 'timeSheet',
  state: {
    myTimesheet: mockMyTimeSheetData,
    managerTimesheet: mockManagerTimeSheetData,
  },
  effects: {},
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default TimeSheet;
