import request from '@/utils/request';
import { API_KEYS } from '../../config/proxy';

export async function getList(payload) {
  return request('/api/offboardingtenant/list', {
    method: 'GET',
    params: payload,
  });
}

export async function createRequest(payload) {
  return request('/api/offboardingtenant/create', {
    method: 'POST',
    data: payload,
  });
}

export async function updateRequest(payload) {
  return request('/api/offboardingtenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getMyRequest(params) {
  return request('/api/offboardingtenant/get', {
    method: 'GET',
    params,
  });
}

export async function getRequestById(params) {
  return request('/api/offboardingtenant/get-by-id', {
    method: 'GET',
    params,
  });
}

export async function withdrawRequest(payload) {
  return request('/api/offboardingtenant/withdraw', {
    method: 'POST',
    data: payload,
  });
}

export async function getTimeInDate(params) {
  // return request('/api/offboardingtenant/get-list-calendar', {
  //   method: 'GET',
  //   params,
  // });
  return {
    statusCode: 200,
    status: 'Success',
    message: 'Get list calendar successfully',
    data: [
      {
        time: '00:00 AM - 01:00 AM',
        disabled: false,
        startTime: '2022-06-19T17:00:00.000Z',
        endTime: '2022-06-19T18:00:00.000Z',
      },
      {
        time: '01:00 AM - 02:00 AM',
        disabled: false,
        startTime: '2022-06-19T18:00:00.000Z',
        endTime: '2022-06-19T19:00:00.000Z',
      },
      {
        time: '02:00 AM - 03:00 AM',
        disabled: false,
        startTime: '2022-06-19T19:00:00.000Z',
        endTime: '2022-06-19T20:00:00.000Z',
      },
      {
        time: '03:00 AM - 04:00 AM',
        disabled: false,
        startTime: '2022-06-19T20:00:00.000Z',
        endTime: '2022-06-19T21:00:00.000Z',
      },
      {
        time: '04:00 AM - 05:00 AM',
        disabled: false,
        startTime: '2022-06-19T21:00:00.000Z',
        endTime: '2022-06-19T22:00:00.000Z',
      },
      {
        time: '05:00 AM - 06:00 AM',
        disabled: false,
        startTime: '2022-06-19T22:00:00.000Z',
        endTime: '2022-06-19T23:00:00.000Z',
      },
      {
        time: '06:00 AM - 07:00 AM',
        disabled: false,
        startTime: '2022-06-19T23:00:00.000Z',
        endTime: '2022-06-20T00:00:00.000Z',
      },
      {
        time: '07:00 AM - 08:00 AM',
        disabled: false,
        startTime: '2022-06-20T00:00:00.000Z',
        endTime: '2022-06-20T01:00:00.000Z',
      },
      {
        time: '08:00 AM - 09:00 AM',
        disabled: false,
        startTime: '2022-06-20T01:00:00.000Z',
        endTime: '2022-06-20T02:00:00.000Z',
      },
      {
        time: '09:00 AM - 10:00 AM',
        disabled: false,
        startTime: '2022-06-20T02:00:00.000Z',
        endTime: '2022-06-20T03:00:00.000Z',
      },
      {
        time: '10:00 AM - 11:00 AM',
        disabled: true,
        startTime: '2022-06-20T03:00:00.000Z',
        endTime: '2022-06-20T04:00:00.000Z',
      },
      {
        time: '11:00 AM - 12:00 AM',
        disabled: false,
        startTime: '2022-06-20T04:00:00.000Z',
        endTime: '2022-06-20T05:00:00.000Z',
      },
      {
        time: '00:00 PM - 01:00 PM',
        disabled: false,
        startTime: '2022-06-20T05:00:00.000Z',
        endTime: '2022-06-20T06:00:00.000Z',
      },
      {
        time: '01:00 PM - 02:00 PM',
        disabled: false,
        startTime: '2022-06-20T06:00:00.000Z',
        endTime: '2022-06-20T07:00:00.000Z',
      },
      {
        time: '02:00 PM - 03:00 PM',
        disabled: false,
        startTime: '2022-06-20T07:00:00.000Z',
        endTime: '2022-06-20T08:00:00.000Z',
      },
      {
        time: '03:00 PM - 04:00 PM',
        disabled: false,
        startTime: '2022-06-20T08:00:00.000Z',
        endTime: '2022-06-20T09:00:00.000Z',
      },
      {
        time: '04:00 PM - 05:00 PM',
        disabled: false,
        startTime: '2022-06-20T09:00:00.000Z',
        endTime: '2022-06-20T10:00:00.000Z',
      },
      {
        time: '05:00 PM - 06:00 PM',
        disabled: false,
        startTime: '2022-06-20T10:00:00.000Z',
        endTime: '2022-06-20T11:00:00.000Z',
      },
      {
        time: '06:00 PM - 07:00 PM',
        disabled: false,
        startTime: '2022-06-20T11:00:00.000Z',
        endTime: '2022-06-20T12:00:00.000Z',
      },
      {
        time: '07:00 PM - 08:00 PM',
        disabled: false,
        startTime: '2022-06-20T12:00:00.000Z',
        endTime: '2022-06-20T13:00:00.000Z',
      },
      {
        time: '08:00 PM - 09:00 PM',
        disabled: false,
        startTime: '2022-06-20T13:00:00.000Z',
        endTime: '2022-06-20T14:00:00.000Z',
      },
      {
        time: '09:00 PM - 10:00 PM',
        disabled: false,
        startTime: '2022-06-20T14:00:00.000Z',
        endTime: '2022-06-20T15:00:00.000Z',
      },
      {
        time: '10:00 PM - 11:00 PM',
        disabled: false,
        startTime: '2022-06-20T15:00:00.000Z',
        endTime: '2022-06-20T16:00:00.000Z',
      },
      {
        time: '11:00 PM - 12:00 PM',
        disabled: false,
        startTime: '2022-06-20T16:00:00.000Z',
        endTime: '2022-06-20T17:00:00.000Z',
      },
    ],
  };
}

// helpers api
export async function getProjectByEmployee(payload) {
  return request(
    '/api-project/resourcetenant/get-by-employee',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
