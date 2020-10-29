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
export default async function getHolidaysList() {
  //   return request('/api/attachments/upload/image', {
  //     method: 'POST',
  //   });
  return {
    data: mockData,
    statusCode: 200,
  };
}
