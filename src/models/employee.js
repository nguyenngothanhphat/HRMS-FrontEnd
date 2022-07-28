import { message, notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  LocationFilter,
  DepartmentFilter,
  EmployeeTypeFilter,
  getFilterList,
  getSkillList,
  getListEmployee,
  getDataOrgChart,
  getListAdministrator,
  getListExportEmployees,
  getListEmployeeSingleCompany,
  getListMyTeam,
} from '../services/employee';
import { addEmployee, updateEmployee } from '../services/employeesManagement';

const employee = {
  namespace: 'employee',
  state: {
    filter: {},
    location: [],
    department: [],
    employeetype: [],
    listSkill: [],
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
    totalActiveEmployee: '',
    totalInactiveEmployee: '',
    totalMyTeam: '',
    employeeIDList: [], // for filter pane
    employeeNameList: [], // for filter pane
    managerList: [], // for filter pane
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
    *fetchSkillList(_, { call, put }) {
      try {
        const response = yield call(getSkillList);
        const { statusCode, data: listSkill = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listSkill } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListEmployeeMyTeam({ payload = {} }, { call, put }) {
      try {
        const currentPayload = {
          ...payload,
          status: ['ACTIVE'],
          tenantId: getCurrentTenant(),
        };
        const response = yield call(getListMyTeam, currentPayload);
        const { statusCode, data: listEmployeeMyTeam = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'listEmployeeMyTeam',
          payload: { listEmployeeMyTeam, totalMyTeam: response.total },
        });
        yield put({
          type: 'save',
          payload: { currentPayload },
        });
        return listEmployeeMyTeam;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },
    *fetchListEmployeeActive({ payload = {}, params }, { call, put }) {
      try {
        const currentPayload = {
          ...payload,
          status: ['ACTIVE'],
        };
        const response = yield call(getListEmployee, currentPayload, params);
        const { statusCode, data: listEmployeeActive = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'listEmployeeActive',
          payload: { listEmployeeActive, totalActiveEmployee: response.total },
        });
        yield put({
          type: 'save',
          payload: { currentPayload },
        });
        return listEmployeeActive;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },
    *fetchListEmployeeInActive({ payload = {}, params }, { call, put }) {
      try {
        const currentPayload = {
          ...payload,
          status: ['INACTIVE'],
        };
        const response = yield call(getListEmployee, currentPayload, params);
        const { statusCode, data: listEmployeeInActive = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'listEmployeeInActive',
          payload: { listEmployeeInActive, totalInactiveEmployee: response.total },
        });
        yield put({
          type: 'save',
          payload: { currentPayload },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchDataOrgChart({ payload }, { call, put }) {
      try {
        const tenantId = getCurrentTenant();
        const company = getCurrentCompany();
        const response = yield call(getDataOrgChart, { ...payload, tenantId, company });
        const { statusCode, data: dataOrgChart = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { dataOrgChart } });
        return response;
      } catch (errors) {
        dialog(errors);
        return 0;
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
    *fetchAllListUser({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListEmployeeSingleCompany, {
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
          ...payload,
        });
        const { statusCode, data: listEmployeeAll = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({ type: 'listEmployeeAll', payload: { listEmployeeAll } });
      } catch (errors) {
        // dialog(errors);
      }
      return response;
    },

    *exportEmployees({ payload }, { call }) {
      try {
        const hide = message.loading('Exporting data...', 0);
        const response = yield call(getListExportEmployees, {
          ...payload,
          tenantId: getCurrentTenant(),
        });
        hide();
        return response;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },
    // for filter pane
    *fetchEmployeeIDListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListEmployeeSingleCompany, {
          company: getCurrentCompany(),
          ...payload,
          tenantId: getCurrentTenant(),
          status: ['ACTIVE', 'INACTIVE'],
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            employeeIDList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchEmployeeNameListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListEmployeeSingleCompany, {
          company: getCurrentCompany(),
          ...payload,
          tenantId: getCurrentTenant(),
          status: ['ACTIVE', 'INACTIVE'],
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            employeeNameList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchManagerListEffect({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getListEmployeeSingleCompany, {
          company: getCurrentCompany(),
          ...payload,
          tenantId: getCurrentTenant(),
          status: ['ACTIVE', 'INACTIVE'],
        });
        const { statusCode, data = [] } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            managerList: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
  },

  reducers: {
    clearFilter(state) {
      return {
        ...state,
        filter: {},
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
    saveFilter(state, action) {
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
      };
    },
  },
};
export default employee;
