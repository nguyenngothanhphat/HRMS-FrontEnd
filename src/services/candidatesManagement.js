import request from '@/utils/request';

const getCandidatesList = async (payload) => {
  console.log(payload);
  return request('/api/candidatetenant/list', {
    method: 'POST',
    data: payload,
  });
};

export default getCandidatesList;
