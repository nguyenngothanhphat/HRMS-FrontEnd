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

export async function getHolidaysByDate(params) {
  return request(
    `/api/holidays`,
    {
      method: 'GET',
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
export async function duplicateTimesheet(payload, params) {
  // date, week, month
  return request(
    `/api/duplicated`,
    {
      method: 'POST',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function exportTimeSheet(payload) {
  return request(
    '/api-project/export',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

// MANAGER
export async function getProjectList(payload) {
  return request(
    `/api-project/projecttenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getManagerTimesheetOfTeamView(payload, params) {
  // date, week, month
  return request(
    `/api/manager/team-view`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function getManagerTimesheetOfProjectView(payload, params) {
  // date, week, month
  // return request(
  //   `/api/manager/report`,
  //   {
  //     method: 'GET',
  //     data: payload,
  //     params,
  //   },
  //   false,
  //   API_KEYS.TIMESHEET_API,
  // );
  return request(
    `/api/manager/project-report`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

// HR VIEW
export async function getHRTimesheet(payload, params) {
  // date, week, month
  return request(
    `/api/hr/report`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

// FINANCE VIEW
export async function getFinanceTimesheet(payload, params) {
  // date, week, month
  return request(
    `/api/finance/report`,
    {
      method: 'GET',
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

// export project view of my project
export async function exportProject(payload, params) {
  return request(
    '/api/export-project-csv',
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

// export team view of my project
export async function exportTeam(payload, params) {
  return request(
    '/api/export-team-csv',
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function getDesignationList(payload) {
  return request('/api/titletenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getDepartmentList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getProjectTypeList(payload) {
  return request(
    `/api-project/projecttenant/list-project-types`,
    {
      method: 'GET',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getListEmployeeSingleCompany(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}

export async function getDivisionList(payload) {
  return request('/api/departmenttenant/get-all-division', {
    method: 'GET',
    params: payload,
  });
}

export async function getEmployeeScheduleByLocation(payload) {
  return request('/api/employeescheduletenant/get-by-location', {
    method: 'POST',
    data: payload,
  });
}

export async function getMyRequest(params) {
  return request(
    '/api/listReport',
    {
      method: 'GET',
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function resubmitMyRequest(payload) {
  return request(
    '/api/updateReport',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function sendMailInCompleteTimeSheet(payload) {
  return request(
    '/api/sendMail/incomplete',
    {
      method: 'GET',
      params: payload,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function getProjectsByEmployee(payload) {
  return request(
    `api-project/resourcetenant/get-by-employee`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}
