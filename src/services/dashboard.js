import { API_KEYS } from '../../config/proxy';
import request from '@/utils/request';

export async function getListTicket(payload) {
  return request('/api/approvaltenant/get-list-ticket', {
    method: 'POST',
    data: payload,
  });
}
export async function getListMyTicket(payload) {
  return request(
    '/api-ticket/tickettenant/list',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
export async function getLeaveRequestOfEmployee(payload) {
  return request('/api/leaverequesttenant/get-my-request', {
    method: 'POST',
    data: payload,
  });
}
export async function aprovalLeaveRequest(payload) {
  return request('/api/leaverequesttenant/reporting-manager-approve', {
    method: 'POST',
    data: payload,
  });
}
export async function rejectLeaveRequest(payload) {
  return request('/api/leaverequesttenant/reporting-manager-reject', {
    method: 'POST',
    data: payload,
  });
}
export async function aprovalCompoffRequest(payload) {
  return request('/api/compoffrequesttenant/approve-compoff-request', {
    method: 'POST',
    data: payload,
  });
}
export async function rejectCompoffRequest(payload) {
  return request('/api/compoffrequesttenant/reject-compoff-request', {
    method: 'POST',
    data: payload,
  });
}

// GOOGLE CALENDAR
export async function syncGoogleCalendar(payload) {
  // return request('/api/google/calendar', {
  //   method: 'POST',
  //   data: payload,
  // });
  return {
    statusCode: 200,
    status: 'Success',
    message: 'Get list successfully',
    data: [
      {
        kind: 'calendar#event',
        etag: '"3277000065256000"',
        id: 'l2apespr6hn52ef03jigh0e5rt_20220117T030000Z',
        status: 'confirmed',
        htmlLink:
          'https://www.google.com/calendar/event?eid=bDJhcGVzcHI2aG41MmVmMDNqaWdoMGU1cnRfMjAyMjAxMTdUMDMwMDAwWiBuZ2hpYS52b0B0ZXJyYWxvZ2ljLmNvbQ',
        created: '2021-04-29T06:17:02.000Z',
        updated: '2021-12-03T02:53:52.628Z',
        summary: 'HRMS - daily meeting [Online]',
        creator: {
          email: 'khang.le@terralogic.com',
        },
        organizer: {
          email: 'khang.le@terralogic.com',
        },
        start: {
          dateTime: '2022-01-17T10:00:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        end: {
          dateTime: '2022-01-17T11:00:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        recurringEventId: 'l2apespr6hn52ef03jigh0e5rt_R20211008T030000',
        originalStartTime: {
          dateTime: '2022-01-17T10:00:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        transparency: 'transparent',
        iCalUID: 'l2apespr6hn52ef03jigh0e5rt_r20211008t030000@google.com',
        sequence: 7,
        attendees: [
          {
            email: 'thang.nguyen@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'tuan.luong@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'trung.nguyen@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'huu.nguyen@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'lewis.nguyen@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'tien.nguyen@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'khang.le@terralogic.com',
            organizer: true,
            responseStatus: 'accepted',
          },
          {
            email: 'khoa.le@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'sinh.tran@terralogic.com',
            responseStatus: 'accepted',
          },
          {
            email: 'thi.do@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'ky.ngo@terralogic.com',
            displayName: 'Ky Ngo',
            responseStatus: 'needsAction',
          },
          {
            email: 'nathan.nguyen@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'nghia.vo@terralogic.com',
            self: true,
            responseStatus: 'accepted',
          },
        ],
        hangoutLink: 'https://meet.google.com/okt-zgko-efh',
        conferenceData: {
          entryPoints: [
            {
              entryPointType: 'video',
              uri: 'https://meet.google.com/okt-zgko-efh',
              label: 'meet.google.com/okt-zgko-efh',
            },
            {
              entryPointType: 'more',
              uri: 'https://tel.meet/okt-zgko-efh?pin=4147977465266',
              pin: '4147977465266',
            },
            {
              regionCode: 'US',
              entryPointType: 'phone',
              uri: 'tel:+1-470-655-0657',
              label: '+1 470-655-0657',
              pin: '271022372',
            },
          ],
          conferenceSolution: {
            key: {
              type: 'hangoutsMeet',
            },
            name: 'Google Meet',
            iconUri:
              'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png',
          },
          conferenceId: 'okt-zgko-efh',
          signature: 'AGirE/LmnKfJvWqLrIPS4uRm2V6r',
        },
        reminders: {
          useDefault: true,
        },
        eventType: 'default',
      },
      {
        kind: 'calendar#event',
        etag: '"3284803127976000"',
        id: '70pj8oj26gpj6bb5cgs30b9kc4rjgb9p68p3ebb26li66ohi6ksm4db56k',
        status: 'confirmed',
        htmlLink:
          'https://www.google.com/calendar/event?eid=NzBwajhvajI2Z3BqNmJiNWNnczMwYjlrYzRyamdiOXA2OHAzZWJiMjZsaTY2b2hpNmtzbTRkYjU2ayBuZ2hpYS52b0B0ZXJyYWxvZ2ljLmNvbQ',
        created: '2022-01-17T06:38:14.000Z',
        updated: '2022-01-17T06:39:23.988Z',
        summary: 'Nghĩa / Aashwij',
        creator: {
          email: 'aashwij@terralogic.com',
        },
        organizer: {
          email: 'aashwij@terralogic.com',
        },
        start: {
          dateTime: '2022-01-17T13:30:00+07:00',
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: '2022-01-17T14:00:00+07:00',
          timeZone: 'America/Los_Angeles',
        },
        iCalUID: '70pj8oj26gpj6bb5cgs30b9kc4rjgb9p68p3ebb26li66ohi6ksm4db56k@google.com',
        sequence: 0,
        attendees: [
          {
            email: 'nghia.vo@terralogic.com',
            self: true,
            responseStatus: 'accepted',
          },
          {
            email: 'aashwij@terralogic.com',
            organizer: true,
            responseStatus: 'accepted',
          },
        ],
        hangoutLink: 'https://meet.google.com/nzi-joad-mtx',
        conferenceData: {
          createRequest: {
            requestId: 'cgsm2e34c5hm2bb46krj8b9kcdhj0bb1c5hj4b9j65j6ce9gclj3ic1pc4',
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
            status: {
              statusCode: 'success',
            },
          },
          entryPoints: [
            {
              entryPointType: 'video',
              uri: 'https://meet.google.com/nzi-joad-mtx',
              label: 'meet.google.com/nzi-joad-mtx',
            },
            {
              entryPointType: 'more',
              uri: 'https://tel.meet/nzi-joad-mtx?pin=4491467822534',
              pin: '4491467822534',
            },
            {
              regionCode: 'US',
              entryPointType: 'phone',
              uri: 'tel:+1-262-372-9421',
              label: '+1 262-372-9421',
              pin: '637691517',
            },
          ],
          conferenceSolution: {
            key: {
              type: 'hangoutsMeet',
            },
            name: 'Google Meet',
            iconUri:
              'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png',
          },
          conferenceId: 'nzi-joad-mtx',
          signature: 'AGirE/KAqXMVE+hxMarIiK7M3Zq5',
        },
        reminders: {
          useDefault: true,
        },
        eventType: 'default',
      },
      {
        kind: 'calendar#event',
        etag: '"3284803127976000"',
        id: 'hahaha',
        status: 'confirmed',
        htmlLink:
          'https://www.google.com/calendar/event?eid=NzBwajhvajI2Z3BqNmJiNWNnczMwYjlrYzRyamdiOXA2OHAzZWJiMjZsaTY2b2hpNmtzbTRkYjU2ayBuZ2hpYS52b0B0ZXJyYWxvZ2ljLmNvbQ',
        created: '2022-01-14T06:38:14.000Z',
        updated: '2022-01-14T06:39:23.988Z',
        summary: 'Nghĩa hehe',
        creator: {
          email: 'aashwij@terralogic.com',
        },
        organizer: {
          email: 'aashwij@terralogic.com',
        },
        start: {
          dateTime: '2022-01-13T13:30:00+07:00',
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: '2022-01-13T14:00:00+07:00',
          timeZone: 'America/Los_Angeles',
        },
        iCalUID: '70pj8oj26gpj6bb5cgs30b9kc4rjgb9p68p3ebb26li66ohi6ksm4db56k@google.com',
        sequence: 0,
        attendees: [
          {
            email: 'nghia.vo@terralogic.com',
            self: true,
            responseStatus: 'accepted',
          },
          {
            email: 'aashwij@terralogic.com',
            organizer: true,
            responseStatus: 'accepted',
          },
        ],
        hangoutLink: 'https://meet.google.com/nzi-joad-mtx',
        conferenceData: {
          createRequest: {
            requestId: 'cgsm2e34c5hm2bb46krj8b9kcdhj0bb1c5hj4b9j65j6ce9gclj3ic1pc4',
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
            status: {
              statusCode: 'success',
            },
          },
          entryPoints: [
            {
              entryPointType: 'video',
              uri: 'https://meet.google.com/nzi-joad-mtx',
              label: 'meet.google.com/nzi-joad-mtx',
            },
            {
              entryPointType: 'more',
              uri: 'https://tel.meet/nzi-joad-mtx?pin=4491467822534',
              pin: '4491467822534',
            },
            {
              regionCode: 'US',
              entryPointType: 'phone',
              uri: 'tel:+1-262-372-9421',
              label: '+1 262-372-9421',
              pin: '637691517',
            },
          ],
          conferenceSolution: {
            key: {
              type: 'hangoutsMeet',
            },
            name: 'Google Meet',
            iconUri:
              'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png',
          },
          conferenceId: 'nzi-joad-mtx',
          signature: 'AGirE/KAqXMVE+hxMarIiK7M3Zq5',
        },
        reminders: {
          useDefault: true,
        },
        eventType: 'default',
      },
    ],
  };
}

// WIDGETS
export async function updateWidgets(payload) {
  return request('/api/usermap/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getWidgets(payload) {
  return request('/api/employeetenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

// MY TEAM
export async function getMyTeam(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
export async function updateTicket(payload) {
  return request(
    `/api-ticket/tickettenant/update`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}

// TIMESHEET
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

export async function getListMyTeam(payload) {
  return request('/api/employeetenant/list-myteam', {
    method: 'POST',
    data: payload,
  });
}

export async function getListEmployee(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
export async function getHolidaysByCountry(payload) {
  return request('/api/holidaycalendartenant/get-by-country', {
    method: 'POST',
    data: payload,
  });
}
// UPLOADFILE
export async function uploadFile(data) {
  return request('/api/attachments/upload', {
    method: 'POST',
    data,
  });
}
export async function addNotes(payload) {
  return request(
    `/api-ticket/tickettenant/chat`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
// MYPROJECT

export async function getProjectList(payload) {
  return request(
    '/api-project/projecttenant/list',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getMyResoucreList(payload) {
  return request(
    '/api-project/resourcetenant/list',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

// HOME PAGE
export async function getBirthdayInWeek(data) {
  return request('/api/employeetenant/list-celebration', {
    method: 'POST',
    data,
  });
}

export async function getMyTeamLeaveRequestList(payload) {
  return request('/api/leaverequesttenant/get-team-request', {
    method: 'POST',
    data: payload,
  });
}

export async function getTimeOffTypeByCountry(payload) {
  return request('/api/timeofftypetenant/get-by-country', {
    method: 'POST',
    data: payload,
  });
}
