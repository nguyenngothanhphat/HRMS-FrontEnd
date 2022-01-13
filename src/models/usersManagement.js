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
  updateRolesByEmployee,
  getRolesByEmployee,
  updateGeneralInfo,
  resetPasswordByEmail,
  getLocationListByParentCompany,
  getFilterList,
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
    filterList: {},
    selectedUserId: '',
    selectedUserTenant: '',
    totalActiveEmployee: '',
    totalInactiveEmploiyee: '',
  },
  effects: {
    *fetchEmployeesList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeesList, payload);
        const { statusCode, data: listEmployee = [] } = response;
        if (statusCode !== 200) throw response;

        const { status = [] } = payload;
        if (status.includes('ACTIVE')) {
          yield put({
            type: 'save',
            payload: { activeEmployeesList: listEmployee, totalActiveEmployee: response.total },
          });
        }
        if (status.includes('INACTIVE')) {
          yield put({
            type: 'save',
            payload: { inActiveEmployeesList: listEmployee, totalInactiveEmployee: response.total },
          });
        }
        yield put({
          type: 'save',
          payload: { currentPayload: payload },
        });
        return listEmployee;
      } catch (errors) {
        dialog(errors);
        return [];
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
    *fetchOwnerLocationList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getLocationListByParentCompany, payload);
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
        const { statusCode, data: roles = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { roles } });
      } catch (errors) {
        dialog(errors);
      }
    },

    *fetchEmployeeDetail({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeeDetailById, payload);
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
    *updateEmployee({ payload = {} }, { call }) {
      try {
        const response = yield call(updateEmployee, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return null;
      }
    },

    *removeEmployee({ payload = {} }, { call }) {
      try {
        const response = yield call(updateEmployee, payload);
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

    // update role by employee
    *updateRolesByEmployee({ payload = {} }, { call }) {
      try {
        const response = yield call(updateRolesByEmployee, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateGeneralInfo({ payload = {} }, { call }) {
      try {
        const response = yield call(updateGeneralInfo, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
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
  },
};
export default usersManagement;
