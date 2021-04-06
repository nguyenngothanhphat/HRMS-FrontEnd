import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  LocationFilter,
  DepartmentFilter,
  EmployeeTypeFilter,
  getListEmployeeMyTeam,
  getListEmployeeActive,
  getListEmployeeInActive,
  getDataOrgChart,
  getListAdministrator,
} from '../services/employee';
import { addEmployee, updateEmployee } from '../services/employeesManagement';

const employee = {
  namespace: 'employee',
  state: {
    filter: [],
    location: [],
    department: [],
    employeetype: [],
    listEmployeeMyTeam: [],
    listEmployeeActive: [],
    listEmployeeInActive: [],
    dataRadio: [],
    clearFilter: false,
    clearName: false,
    dataOrgChart: {},
    listAdministrator: [],
  },
  effects: {
    *fetchEmployeeType(_, { call, put }) {
      try {
        const response = yield call(EmployeeTypeFilter);
        const { statusCode, data: employeetype = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveEmployeeType', payload: { employeetype } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLocation({ payload }, { call, put }) {
      try {
        const response = yield call(LocationFilter, payload);
        const { statusCode, data: location = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveLocation', payload: { location } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDepartment(_, { call, put }) {
      try {
        const response = yield call(DepartmentFilter);
        const { statusCode, data: department = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveDeparment', payload: { department } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListEmployeeMyTeam(
      {
        payload: {
          company = '',
          department = [],
          location = [],
          employeeType = [],
          name = '',
        } = {},
      },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployeeMyTeam, {
          company,
          department,
          location,
          employeeType,
          name,
        });
        const { statusCode, data: listEmployeeMyTeam = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listEmployeeMyTeam', payload: { listEmployeeMyTeam } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListEmployeeActive(
      {
        payload: {
          company = [],
          department = [],
          location = [],
          employeeType = [],
          name = '',
        } = {},
      },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployeeActive, {
          company,
          department,
          location,
          employeeType,
          name,
        });
        const { statusCode, data: listEmployeeActive = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({ type: 'listEmployeeActive', payload: { listEmployeeActive } });
        return listEmployeeActive;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },
    *fetchListEmployeeInActive(
      {
        payload: {
          company = [],
          department = [],
          location = [],
          employeeType = [],
          name = '',
        } = {},
      },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployeeInActive, {
          company,
          department,
          location,
          employeeType,
          name,
        });
        const { statusCode, data: listEmployeeInActive = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listEmployeeInActive', payload: { listEmployeeInActive } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDataOrgChart(_, { call, put }) {
      try {
        const response = yield call(getDataOrgChart);
        const { statusCode, data: { chart: dataOrgChart = {} } = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { dataOrgChart } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addEmployee({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(addEmployee, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Add Employee Successfully',
        });
        yield put({ type: 'fetchListEmployeeActive', payload: { company: payload?.company } });
        yield put({ type: 'fetchListAdministrator', payload: { company: payload?.company } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchListAdministrator({ payload: { company = '' } = {} }, { call, put }) {
      try {
        const response = yield call(getListAdministrator, { company });
        const { statusCode, data: listAdministrator = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listAdministrator } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateEmployee({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(updateEmployee, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Update Employee Successfully',
        });
        yield put({ type: 'fetchListEmployeeActive', payload: { company: payload?.company } });
        yield put({ type: 'fetchListAdministrator', payload: { company: payload?.company } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
  },
  reducers: {
    saveFilter(state, action) {
      const data = [...state.filter];
      const actionFilter = action.payload;
      const findIndex = data.findIndex((item) => item.actionFilter.name === actionFilter.name);
      if (findIndex < 0) {
        const item = { actionFilter };
        data.push(item);
      } else {
        data[findIndex] = {
          ...data[findIndex],
          checkedList: actionFilter.checkedList,
        };
      }
      return {
        ...state,
        clearFilter: false,
        filter: [...data],
      };
    },
    ClearFilter(state) {
      return {
        ...state,
        clearFilter: true,
        clearName: true,
        filter: [],
      };
    },
    offClearName(state) {
      return {
        ...state,
        clearName: false,
      };
    },
    saveEmployeeType(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveLocation(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveDeparment(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listEmployeeMyTeam(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listEmployeeActive(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    listEmployeeInActive(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default employee;
