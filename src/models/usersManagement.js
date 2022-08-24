import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  getEmployeesList,
  getCompanyList,
  getLocationList,
  getEmployeeDetailById,
  getRoleList,
  updateEmployee,
  getRolesByEmployee,
  resetPasswordByEmail,
  getFilterList,
  searchEmployees,
} from '../services/usersManagement';

const usersManagement = {
  namespace: 'usersManagement',
  state: {
    employeeList: [],
    company: [],
    location: [],
    roleList: [],
    jobTitleList: [],
    reportingManagerList: [],
    employeeDetail: [],
    filter: [],
    rolesByEmployee: [],
    clearFilter: false,
    clearName: false,
    filterList: {},
    selectedUserId: '',
    selectedUserTenant: '',
    total: 0,
  },
  effects: {
    *fetchEmployeesList({ params }, { call, put }) {
      let response = {};
      try {
        response = yield call(getEmployeesList, params);
        const { statusCode, data: employeeList = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: { employeeList, total: response.total },
        });

        yield put({
          type: 'save',
          payload: { currentPayload: params },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *searchEmployeesEffect({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(searchEmployees, {
          company: getCurrentCompany(),
          ...payload,
          tenantId: getCurrentTenant(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
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
    *fetchCompanyList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getCompanyList, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { company: data?.listCompany || [] } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLocationList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getLocationList, payload);
        const { statusCode, data: location = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { location } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchRoleList(_, { call, put }) {
      try {
        const response = yield call(getRoleList, {
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: roleList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { roleList } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchEmployeeDetail({ payload = {}, params = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeeDetailById, payload, params);
        const { statusCode, data: employeeDetail = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeDetail } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },

    // update employee
    *updateEmployee({ payload = {}, params }, { call }) {
      try {
        const response = yield call(updateEmployee, payload, params);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return null;
      }
    },

    *removeEmployee({ payload = {}, params = {} }, { call }) {
      try {
        const response = yield call(updateEmployee, payload, params);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Employee Inactivated!',
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return null;
      }
    },

    // update role by employee
    *getRolesByEmployee({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getRolesByEmployee, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { rolesByEmployee: data?.roles || [] } });
        return response;
      } catch (errors) {
        dialog(errors);
        return '';
      }
    },
    *resetPasswordByEmail({ email = '' }, { call }) {
      try {
        const response = yield call(resetPasswordByEmail, { email });
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
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

    clearFilter(state) {
      return {
        ...state,
        filter: {},
      };
    },
  },
};
export default usersManagement;
