import { dialog } from '@/utils/utils';
import { getCurrentTenant } from '@/utils/authority';
import {
  listProjectByCompany,
  addProjectMember,
  listProjectRole,
  addProject,
  getReportingManagerList,
} from '../services/projectManagement';
// import { getRoleList } from '../services/usersManagement';
// import { getListEmployee } from '../services/employee';

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

// const formatDay = (day) => {
//   const nth = (d) => {
//     if (d > 3 && d < 21) return 'th';
//     switch (d % 10) {
//       case 1:
//         return 'st';
//       case 2:
//         return 'nd';
//       case 3:
//         return 'rd';
//       default:
//         return 'th';
//     }
//   };
//   return day + nth(day);
// };

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
    activeList: [],
    inactiveList: [],
    // roleList: MOCK_ROLE,
    // employeeList: MOCK_EMPLOYEE,
    roleList: [],
    employeeList: [],
    totalActive: '',
    totalInactive: '',
  },
  effects: {
    *getProjectByCompany({ payload }, { call, put }) {
      let response;
      try {
        response = yield call(listProjectByCompany, { ...payload, tenantId: getCurrentTenant() });
        // console.log(response);
        const { data = [] } = response;
        const inactiveList = [];
        const activeList = [];
        const { ACTIVE, INACTIVE } = PROJECT_STATUS;
        data.forEach((item) => {
          const {
            status,
            _id,
            name: projectName,
            createdAt: createdDate,
            manager: { generalInfo: { legalName: managerName } = {} } = {},
            beginDate,
            projectHealth,
            company,
          } = item;
          const project = {
            // projectId: _id.substring(_id.length - 4, _id.length) || '',
            projectId: _id,
            projectName: projectName || '',
            createdDate: formatCreatedDate(createdDate) || '',
            projectManager: managerName || '',
            startDate: formatStartDate(beginDate) || '',
            projectHealth: (projectHealth && `${projectHealth}%`) || '',
            company,
          };

          // console.log(project);
          if (status === ACTIVE) {
            activeList.push(project);
          }
          if (status === INACTIVE) {
            inactiveList.push(project);
          }
        });

        if (activeList.length > 0) {
          yield put({
            type: 'save',
            payload: {
              totalActive: response.total,
            },
          });
        } else if (inactiveList.length > 0) {
          yield put({
            type: 'save',
            payload: {
              totalInactive: response.total,
            },
          });
        }

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

    *addNewProject({ payload }, { call }) {
      let response;
      try {
        response = yield call(addProject, { ...payload, tenantId: getCurrentTenant() });
        if (response.statusCode !== 200) {
          dialog(response);
        }
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *addMember({ payload }, { call }) {
      let response;
      try {
        response = yield call(addProjectMember, { ...payload, tenantId: getCurrentTenant() });
        if (response.statusCode !== 200) {
          dialog(response);
        }
      } catch (error) {
        dialog(error);
      }
      return response;
    },

    *getEmployees({ payload }, { call, put }) {
      let response;
      let response2;
      try {
        // REMEMBER TO ADD ACTIVE STATUS TO PAYLOAD
        response = yield call(getReportingManagerList, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        response2 = yield call(listProjectRole);
        const { data: dataEmployee = [] } = response;
        const { data: dataRole = [] } = response2;

        const listEmployee = dataEmployee.map(
          ({ _id = '', generalInfo: { firstName = '' } = {} }) => ({
            id: _id,
            name: firstName,
          }),
        );

        const listRole = dataRole.map((item) => item);

        yield put({
          type: 'save',
          payload: {
            employeeList: listEmployee,
            roleList: listRole,
          },
        });
        if (response.statusCode !== 200) {
          dialog(response);
        }
        if (response2.statusCode !== 200) {
          dialog(response2);
        }
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
