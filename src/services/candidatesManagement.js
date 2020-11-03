import request from '@/utils/request';

const getCandidatesList = async (payload) => {
  return request('/api/candidate/list', {
    method: 'POST',
    data: payload,
  });
};

export default getCandidatesList;
