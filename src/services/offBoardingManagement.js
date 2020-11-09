// import request from '@/utils/request';

const mockData = [
  {
    ticketNo: '083970',
    userId: 'PSI 2223',
    fullName: 'William Black',
    group: 'KPO',
    submittedDate: '11/22/2020',
    status: 'Approved',
    lastWorkingDate: '11/30/2020',
  },
  {
    ticketNo: '083155',
    userId: 'PSI 2343',
    fullName: 'Elon Musk',
    group: 'Software Services',
    submittedDate: '11/22/2020',
    status: 'Waiting for approval',
    lastWorkingDate: '11/30/2020',
  },
];

const getListOffBoarding = async (payload) => {
  // return request('/api/document/list', {
  //   method: 'POST',
  // });
  return {
    statusCode: 200,
    data: mockData,
  };
};

export default getListOffBoarding;
