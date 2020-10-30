// import request from '@/utils/request';

const mockData = [
  {
    name: `New Year's Day`,
    fromDate: '1/1/2021',
    toDate: '1/1/2021',
  },
  {
    name: `Lunar New Year`,
    fromDate: '1/23/2021',
    toDate: '1/29/2021',
  },
  {
    name: `Hùng Kings' Festival`,
    fromDate: '4/2/2021',
    toDate: '4/2/2021',
  },
  {
    name: 'Reunification Day',
    fromDate: '4/30/2020',
    toDate: '4/30/2020',
  },
  {
    name: 'Labour Day',
    fromDate: '5/1/2020',
    toDate: '5/1/2020',
  },
  {
    name: 'Reunification Day',
    fromDate: '9/2/2020',
    toDate: '9/2/2020',
  },
];

export async function getHolidaysList() {
  //   return request('/api/attachments/upload/image', {
  //     method: 'POST',
  //   });
  return {
    data: mockData,
    statusCode: 200,
  };
}

const mockData1 = [
  {
    name: `Family Event 1`,
    fromDate: '11/1/2020',
    toDate: '11/1/2020',
    duration: 1,
    type: 'CL',
  },
  {
    name: `Family Event 2`,
    fromDate: '11/27/2020',
    toDate: '11/29/2020',
    duration: 3,
    type: 'CL',
  },
  {
    name: `Family Event 3`,
    fromDate: '10/12/2020',
    toDate: '10/13/2020',
    duration: 2,
    type: 'CL',
  },
  {
    name: 'Family Event 4',
    fromDate: '12/30/2020',
    toDate: '12/30/2020',
    duration: 1,
    type: 'CL',
  },
];

export async function getLeavingListByEmployee() {
  return {
    data: mockData1,
    statusCode: 200,
  };
}
