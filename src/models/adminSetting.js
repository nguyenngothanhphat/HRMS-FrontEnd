import { notification } from 'antd';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import {
  getListRoles,
  getPermissionList,
  getListTitle,
  removeTitle,
  getListDepartments,
  getListPermissionOfRole,
  updateRoleWithPermission,
  getPermissionByIdRole,
  // POSITION
  addPosition,
  getPositionByID,
  updatePosition,

  // DEPARTMENT
  addDepartment,
  removeDepartment,
  getDepartmentByID,
  updateDepartment,
  getRolesByCompany,
  setupComplete,
  countEmployee,
  addRole,
  removeRole,
} from '../services/adminSetting';

const adminSetting = {
  namespace: 'adminSetting',
  state: {
    listRoleByCompany: [],
    countEmployee: 0,
    idRoles: '',
    permissionList: [],
    originData: {
      totalTitle: 0,
      listTitles: [],
      listRoles: [],
      listPermissions: [],
      listDepartments: [],
      listGrades: [],
    },
    tempData: {
      listTitles: [],
      totalTitle: 0,
      listRoles: [],
      listPermissions: [],
      listDepartments: [],
      listGrades: [],
    },
    viewingPosition: {},
    viewingDepartment: {},
  },
  effects: {
    *fetchListRoles({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListRoles, {
          ...payload,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: listRoles = [] } = response;
        if (statusCode !== 200) throw response;
        // localStorage.setItem('dataRoles', JSON.stringify(formatData));
        yield put({ type: 'saveOrigin', payload: { listRoles } });
        yield put({ type: 'saveTemp', payload: { listRoles } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchPermissionList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getPermissionList, payload);
        const { statusCode, data: permissionList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { permissionList } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListTitle({ payload: { page, limit } }, { call, put }) {
      const resp = [];
      try {
        const response = yield call(getListTitle, {
          page,
          limit,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: listTitles = [], total: totalTitle } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { listTitles, totalTitle } });
        yield put({ type: 'saveTemp', payload: { listTitles, totalTitle } });
      } catch (errors) {
        dialog(errors);
      }
      return resp;
    },
    *countEmployeeInPosition({ payload: { title } }, { call, put }) {
      try {
        const response = yield call(countEmployee, {
          title,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;

        yield put({ type: 'save', payload: { countEmployee: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *removePosition({ payload: { id = '' } }, { call }) {
      let response = {};
      try {
        response = yield call(removeTitle, {
          id,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
        return 0;
      }
      return response;
    },

    *fetchDepartmentList(_, { call, put }) {
      try {
        const response = yield call(getListDepartments, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: listDepartments = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { listDepartments } });
        yield put({ type: 'saveTemp', payload: { listDepartments } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListPermissionOfRole({ payload: { idRoles = '' } }, { call, put }) {
      try {
        const response = yield call(getListPermissionOfRole, {
          idRoles,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data: listPermissions = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { idRoles } });
        yield put({ type: 'saveOrigin', payload: { listPermissions } });
        yield put({ type: 'saveTemp', payload: { listPermissions } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchPermissionByIdRole({ payload: { id: _id = '' } = {} }, { call }) {
      let resp = [];
      try {
        const response = yield call(getPermissionByIdRole, {
          _id,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        });
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        resp = data;
      } catch (errors) {
        dialog(errors);
      }
      return resp;
    },
    *updatePermission({ payload: { getValues = {} } }, { call }) {
      try {
        const response = yield call(updateRoleWithPermission, {
          ...getValues,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addPosition({ payload: { name = '', grade = 1, department = '' } }, { call }) {
      let response = {};
      try {
        response = yield call(addPosition, {
          name,
          grade,
          department,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        // yield put({ type: 'fetchListTitle' });
        // return
      } catch (errors) {
        dialog(errors);
        return 0;
      }
      return response;
    },
    *fetchPositionByID({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getPositionByID, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { viewingPosition: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *updatePosition({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updatePosition, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    // DEPARTMENT
    *addDepartment({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(addDepartment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *removeDepartment({ payload: { id = '' } }, { call }) {
      let response = {};
      try {
        response = yield call(removeDepartment, {
          id,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },
    *fetchDepartmentByID({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(getDepartmentByID, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { viewingDepartment: data } });
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *updateDepartment({ payload }, { call }) {
      let response = {};
      try {
        response = yield call(updateDepartment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
      } catch (errors) {
        dialog(errors);
      }
      return response;
    },

    *getRolesByCompany({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getRolesByCompany, { company, tenantId: getCurrentTenant() });
        const { statusCode, data: listRoleByCompany = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listRoleByCompany } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *setupComplete(_, { call, put }) {
      try {
        const response = yield call(setupComplete);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'user/fetchCurrent',
        });
      } catch (errors) {
        dialog(errors);
      }
    },

    // roles
    *addRole({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addRole, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchListRoles',
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *removeRole({ payload = {} }, { call, put }) {
      try {
        const response = yield call(removeRole, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({
          type: 'fetchListRoles',
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
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
    saveOrigin(state, action) {
      const { originData } = state;
      return {
        ...state,
        originData: {
          ...originData,
          ...action.payload,
        },
      };
    },
    saveTemp(state, action) {
      const { tempData } = state;
      return {
        ...state,
        tempData: {
          ...tempData,
          ...action.payload,
        },
      };
    },
  },
};
export default adminSetting;
