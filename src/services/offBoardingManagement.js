import request from '@/utils/request';

const getListOffBoarding = async (payload) => {
  return request('/api/offboardingrequesttenant/search-detail', {
    method: 'POST',
    data: payload,
  });
};

export default getListOffBoarding;
