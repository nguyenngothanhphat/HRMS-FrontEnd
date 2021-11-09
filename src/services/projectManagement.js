const mockDataList = [
  {
    customerId: '10101',
    engagementType: 1,
    projectId: 'Terra-1',
    projectStatus: 1,
    projectName: 'Tuan Test',
    projectAlias: 'Test',
    startDate: '01-11-2021',
    tentativeEndDate: '31-11-2021',
    projectDescription: 'fgfggs',
    createdAt: '2021-11-04T04:38:31.000Z',
    timeTaken: '2021-11-04T04:38:31.000Z',
    accountOwner: {
      _id: '61552f6d1b293f2508f61d02',
      id: '61552f6d1b293f2508f61d02',
      joinDate: '2021-09-29T17:00:00.000Z',
      performanceHistory: '61552f6d1b293f2508f61d05',
      compensation: '61552f6d1b293f2508f61d07',
      timeSchedule: '61552f6d1b293f2508f61d06',
      benefits: [],
      status: 'ACTIVE',
      statusType: 'EMPLOYED',
      tenant: '_iac3p',
      company: {
        _id: '6153e2ebb51335302899a366',
        name: 'Terralogic',
      },
      location: {
        headQuarterAddress: {
          country: {
            _id: 'VN',
            name: 'Viet Nam',
          },
          state: 'Thanh Pho Ho Chi Minh',
          zipCode: '700000',
          addressLine1: '385 Cong Hoa street',
          addressLine2: '385 Cong Hoa street',
          city: 'Ho Chi Minh',
        },
        _id: '6153e2ecb51335302899a36e',
        name: 'Headquarter',
      },
      department: {
        _id: '6153e2ecb51335302899a36f',
        name: 'HR',
      },
      employeeType: {
        _id: '5f50c06f2765da4828f57b0b',
        name: 'Full Time',
      },
      generalInfo: {
        skills: [],
        otherSkills: [],
        legalName: 'Human Resource',
        firstName: 'Human Resource',
        middleName: '',
        lastName: '',
        workEmail: 'comp1-hr-manager@mailinator.com',
        userId: 'comp1-hr-manager',
        workNumber: '',
        personalEmail: 'comp1-hr-manager@mailinator.com',
        isShowAvatar: true,
        status: 'ACTIVE',
        avatar: '',
        employeeId: 'TER-00',
        _id: '61552f6d1b293f2508f61d04',
      },
      managePermission: [
        {
          roles: ['HR', 'HR-MANAGER', 'EMPLOYEE', 'MANAGER'],
          _id: '61552f6d1b293f2508f61d03',
        },
      ],
      manager: {
        employeeType: {},
        title: {},
        department: {},
        location: {
          headQuarterAddress: {
            country: {},
          },
        },
        generalInfo: {},
      },
      title: {
        gradeInfo: {},
        _id: '6153e2ecb51335302899a37c',
        name: 'HR Manager',
        grade: 1,
        gradeObj: null,
      },
    },
    projectManager: {
      _id: '61552f6d1b293f2508f61d02',
      id: '61552f6d1b293f2508f61d02',
      joinDate: '2021-09-29T17:00:00.000Z',
      performanceHistory: '61552f6d1b293f2508f61d05',
      compensation: '61552f6d1b293f2508f61d07',
      timeSchedule: '61552f6d1b293f2508f61d06',
      benefits: [],
      status: 'ACTIVE',
      statusType: 'EMPLOYED',
      tenant: '_iac3p',
      company: {
        _id: '6153e2ebb51335302899a366',
        name: 'Terralogic',
      },
      location: {
        headQuarterAddress: {
          country: {
            _id: 'VN',
            name: 'Viet Nam',
          },
          state: 'Thanh Pho Ho Chi Minh',
          zipCode: '700000',
          addressLine1: '385 Cong Hoa street',
          addressLine2: '385 Cong Hoa street',
          city: 'Ho Chi Minh',
        },
        _id: '6153e2ecb51335302899a36e',
        name: 'Headquarter',
      },
      department: {
        _id: '6153e2ecb51335302899a36f',
        name: 'HR',
      },
      employeeType: {
        _id: '5f50c06f2765da4828f57b0b',
        name: 'Full Time',
      },
      generalInfo: {
        skills: [],
        otherSkills: [],
        legalName: 'Human Resource',
        firstName: 'Human Resource',
        middleName: '',
        lastName: '',
        workEmail: 'comp1-hr-manager@mailinator.com',
        userId: 'comp1-hr-manager',
        workNumber: '',
        personalEmail: 'comp1-hr-manager@mailinator.com',
        isShowAvatar: true,
        status: 'ACTIVE',
        avatar: '',
        employeeId: 'TER-00',
        _id: '61552f6d1b293f2508f61d04',
      },
      managePermission: [
        {
          roles: ['HR', 'HR-MANAGER', 'EMPLOYEE', 'MANAGER'],
          _id: '61552f6d1b293f2508f61d03',
        },
      ],
      manager: {
        employeeType: {},
        title: {},
        department: {},
        location: {
          headQuarterAddress: {
            country: {},
          },
        },
        generalInfo: {},
      },
      title: {
        gradeInfo: {},
        _id: '6153e2ecb51335302899a37c',
        name: 'HR Manager',
        grade: 1,
        gradeObj: null,
      },
    },
    engineeringOwner: {
      _id: '61552f6d1b293f2508f61d02',
      id: '61552f6d1b293f2508f61d02',
      joinDate: '2021-09-29T17:00:00.000Z',
      performanceHistory: '61552f6d1b293f2508f61d05',
      compensation: '61552f6d1b293f2508f61d07',
      timeSchedule: '61552f6d1b293f2508f61d06',
      benefits: [],
      status: 'ACTIVE',
      statusType: 'EMPLOYED',
      tenant: '_iac3p',
      company: {
        _id: '6153e2ebb51335302899a366',
        name: 'Terralogic',
      },
      location: {
        headQuarterAddress: {
          country: {
            _id: 'VN',
            name: 'Viet Nam',
          },
          state: 'Thanh Pho Ho Chi Minh',
          zipCode: '700000',
          addressLine1: '385 Cong Hoa street',
          addressLine2: '385 Cong Hoa street',
          city: 'Ho Chi Minh',
        },
        _id: '6153e2ecb51335302899a36e',
        name: 'Headquarter',
      },
      department: {
        _id: '6153e2ecb51335302899a36f',
        name: 'HR',
      },
      employeeType: {
        _id: '5f50c06f2765da4828f57b0b',
        name: 'Full Time',
      },
      generalInfo: {
        skills: [],
        otherSkills: [],
        legalName: 'Human Resource',
        firstName: 'Human Resource',
        middleName: '',
        lastName: '',
        workEmail: 'comp1-hr-manager@mailinator.com',
        userId: 'comp1-hr-manager',
        workNumber: '',
        personalEmail: 'comp1-hr-manager@mailinator.com',
        isShowAvatar: true,
        status: 'ACTIVE',
        avatar: '',
        employeeId: 'TER-00',
        _id: '61552f6d1b293f2508f61d04',
      },
      managePermission: [
        {
          roles: ['HR', 'HR-MANAGER', 'EMPLOYEE', 'MANAGER'],
          _id: '61552f6d1b293f2508f61d03',
        },
      ],
      manager: {
        employeeType: {},
        title: {},
        department: {},
        location: {
          headQuarterAddress: {
            country: {},
          },
        },
        generalInfo: {},
      },
      title: {
        gradeInfo: {},
        _id: '6153e2ecb51335302899a37c',
        name: 'HR Manager',
        grade: 1,
        gradeObj: null,
      },
    },
    division: {
      status: 'ACTIVE',
      isDefault: true,
      _id: '6153e2ecb51335302899a36f',
      name: 'HR',
      tenant: '_iac3p',
      company: '6153e2ebb51335302899a366',
      departmentId: '0100000001',
      createdAt: '2021-09-29T03:52:12.511Z',
      updatedAt: '2021-09-29T03:52:12.511Z',
    },
  },
];

const wait = (ms) => new Promise((resolve, reject) => setTimeout(resolve, ms));

// fetch
export async function getProjectList(payload) {
  await wait(2000);
  const res = { data: mockDataList, statusCode: 200 };
  return res;
}

export async function getMyTimesheet(payload) {
  await wait(2000);
  const res = { data: mockDataList, statusCode: 200 };
  return res;
}
