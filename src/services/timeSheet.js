import { request } from '@/utils/request';

export async function getMyTimesheet(payload, params) {
  return request(
    `/api/timesheet/filter`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    'TIMESHEET_API',
  );
}

export async function getManagerTimesheet(payload, params) {
  return request(
    `/api/timesheet/manager`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    'TIMESHEET_API',
  );
}

// edit/update
export async function updateActivity(payload, params) {
  return request(
    `/api/timesheet`,
    {
      method: 'PATCH',
      data: payload,
      params,
    },
    false,
    'TIMESHEET_API',
  );
}

export async function removeActivity(payload, params) {
  return request(
    `/api/timesheet`,
    {
      method: 'DELETE',
      data: payload,
      params,
    },
    false,
    'TIMESHEET_API',
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

export async function addMultipleActivity(payload, params) {
  return request(
    `/api/timesheet/multiple`,
    {
      method: 'POST',
      data: payload,
      params,
    },
    false,
    'TIMESHEET_API',
  );
}

// complex view
export async function getMyTimesheetByType(payload, params) {
  // date, week, month
  return request(
    `/api/timesheet/view`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    'TIMESHEET_API',
  );
}

// import
export async function getImportData(payload, params) {
  // date, week, month
  return request(
    `/api/timesheet/import`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    'TIMESHEET_API',
  );
}

export async function importTimesheet(payload, params) {
  // date, week, month
  return request(
    `/api/timesheet/import`,
    {
      method: 'POST',
      data: payload,
      params,
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
