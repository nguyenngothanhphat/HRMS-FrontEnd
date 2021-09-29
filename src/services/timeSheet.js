import moment from 'moment';
// import request from '@/utils/request';

const mockMyTimeSheetData = [
  {
    _id: 1,
    day: moment(),
    activity: 'Working hours',
    timeIn: moment(),
    timeOut: moment(),
    nightshift: false,
    totalHours: '02:30:00',
    notes:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint non deserunt ullamco est sit aliqua dolor do amet sint ',
  },
  {
    _id: 2,
    day: moment(),
    activity: 'Lunch Break',
    timeIn: moment(),
    timeOut: moment(),
    nightshift: false,
    totalHours: '02:30:00',
    notes: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor',
  },
  {
    _id: 3,
    day: moment(),
    activity: 'PTO',
    timeIn: moment(),
    timeOut: moment(),
    nightshift: false,
    totalHours: '02:30:00',
    notes:
      'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint non deserunt ullamco est sit aliqua dolor do amet sint ',
  },
  {
    _id: 4,
    day: moment().add(1, 'days'),
    activity: 'Working hours',
    timeIn: moment(),
    timeOut: moment(),
    nightshift: false,
    totalHours: '02:30:00',
    notes: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint non',
  },
  {
    _id: 5,
    day: moment().add(3, 'days'),
    activity: 'Working hours',
    timeIn: moment(),
    timeOut: moment(),
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

// eslint-disable-next-line compat/compat
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// fetch
export async function getMyTimesheet() {
  await wait(2000);
  const res = { data: mockMyTimeSheetData, statusCode: 200 };
  return res;
}

export async function getManagerTimesheet() {
  await wait(2000);
  const res = { data: mockManagerTimeSheetData, statusCode: 200 };
  return res;
}

// edit/update
export async function updateActivity(payload) {
  await wait(1000);
  const res = { data: payload, statusCode: 200 };
  return res;
}

export async function removeActivity() {
  await wait(1000);
  const res = { data: {}, statusCode: 200 };
  return res;
}

export async function addActivity(payload) {
  await wait(1000);
  const res = { data: payload, statusCode: 200 };
  return res;
}
