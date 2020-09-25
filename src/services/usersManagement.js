const dataActive = [
  {
    userId: '8097',
    employeeId: 'PSI 2090',
    joinedDate: '08/29/2020',
    email: 'aaaamatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '1231',
    employeeId: 'PSI 2011',
    joinedDate: '08/22/2020',
    email: 'sdasmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '4423',
    employeeId: 'PSI 2089',
    joinedDate: '08/25/2020',
    email: 'dssmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '4324',
    employeeId: 'PSI 2077',
    joinedDate: '07/01/2020',
    email: 'uuyer@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '6456',
    employeeId: 'PSI 2454',
    joinedDate: '08/07/2020',
    email: 'tuasdna@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '1235',
    employeeId: 'PSI 1245',
    joinedDate: '08/07/2020',
    email: 'hahahahh@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '3453',
    employeeId: 'PSI 4565',
    joinedDate: '08/07/2020',
    email: 'test1@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '4444',
    employeeId: 'PSI 4564',
    joinedDate: '08/07/2020',
    email: 'billgates@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '5435',
    employeeId: 'PSI 1111',
    joinedDate: '08/07/2020',
    email: 'mark@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '2363',
    employeeId: 'PSI 1235',
    joinedDate: '08/07/2020',
    email: 'alibaba@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '9785',
    employeeId: 'PSI 7895',
    joinedDate: '08/07/2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '3454',
    employeeId: 'PSI 1112',
    joinedDate: '08/07/2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '7645',
    employeeId: 'PSI 3232',
    joinedDate: '08/07/2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
];

const dataInActive = [
  {
    userId: '8097',
    employeeId: 'PSI 2090',
    joinedDate: '08/07/2020',
    email: 'aaaamatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '1231',
    employeeId: 'PSI 2011',
    joinedDate: '08/25/2020',
    email: 'sdasmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '4423',
    employeeId: 'PSI 2089',
    joinedDate: '08/25/2020',
    email: 'dssmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    userId: '4324',
    employeeId: 'PSI 2077',
    joinedDate: '01/07/2020',
    email: 'uuyer@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
];
export const getListUsersActive = async () => {
  return {
    statusCode: 200,
    data: dataActive,
  };
};
export const getListUsersInActive = async () => {
  return {
    statusCode: 200,
    data: dataInActive,
  };
};

export const getUserProfile = async (params) => {
  let i = 0;
  for (i; i < dataActive.length; i += 1) {
    if (dataActive[i].userId === params.userId) {
      return {
        statusCode: 200,
        data: dataActive[i],
      };
    }
  }
  return {
    statusCode: 200,
    data: [],
  };
};

const locationList = [
  {
    id: 1,
    name: 'Vietnam',
  },
  {
    id: 2,
    name: 'US',
  },
  {
    id: 3,
    name: 'India',
  },
];

export const getLocationsList = async () => {
  return {
    statusCode: 200,
    data: locationList,
  };
};

const companiesList = [
  {
    id: 1,
    name: 'Company A',
  },
  {
    id: 2,
    name: 'Company B',
  },
  {
    id: 3,
    name: 'Company C',
  },
];

export const getCompaniesList = async () => {
  return {
    statusCode: 200,
    data: companiesList,
  };
};

const rolesList = [
  {
    id: 1,
    name: 'Manager',
  },
  {
    id: 2,
    name: 'CEO',
  },
];

export const getRolesList = async () => {
  return {
    statusCode: 200,
    data: rolesList,
  };
};
