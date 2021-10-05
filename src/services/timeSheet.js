import { request, request2 } from '@/utils/request';

export async function getMyTimesheet(payload) {
  return request2(
    `/api/timesheet/filter`,
    {
      method: 'GET',
      data: payload,
    },
    false,
    'API_TIMESHEET',
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
    'API_TIMESHEET',
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
    'API_TIMESHEET',
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
    'API_TIMESHEET',
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
    'API_TIMESHEET',
  );
}

// get list employee
export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
