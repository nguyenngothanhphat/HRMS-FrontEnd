import { request, request2 } from '@/utils/request';

// const mockManagerTimeSheetData = [
//   {
//     _id: 1,
//     employeeName: 'Bessie Cooper',
//     employeeId: 'bessiecooper',
//     workedHours: '01:30:00',
//     overtimeHours: '01:30:00',
//     pto: '',
//   },
// ];

// eslint-disable-next-line compat/compat
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getMyTimesheet(payload) {
  return request2(
    `/api/timesheet/filter`,
    {
      method: 'GET',
      data: payload,
    },
    false,
    'API_SQL',
    true, // hasParams
  );
}

export async function getManagerTimesheet(payload) {
  return request2(
    `/api/timesheet/manager`,
    {
      method: 'GET',
      data: payload,
    },
    false,
    'API_SQL',
    true, // hasParams
  );
}

// edit/update
export async function updateActivity(payload) {
  return request2(
    `/api/timesheet`,
    {
      method: 'PATCH',
      data: payload,
    },
    false,
    'API_SQL',
    true, // hasParams
  );
}

export async function removeActivity(payload) {
  return request2(
    `/api/timesheet`,
    {
      method: 'DELETE',
      data: payload,
    },
    false,
    'API_SQL',
    true, // hasParams
  );
}

export async function addActivity(payload) {
  return request2(
    `/api/timesheet`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    'API_SQL',
  );
}
