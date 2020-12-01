import { dialog } from '@/utils/utils';
import listProjectByCompany from '../services/projectManagement';

const mockData = [
  {
    key: '1',
    projectId: '8097',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
  {
    key: '2',
    projectId: '8098',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
  {
    key: '3',
    projectId: '8099',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
  {
    key: '4',
    projectId: '8100',
    projectName: 'Cisco',
    createdDate: 'Aug-7, 20',
    projectManager: 'Vamsi Venkat Krishna',
    duration: '',
    startDate: '20.08.2020',
    members: '',
    projectHealth: '60%',
    action: 'View Project',
  },
];

const PROJECT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

const formatMonth = (month) => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return monthNames[month];
};

const formatDay = (day) => {
  const nth = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };
  return day + nth(day);
};

const getDate = (date) => {
  if (!date) {
    return '';
  }
  const dateObj = new Date(date);
  const month = dateObj.getUTCMonth(); // months from 1-12
  // const month = dateObj.getUTCMonth() + 1; // months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  // console.log(day, month, year);
  return {
    day,
    month,
    year,
  };
};

const formatCreatedDate = (date) => {
  const { day, month, year } = getDate(date);
  const newMonth = formatMonth(month).substring(0, 3);
  const newYear = year.toString().substring(year.length - 2, year.length);
  const newDate = `${newMonth}-${day},${newYear}`;
  return newDate;
};

const formatStartDate = (date) => {
  const { day, month, year } = getDate(date);
  const newDate = `${day}.${month}.${year}`;
  return newDate;
};

const projectManagement = {
  namespace: 'projectManagement',
  state: {
    activeList: mockData,
    inactiveList: mockData,
  },
  effects: {
    *getProjectByCompany({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(listProjectByCompany, payload);
        console.log(response);
        const { data = [] } = response;
        const inactiveList = [];
        const activeList = [];
        const { ACTIVE, INACTIVE } = PROJECT_STATUS;
        data.forEach((item) => {
          // const {status, beginDate, createdAt, projectHealth, name, _id}
          // console.log(item);
          const {
            status,
            _id,
            name: projectName,
            createdAt: createdDate,
            manager: { generalInfo: { legalName: managerName } = {} } = {},
            beginDate,
            projectHealth,
          } = item;
          const project = {
            projectId: _id.substring(_id.length - 4, _id.length) || '',
            projectName: projectName || '',
            createdDate: formatCreatedDate(createdDate) || '',
            projectManager: managerName || '',
            startDate: formatStartDate(beginDate) || '',
            projectHealth: (projectHealth && `${projectHealth}%`) || '',
          };

          // console.log(project);
          if (status === ACTIVE) {
            activeList.push(project);
          }
          if (status === INACTIVE) {
            inactiveList.push(project);
          }
        });
        console.log(activeList);
        console.log(inactiveList);
        yield put({
          type: 'save',
          payload: {
            activeList,
            inactiveList,
          },
        });
      } catch (error) {
        dialog(error);
      }
      return response;
    },
  },
  reducers: {
    save(state, action) {
      const { payload } = action;
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default projectManagement;
