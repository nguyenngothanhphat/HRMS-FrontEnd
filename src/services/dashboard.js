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
        etag: '"3292378916188000"',
        id: '6av9b18av2l5c5193kdr8he7br_20220318T030000Z',
        status: 'confirmed',
        htmlLink:
          'https://www.google.com/calendar/event?eid=NmF2OWIxOGF2Mmw1YzUxOTNrZHI4aGU3YnJfMjAyMjAzMThUMDMwMDAwWiBsZXdpcy5uZ3V5ZW5AdGVycmFsb2dpYy5jb20',
        created: '2022-03-01T12:10:51.000Z',
        updated: '2022-03-02T02:50:58.094Z',
        summary: 'HRMS - Daily meeting',
        location: '2nd Floor - Mercury',
        creator: { email: 'thang.nguyen@terralogic.com' },
        organizer: { email: 'thang.nguyen@terralogic.com' },
        start: {
          dateTime: '2022-03-18T07:00:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        end: {
          dateTime: '2022-03-18T08:00:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        recurringEventId: '6av9b18av2l5c5193kdr8he7br',
        originalStartTime: {
          dateTime: '2022-03-18T10:00:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        iCalUID: '6av9b18av2l5c5193kdr8he7br@google.com',
        sequence: 0,
        attendees: [
          {
            email: 'terralogic.com_2d38333838353032352d3533@resource.calendar.google.com',
            displayName: '2nd Floor - Mercury',
            resource: true,
            responseStatus: 'accepted',
          },
          {
            email: 'thang.nguyen@terralogic.com',
            organizer: true,
            responseStatus: 'accepted',
          },
          {
            email: 'christine.nguyen@terralogic.com',
            responseStatus: 'accepted',
          },
          {
            email: 'ky.ngo@terralogic.com',
            displayName: 'Ky Ngo',
            responseStatus: 'accepted',
          },
          {
            email: 'vien.pham@terralogic.com',
            responseStatus: 'needsAction',
          },
          { email: 'nghia.vo@terralogic.com', responseStatus: 'accepted' },
          {
            email: 'sinh.tran@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'lewis.nguyen@terralogic.com',
            self: true,
            responseStatus: 'needsAction',
          },
          { email: 'yen.nguyen@terralogic.com', responseStatus: 'accepted' },
        ],
        hangoutLink: 'https://meet.google.com/bam-unfm-ntj',
        conferenceData: {
          entryPoints: [
            {
              entryPointType: 'video',
              uri: 'https://meet.google.com/bam-unfm-ntj',
              label: 'meet.google.com/bam-unfm-ntj',
            },
            {
              entryPointType: 'more',
              uri: 'https://tel.meet/bam-unfm-ntj?pin=5909967440473',
              pin: '5909967440473',
            },
            {
              regionCode: 'US',
              entryPointType: 'phone',
              uri: 'tel:+1-760-512-3744',
              label: '+1 760-512-3744',
              pin: '107862892',
            },
          ],
          conferenceSolution: {
            key: { type: 'hangoutsMeet' },
            name: 'Google Meet',
            iconUri:
              'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png',
          },
          conferenceId: 'bam-unfm-ntj',
          signature: 'AKpSKUv90/BVqASBBpKMzI3UY/6I',
        },
        reminders: { useDefault: true },
        eventType: 'default',
      },
      {
        kind: 'calendar#event',
        etag: '"3290823152610000"',
        id: 'l2apespr6hn52ef03jigh0e5rt_20220318T030000Z',
        status: 'confirmed',
        htmlLink:
          'https://www.google.com/calendar/event?eid=bDJhcGVzcHI2aG41MmVmMDNqaWdoMGU1cnRfMjAyMjAzMThUMDMwMDAwWiBsZXdpcy5uZ3V5ZW5AdGVycmFsb2dpYy5jb20',
        created: '2021-04-29T06:17:02.000Z',
        updated: '2022-02-21T02:46:16.305Z',
        summary: 'HRMS - daily meeting [Online]',
        creator: { email: 'khang.le@terralogic.com' },
        organizer: { email: 'khang.le@terralogic.com' },
        start: {
          dateTime: '2022-03-18T07:00:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        end: {
          dateTime: '2022-03-18T10:00:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        recurringEventId: 'l2apespr6hn52ef03jigh0e5rt_R20220214T030000',
        originalStartTime: {
          dateTime: '2022-03-18T10:00:00+07:00',
          timeZone: 'Asia/Ho_Chi_Minh',
        },
        transparency: 'transparent',
        iCalUID: 'l2apespr6hn52ef03jigh0e5rt_R20220214T030000@google.com',
        sequence: 7,
        attendees: [
          {
            email: 'lewis.nguyen@terralogic.com',
            self: true,
            responseStatus: 'needsAction',
          },
          {
            email: 'khang.le@terralogic.com',
            organizer: true,
            responseStatus: 'accepted',
          },
          { email: 'sinh.tran@terralogic.com', responseStatus: 'accepted' },
          {
            email: 'ky.ngo@terralogic.com',
            displayName: 'Ky Ngo',
            responseStatus: 'accepted',
          },
          {
            email: 'nathan.nguyen@terralogic.com',
            responseStatus: 'needsAction',
          },
          { email: 'nghia.vo@terralogic.com', responseStatus: 'accepted' },
          {
            email: 'liam.nguyen@terralogic.com',
            responseStatus: 'needsAction',
          },
          {
            email: 'vien.pham@terralogic.com',
            responseStatus: 'needsAction',
          },
          { email: 'yen.nguyen@terralogic.com', responseStatus: 'accepted' },
          {
            email: 'christine.nguyen@terralogic.com',
            responseStatus: 'needsAction',
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
            key: { type: 'hangoutsMeet' },
            name: 'Google Meet',
            iconUri:
              'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-512dp/logo_meet_2020q4_color_2x_web_512dp.png',
          },
          conferenceId: 'okt-zgko-efh',
          signature: 'AKpSKUtJWpk0KuPyn22f5BI+Dg2+',
        },
        reminders: { useDefault: true },
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
