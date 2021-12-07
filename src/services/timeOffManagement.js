import request from '@/utils/request';

// const mockData = [
//   {
//     employeeId: 'PSI 338',
//     fullName: 'Rahul Mochan',
//     fromDate: '10/05/2020',
//     toDate: '10/05/2020',
//     count: 1,
//     leaveType: 'Work from home leave',
//     status: 'Approved',
//   },
//   {
//     employeeId: 'PSI 338',
//     fullName: 'Muku Krishna Sekhar',
//     fromDate: '10/04/2020',
//     toDate: '10/06/2020',
//     count: 2,
//     leaveType: 'Compoff leave',
//     status: 'Waiting for approval',
//   },
// ];

export async function getListTimeOff(payload) {
  return request('/api/leaverequesttenant/get-by-employee-date', {
    method: 'POST',
    data: payload,
  });
}

export async function getListTimeOffManagement(payload) {
  return request('/api/leaverequesttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getListEmployees(payload) {
  return request('/api/employeetenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getRequestById(payload) {
  return request('/api/leaverequesttenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function generateCSV(payload) {
  return request('/api/leaverequesttenant/download', {
    method: 'POST',
    data: payload,
  });
}
