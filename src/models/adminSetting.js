import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getListRoles,
  getListTitle,
  removeTitle,
  DepartmentFilter,
  getListPermissionOfRole,
  updateRoleWithPermission,
  getPermissionByIdRole,
  addPosition,
  addDepartment,
  removeDepartment,
  getRolesByCompany,
  setupComplete,
  countEmployee,
} from '../services/adminSetting';

const adminSetting = {
  namespace: 'adminSetting',
  state: {
    listRoleByCompany: [],
    countEmployee: 0,
    idRoles: '',
    originData: {
      totalTitle: 0,
      listTitle: [],
      listRoles: [],
      listPermission: [],
      department: [],
    },
    tempData: {
      listTitle: [],
      totalTitle: 0,
      formatData: [],
      listPermission: [],
      department: [],
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
        const formatData = listRoles.map((item) => {
          const { _id: RolesID, idSync: Rolesname } = item;
          return { RolesID, Rolesname };
        });
        if (statusCode !== 200) throw response;
        localStorage.setItem('dataRoles', JSON.stringify(formatData));
        yield put({ type: 'saveOrigin', payload: { listRoles } });
        yield put({ type: 'saveTemp', payload: { formatData } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListTitle({ payload: { page, limit } }, { call, put }) {
      let resp = [];
      try {
        const response = yield call(getListTitle, {
          page,
          limit,
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: listTitle = [], total: totalTitle } = response;
        if (statusCode !== 200) throw response;
        resp = listTitle;
        yield put({ type: 'saveOrigin', payload: { listTitle, totalTitle } });
        yield put({ type: 'saveTemp', payload: { listTitle, totalTitle } });
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
        const response = yield call(DepartmentFilter, {
          tenantId: getCurrentTenant(),
          company: getCurrentCompany(),
        });
        const { statusCode, data: department = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { department } });
        yield put({ type: 'saveTemp', payload: { department } });
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
        const { statusCode, data: listPermission = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { idRoles } });
        yield put({ type: 'saveOrigin', payload: { listPermission } });
        yield put({ type: 'saveTemp', payload: { listPermission } });
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
    *addDepartment({ payload: { name = '' } }, { call, put }) {
      try {
        const response = yield call(addDepartment, {
          name,
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
