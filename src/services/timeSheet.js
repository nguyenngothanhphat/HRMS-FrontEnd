import { request } from '@/utils/request';

export async function getMyTimesheet(payload) {
  return request(
    `/api/timesheet/filter`,
    {
      method: 'GET',
      data: payload,
    },
    false,
    'TIMESHEET_API',
    true, // hasParams
  );
}

export async function getManagerTimesheet(payload) {
  return request(
    `/api/timesheet/manager`,
    {
      method: 'GET',
      data: payload,
    },
    false,
    'TIMESHEET_API',
    true, // hasParams
  );
}

// edit/update
export async function updateActivity(payload) {
  return request(
    `/api/timesheet`,
    {
      method: 'PATCH',
      data: payload,
    },
    false,
    'TIMESHEET_API',
    true, // hasParams
  );
}

export async function removeActivity(payload) {
  return request(
    `/api/timesheet`,
    {
      method: 'DELETE',
      data: payload,
    },
    false,
    'TIMESHEET_API',
    true, // hasParams
  );
}

export async function addActivity(payload) {
  return request(
    `/api/timesheet`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    'TIMESHEET_API',
  );
}

// get list employee
export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
