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
        startTime: '2022-06-14T17:00:00.000Z',
        endTime: '2022-06-14T18:00:00.000Z',
      },
      {
        time: '01:00 AM - 02:00 AM',
        disabled: false,
        startTime: '2022-06-14T18:00:00.000Z',
        endTime: '2022-06-14T19:00:00.000Z',
      },
      {
        time: '02:00 AM - 03:00 AM',
        disabled: false,
        startTime: '2022-06-14T19:00:00.000Z',
        endTime: '2022-06-14T20:00:00.000Z',
      },
      {
        time: '03:00 AM - 04:00 AM',
        disabled: false,
        startTime: '2022-06-14T20:00:00.000Z',
        endTime: '2022-06-14T21:00:00.000Z',
      },
      {
        time: '04:00 AM - 05:00 AM',
        disabled: false,
        startTime: '2022-06-14T21:00:00.000Z',
        endTime: '2022-06-14T22:00:00.000Z',
      },
      {
        time: '05:00 AM - 06:00 AM',
        disabled: false,
        startTime: '2022-06-14T22:00:00.000Z',
        endTime: '2022-06-14T23:00:00.000Z',
      },
      {
        time: '06:00 AM - 07:00 AM',
        disabled: false,
        startTime: '2022-06-14T23:00:00.000Z',
        endTime: '2022-06-15T00:00:00.000Z',
      },
      {
        time: '07:00 AM - 08:00 AM',
        disabled: false,
        startTime: '2022-06-15T00:00:00.000Z',
        endTime: '2022-06-15T01:00:00.000Z',
      },
      {
        time: '08:00 AM - 09:00 AM',
        disabled: false,
        startTime: '2022-06-15T01:00:00.000Z',
        endTime: '2022-06-15T02:00:00.000Z',
      },
      {
        time: '09:00 AM - 10:00 AM',
        disabled: false,
        startTime: '2022-06-15T02:00:00.000Z',
        endTime: '2022-06-15T03:00:00.000Z',
      },
      {
        time: '10:00 AM - 11:00 AM',
        disabled: true,
        startTime: '2022-06-15T03:00:00.000Z',
        endTime: '2022-06-15T04:00:00.000Z',
      },
      {
        time: '11:00 AM - 12:00 AM',
        disabled: false,
        startTime: '2022-06-15T04:00:00.000Z',
        endTime: '2022-06-15T05:00:00.000Z',
      },
      {
        time: '00:00 PM - 01:00 PM',
        disabled: false,
        startTime: '2022-06-15T05:00:00.000Z',
        endTime: '2022-06-15T06:00:00.000Z',
      },
      {
        time: '01:00 PM - 02:00 PM',
        disabled: false,
        startTime: '2022-06-15T06:00:00.000Z',
        endTime: '2022-06-15T07:00:00.000Z',
      },
      {
        time: '02:00 PM - 03:00 PM',
        disabled: false,
        startTime: '2022-06-15T07:00:00.000Z',
        endTime: '2022-06-15T08:00:00.000Z',
      },
      {
        time: '03:00 PM - 04:00 PM',
        disabled: false,
        startTime: '2022-06-15T08:00:00.000Z',
        endTime: '2022-06-15T09:00:00.000Z',
      },
      {
        time: '04:00 PM - 05:00 PM',
        disabled: false,
        startTime: '2022-06-15T09:00:00.000Z',
        endTime: '2022-06-15T10:00:00.000Z',
      },
      {
        time: '05:00 PM - 06:00 PM',
        disabled: false,
        startTime: '2022-06-15T10:00:00.000Z',
        endTime: '2022-06-15T11:00:00.000Z',
      },
      {
        time: '06:00 PM - 07:00 PM',
        disabled: false,
        startTime: '2022-06-15T11:00:00.000Z',
        endTime: '2022-06-15T12:00:00.000Z',
      },
      {
        time: '07:00 PM - 08:00 PM',
        disabled: false,
        startTime: '2022-06-15T12:00:00.000Z',
        endTime: '2022-06-15T13:00:00.000Z',
      },
      {
        time: '08:00 PM - 09:00 PM',
        disabled: false,
        startTime: '2022-06-15T13:00:00.000Z',
        endTime: '2022-06-15T14:00:00.000Z',
      },
      {
        time: '09:00 PM - 10:00 PM',
        disabled: false,
        startTime: '2022-06-15T14:00:00.000Z',
        endTime: '2022-06-15T15:00:00.000Z',
      },
      {
        time: '10:00 PM - 11:00 PM',
        disabled: false,
        startTime: '2022-06-15T15:00:00.000Z',
        endTime: '2022-06-15T16:00:00.000Z',
      },
      {
        time: '11:00 PM - 12:00 PM',
        disabled: false,
        startTime: '2022-06-15T16:00:00.000Z',
        endTime: '2022-06-15T17:00:00.000Z',
      },
    ],
  };
}

// helpers api
export async function getProjectByEmployee(params) {
  return request(
    '/api-project/resourcetenant/get-by-employee',
    {
      method: 'GET',
      params,
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
