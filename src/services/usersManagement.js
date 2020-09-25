const dataActive = [
  {
    key: '1',
    userId: '8097',
    employeeId: 'PSI 2090',
    joinedDate: 'Aug-7,2020',
    email: 'aaaamatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '2',
    userId: '1231',
    employeeId: 'PSI 2011',
    joinedDate: 'Aug-8,2020',
    email: 'sdasmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '3',
    userId: '4423',
    employeeId: 'PSI 2089',
    joinedDate: 'Aug-25,2020',
    email: 'dssmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '4',
    userId: '4324',
    employeeId: 'PSI 2077',
    joinedDate: 'Jan-7,2020',
    email: 'uuyer@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '5',
    userId: '6456',
    employeeId: 'PSI 2454',
    joinedDate: 'Aug-7,2020',
    email: 'tuasdna@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '6',
    userId: '1235',
    employeeId: 'PSI 1245',
    joinedDate: 'Aug-7,2020',
    email: 'hahahahh@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '7',
    userId: '3453',
    employeeId: 'PSI 4565',
    joinedDate: 'Aug-7,2020',
    email: 'test1@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '8',
    userId: '4444',
    employeeId: 'PSI 4564',
    joinedDate: 'Aug-7,2020',
    email: 'billgates@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '9',
    userId: '5435',
    employeeId: 'PSI 1111',
    joinedDate: 'Aug-7,2020',
    email: 'mark@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '10',
    userId: '2363',
    employeeId: 'PSI 1235',
    joinedDate: 'Aug-7,2020',
    email: 'alibaba@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '11',
    userId: '9785',
    employeeId: 'PSI 7895',
    joinedDate: 'Aug-7,2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '12',
    userId: '3454',
    employeeId: 'PSI 1112',
    joinedDate: 'Aug-7,2020',
    email: 'matt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '13',
    userId: '7645',
    employeeId: 'PSI 3232',
    joinedDate: 'Aug-7,2020',
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
    key: '14',
    userId: '8097',
    employeeId: 'PSI 2090',
    joinedDate: 'Aug-7,2020',
    email: 'aaaamatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '15',
    userId: '1231',
    employeeId: 'PSI 2011',
    joinedDate: 'Aug-8,2020',
    email: 'sdasmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '16',
    userId: '4423',
    employeeId: 'PSI 2089',
    joinedDate: 'Aug-25,2020',
    email: 'dssmatt.wagoner@terralogic.com',
    fullName: 'Matt Wagoner ',
    role: 'Manager',
    location: 'Mumbai',
    password: '',
    status: 'Active',
    action: '',
  },
  {
    key: '17',
    userId: '4324',
    employeeId: 'PSI 2077',
    joinedDate: 'Jan-7,2020',
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
