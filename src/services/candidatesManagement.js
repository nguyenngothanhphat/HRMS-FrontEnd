const dataActive = [
  {
    rookieId: '16013134',
    rookieName: 'Lewis Nguyen',
    position: 'UX Designer',
    location: 'Vietnam',
    joinedDate: '29th Sept. 2020',
  },
  {
    rookieId: '16013135',
    rookieName: 'Dan Tran',
    position: 'Web Developer',
    location: 'US',
    joinedDate: '30th Sept. 2020',
  },
];

const getCandidatesList = async () => {
  return {
    statusCode: 200,
    data: dataActive,
  };
};

export default getCandidatesList;
