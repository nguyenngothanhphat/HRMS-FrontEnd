import request from '@/utils/request';

const companyDetails = {
  id: 6,
  name: 'Viet NamG',
  dba: 'Logistic',
  ein: '123467892',
  employeeNumber: '1000',
  website: 'https://www.terralogic.com/',

  headQuarterAddress: {
    address: '66 Le Thi Ho, Go Vap',
    country: 'Viet Nam',
    state: 'HoChiMinh',
    zipCode: '700000',
  },
  legalAddress: {
    address: '66 Le Thi Ho, Go Vap',
    country: 'Viet Nam',
    state: 'HoChiMinh',
    zipCode: '700000',
  },
  locations: [
    {
      name: 'Japan Office',
      address: '580-00154-23-7 Shindou, Matsubara, Osaka',
      country: 'Japan',
      state: 'HoChiMinh',
      zipCode: '700000',
      isheadQuarter: true,
    },
    {
      name: 'HoChiMinh Office',
      address: '66 Le Thi Ho, Go Vap',
      country: 'Viet Nam',
      state: 'HoChiMinh',
      zipCode: '700000',
      isheadQuarter: false,
    },
  ],
  user: {
    firstName: 'TienNG',
    email: 'tiennvse613169@gmail.com',
    password: '12345678@Ab',
  },
};

export async function getCompaniesList(payload) {
  return request('/api/company/list', {
    method: 'POST',
    data: payload,
  });
}

export const getCompanyDetails = async () => {
  return {
    statusCode: 200,
    data: companyDetails,
  };
};
