import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  LocationFilter,
  LocationOwnerFilter,
  DepartmentFilter,
  EmployeeTypeFilter,
  getFilterList,
  getListEmployee,
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
    listEmployeeAll: [],
    dataRadio: [],
    clearFilter: false,
    clearName: false,
    dataOrgChart: {},
    listAdministrator: [],
    filterList: {},
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
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchOwnerLocation({ payload }, { call, put }) {
      try {
        const response = yield call(LocationOwnerFilter, payload);
        const { statusCode, data: location = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveLocation', payload: { location } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchDepartment({ payload = {} }, { call, put }) {
      try {
        const response = yield call(DepartmentFilter, payload);
        const { statusCode, data: department = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveDepartment', payload: { department } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchFilterList({ payload }, { call, put }) {
      try {
        const response = yield call(getFilterList, payload);
        const { statusCode, data: filterList = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { filterList } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
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
          title = [],
        } = {},
      },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployee, {
          status: ['ACTIVE'],
          company,
          department,
          location,
          employeeType,
          name,
          title,
        });
        const { statusCode, data: listEmployeeMyTeam = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listEmployeeMyTeam', payload: { listEmployeeMyTeam } });
        return listEmployeeMyTeam;
      } catch (errors) {
        dialog(errors);
        return 0;
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
          title = [],
          skill = [],
        } = {},
      },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployee, {
          status: ['ACTIVE'],
          company,
          department,
          location,
          employeeType,
          name,
          title,
          skill,
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
          title = [],
        } = {},
      },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployee, {
          status: ['INACTIVE'],
          company,
          department,
          location,
          employeeType,
          name,
          title,
        });
        const { statusCode, data: listEmployeeInActive = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'listEmployeeInActive', payload: { listEmployeeInActive } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDataOrgChart({ payload: { tenantId = '', company = '' } = {} }, { call, put }) {
      try {
        const response = yield call(getDataOrgChart, { tenantId, company });
        const { statusCode, data: dataOrgChart = {} } = response;
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
    *fetchAllListUser(
      {
        payload: {
          company = [],
          department = [],
          location = [],
          employeeType = [],
          name = '',
          title = [],
          skill = [],
        } = {},
      },
      { call, put },
    ) {
      try {
        const response = yield call(getListEmployee, {
          status: ['ACTIVE', 'INACTIVE'],
          company,
          department,
          location,
          employeeType,
          name,
          title,
          skill,
        });
        const { statusCode, data: listEmployeeAll = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({ type: 'listEmployeeAll', payload: { listEmployeeAll } });
        return listEmployeeAll;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },
  },
  reducers: {
    saveFilter(state, action) {
      const data = [...state.filter];
      const actionFilter = action.payload;
      const findIndex = data.findIndex((item) => item.actionFilter.name === actionFilter.name);
      if (findIndex < 0) {
        const item = {
          actionFilter: {
            name: actionFilter?.name,
          },
        };
        item.checkedList = actionFilter?.checkedList;
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
    saveDepartment(state, action) {
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
    listEmployeeAll(state, action) {
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
