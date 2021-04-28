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
  getLocationListByParentCompany,
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
    *fetchEmployeesList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getEmployeesList, payload);
        const { statusCode, data: listEmployee = [] } = response;
        if (statusCode !== 200) throw response;

        const { status = [] } = payload;
        if (status.includes('ACTIVE')) {
          yield put({ type: 'save', payload: { activeEmployeesList: listEmployee } });
        }
        if (status.includes('INACTIVE')) {
          yield put({ type: 'save', payload: { inActiveEmployeesList: listEmployee } });
        }
        return listEmployee;
      } catch (errors) {
        dialog(errors);
        return [];
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
        const response = yield call(getRoleList, {});
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
      } catch (errors) {
        dialog(errors);
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
