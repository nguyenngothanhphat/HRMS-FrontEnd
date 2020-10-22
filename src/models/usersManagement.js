import { dialog } from '@/utils/utils';
// import { notification } from 'antd';
import {
  getEmployeesList,
  getCompanyList,
  getLocationList,
  getEmployeeDetailById,
  getRoleList,
} from '../services/usersManagement';

const usersManagement = {
  namespace: 'usersManagement',
  state: {
    activeEmployeesList: [],
    inActiveEmployeesList: [],
    company: [],
    location: [],
    roles: [],
    jobTitleList: [],
    reportingManagerList: [],
    employeeDetail: [],
    filter: [],
    clearFilter: false,
    clearName: false,
  },
  effects: {
    *fetchActiveEmployeesList({ payload: { status = 'ACTIVE' } = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeesList, {
          status,
        });
        const { statusCode, data: activeEmployeesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { activeEmployeesList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchInActiveEmployeesList({ payload: { status = 'INACTIVE' } = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeesList, {
          status,
        });
        const { statusCode, data: inActiveEmployeesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { inActiveEmployeesList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCompanyList(_, { call, put }) {
      try {
        const response = yield call(getCompanyList);
        const { statusCode, data: company = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { company } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLocationList(_, { call, put }) {
      try {
        const response = yield call(getLocationList, {});
        const { statusCode, data: location = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { location } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchRoleList(_, { call, put }) {
      try {
        const response = yield call(getRoleList, {});
        const { statusCode, data: roles = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { roles } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchEmployeeDetail({ id = '' }, { call, put }) {
      try {
        const response = yield call(getEmployeeDetailById, { id });
        const { statusCode, data: employeeDetail = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeDetail } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
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
  },
};
export default usersManagement;
