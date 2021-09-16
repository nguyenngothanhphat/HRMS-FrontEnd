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
  addPosition,
  addDepartment,
  removeDepartment,
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
    },
    tempData: {
      listTitles: [],
      totalTitle: 0,
      listRoles: [],
      listPermissions: [],
      listDepartments: [],
    },
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
    *removeTitle({ payload: { id = '' } }, { call }) {
      try {
        const response = yield call(removeTitle, {
          id,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        // yield put({
        //   type: 'fetchListTitle',
        // });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },

    *fetchDepartment(_, { call, put }) {
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
      try {
        const response = yield call(addPosition, {
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
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },
    *addDepartment({ payload }, { call, put }) {
      try {
        const response = yield call(addDepartment, {
          ...payload,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({ type: 'fetchDepartment' });
      } catch (errors) {
        dialog(errors);
      }
    },
    *removeDepartment({ payload: { id = '' } }, { call, put }) {
      try {
        const response = yield call(removeDepartment, {
          id,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({ type: 'fetchDepartment' });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
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
