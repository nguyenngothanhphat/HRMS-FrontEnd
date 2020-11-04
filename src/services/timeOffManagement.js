// import request from '@/utils/request';

const mockData = [
  {
    employeeId: 'PSI 338',
    fullName: 'Rahul Mochan',
    fromDate: '10/05/2020',
    toDate: '10/05/2020',
    count: 1,
    leaveType: 'Work from home leave',
    status: 'Approved',
  },
  {
    employeeId: 'PSI 338',
    fullName: 'Muku Krishna Sekhar',
    fromDate: '10/04/2020',
    toDate: '10/06/2020',
    count: 2,
    leaveType: 'Compoff leave',
    status: 'Waiting for approval',
  },
];

const getListTimeOff = async (payload) => {
  // return request('/api/document/list', {
  //   method: 'POST',
  // });
  return {
    statusCode: 200,
    data: mockData,
  };
};

export default getListTimeOff;
