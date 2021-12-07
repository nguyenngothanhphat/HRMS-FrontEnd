import request from '@/utils/request';
import { API_KEYS } from '../../config/proxy';

export async function getMyTimesheet(payload, params) {
  return request(
    `/api/filter`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function getManagerTimesheet(payload, params) {
  return request(
    `/api/manager`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

// edit/update
export async function updateActivity(payload, params) {
  return request(
    `/api`,
    {
      method: 'PATCH',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function removeActivity(payload, params) {
  return request(
    `/api`,
    {
      method: 'DELETE',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function addActivity(payload) {
  return request(
    `/api`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function addMultipleActivity(payload, params) {
  return request(
    `/api/multiple`,
    {
      method: 'POST',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

// complex view
export async function getMyTimesheetByType(payload, params) {
  // date, week, month
  return request(
    `/api/view`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

// import
export async function getImportData(payload, params) {
  // date, week, month
  return request(
    `/api/import`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function importTimesheet(payload, params) {
  // date, week, month
  return request(
    `/api/import`,
    {
      method: 'POST',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

// get list employee
export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
