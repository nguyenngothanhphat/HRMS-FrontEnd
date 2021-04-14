import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getEmployeesList,
  getRoleList,
  getCompanyList,
  getLocationList,
  getDepartmentList,
  getJobTitleList,
  getReportingManagerList,
  addEmployee,
  importEmployees,
  searchEmployees,
  getEmployeeDetailById,
  updateEmployee,
  importEmployeeTenant,
} from '../services/employeesManagement';

const employeesManagement = {
  namespace: 'employeesManagement',
  state: {
    activeEmployeesList: [],
    inActiveEmployeesList: [],
    searchEmployeesList: [],
    rolesList: [],
    companyList: [],
    locationList: [],
    departmentList: [],
    jobTitleList: [],
    reportingManagerList: [],
    statusImportEmployees: false,
    statusAddEmployee: false,
    returnEmployeesList: {},
    filter: [],
    employeeDetail: {},
    clearFilter: false,
    clearName: false,
  },
  effects: {
    *fetchActiveEmployeesList(
      {
        payload: {
          status = 'ACTIVE',
          department = [],
          location = [],
          company = [],
          employeeType = [],
          name = '',
        } = {},
      },
      { call, put },
    ) {
      try {
        const response = yield call(getEmployeesList, {
          status,
          name,
          department,
          location,
          company,
          employeeType,
        });
        const { statusCode, data: activeEmployeesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { activeEmployeesList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchInActiveEmployeesList(
      {
        payload: {
          status = 'INACTIVE',
          department = [],
          location = [],
          employeeType = [],
          name = '',
        } = {},
      },
      { call, put },
    ) {
      try {
        const response = yield call(getEmployeesList, {
          status,
          name,
          department,
          location,
          employeeType,
        });
        const { statusCode, data: inActiveEmployeesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { inActiveEmployeesList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchSearchEmployeesList({ payload: { query = '' } = {} }, { call, put }) {
      try {
        const response = yield call(searchEmployees, {
          query,
        });
        const { statusCode, data: searchEmployeesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { searchEmployeesList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchRolesList(_, { call, put }) {
      try {
        const response = yield call(getRoleList, {});
        const { statusCode, data: rolesList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { rolesList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchCompanyList(_, { call, put }) {
      try {
        const response = yield call(getCompanyList);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            companyList: data?.listCompany,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchLocationList({ payload: { company = '', tenantId = '' } }, { call, put }) {
      try {
        const response = yield call(getLocationList, { tenantId, company });
        const { statusCode, data: locationList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { locationList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDepartmentList({ payload: { company = '', tenantId = '' } }, { call, put }) {
      try {
        const response = yield call(getDepartmentList, { company, tenantId });
        const { statusCode, data: departmentList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { departmentList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchJobTitleList(_, { call, put }) {
      try {
        const response = yield call(getJobTitleList);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { jobTitleList: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchReportingManagerList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getReportingManagerList, payload);
        const { statusCode, data: reportingManagerList = [] } = response;
        console.log('payload', payload);
        console.log('response', response);
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { reportingManagerList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addEmployee({ payload }, { call, put }) {
      let statusAddEmployee = false;
      try {
        const response = yield call(addEmployee, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message:'Add employee successfully!',
        });
        statusAddEmployee = true;
      } catch (errors) {
        statusAddEmployee = false;
        dialog(errors);
      }
      yield put({ type: 'save', payload: { statusAddEmployee } });
    },
    *importEmployees({ payload, isAccountSetup = false }, { call, put }) {
      let statusImportEmployees = false;
      try {
        const response = yield call(importEmployees, payload);
        const { statusCode, message, data: returnEmployeesList = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        statusImportEmployees = true;
        yield put({ type: 'save', payload: { returnEmployeesList } });
        if (isAccountSetup) {
          yield put({
            type: 'employee/fetchListEmployeeActive',
            payload: { company: payload?.company },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
      yield put({ type: 'save', payload: { statusImportEmployees } });
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
    // tenant
    *importEmployeesTenant({ payload, isAccountSetup = false }, { call, put }) {
      let statusImportEmployees = false;
      try {
        const response = yield call(importEmployeeTenant, payload);
        const { statusCode, message, data: listEmployeesTenant = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        statusImportEmployees = true;
        yield put({ type: 'save', payload: { listEmployeesTenant } });
        if (isAccountSetup) {
          yield put({
            type: 'employee/fetchListEmployeeActive',
            payload: { company: payload?.company },
          });
        }
      } catch (errors) {
        dialog(errors);
      }
      yield put({ type: 'save', payload: { statusImportEmployees } });
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
export default employeesManagement;
