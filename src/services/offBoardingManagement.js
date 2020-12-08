import request from '@/utils/request';

const getListOffBoarding = async (payload) => {
  return request('/api/offboardingrequest/search-detail', {
    method: 'POST',
    data: payload,
  });
};

export default getListOffBoarding;
