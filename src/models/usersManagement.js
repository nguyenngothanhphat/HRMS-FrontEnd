import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getEmployeesList,
  getCompanyList,
  getLocationList,
  getEmployeeDetailById,
  getRoleList,
  updateEmployee,
  updateRolesByEmployee,
  getRolesByEmployee,
  updateGeneralInfo,
  resetPasswordByEmail,
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
    rolesByEmployee: [],
    clearFilter: false,
    clearName: false,
  },
  effects: {
    *fetchActiveEmployeesList(
      { payload: { status = 'ACTIVE', location = [], roles = [], company = [], name = '' } = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getEmployeesList, {
          status,
          location,
          roles,
          company,
          name,
        });
        const { statusCode, data: activeEmployeesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { activeEmployeesList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchInActiveEmployeesList(
      { payload: { status = 'INACTIVE', location = [], roles = [], company = [], name = '' } = {} },
      { call, put },
    ) {
      try {
        const response = yield call(getEmployeesList, {
          status,
          location,
          roles,
          company,
          name,
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

    // update employee
    *updateEmployee({ id = '', location = '', company = '', status = '' }, { call }) {
      try {
        const response = yield call(updateEmployee, { id, location, company, status });
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return null;
      }
    },

    *removeEmployee({ id = '' }, { call }) {
      try {
        const response = yield call(updateEmployee, { id, status: 'INACTIVE' });
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
    *getRolesByEmployee({ employee = '' }, { call, put }) {
      try {
        const response = yield call(getRolesByEmployee, { employee });
        const { statusCode, data: rolesByEmployee = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { rolesByEmployee } });
        return response;
      } catch (errors) {
        dialog(errors);
        return '';
      }
    },

    // update role by employee
    *updateRolesByEmployee({ employee = '', roles = [] }, { call }) {
      try {
        const response = yield call(updateRolesByEmployee, { employee, roles });
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateGeneralInfo({ id = '', workEmail = '', firstName = '', lastName = '' }, { call }) {
      try {
        const response = yield call(updateGeneralInfo, { id, workEmail, firstName, lastName });
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
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
