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
} from '../services/adminSetting';

const adminSetting = {
  namespace: 'adminSetting',
  state: {
    listRoleByCompany: [],
    idRoles: '',
    originData: {
      listTitle: [],
      listRoles: [],
      listPermission: [],
      newListPermission: [],
      department: [],
    },
    tempData: {
      listTitle: [],
      formatData: [],
      listPermission: [],
      newListPermission: [],
      department: [],
    },
  },
  effects: {
    *fetchListRoles(_, { call, put }) {
      try {
        const response = yield call(getListRoles);
        const { statusCode, data: listRoles = [] } = response;
        const formatData = listRoles.map((item) => {
          const { _id: RolesID, name: Rolesname } = item;
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
    *fetchListTitle(_, { call, put }) {
      let resp = [];
      try {
        const response = yield call(getListTitle);
        const { statusCode, data: listTitle = [] } = response;
        if (statusCode !== 200) throw response;
        resp = listTitle;
        yield put({ type: 'saveOrigin', payload: { listTitle } });
        yield put({ type: 'saveTemp', payload: { listTitle } });
      } catch (errors) {
        dialog(errors);
      }
      return resp;
    },

    *removeTitle({ payload: { id = '' } }, { call }) {
      try {
        const response = yield call(removeTitle, { id });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },

    *fetchDepartment(_, { call, put }) {
      try {
        const response = yield call(DepartmentFilter);
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
        const response = yield call(getListPermissionOfRole, idRoles);
        const { statusCode, data: listPermission = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { idRoles } });
        yield put({ type: 'saveOrigin', payload: { listPermission } });
        yield put({ type: 'saveTemp', payload: { listPermission } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchListPermission({ payload }, { call, put }) {
      try {
        const response = yield call(getListPermissionOfRole, payload);
        const { statusCode, data: newListPermission = [] } = response;
        if (statusCode !== 200) throw response;

        // yield put({ type: 'save', payload: { newListPermission } });
        yield put({ type: 'saveOrigin', payload: { newListPermission } });
        yield put({ type: 'saveTemp', payload: { newListPermission } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetchPermissionByIdRole({ payload: { id: _id = '' } = {} }, { call }) {
      let resp = [];
      try {
        const response = yield call(getPermissionByIdRole, { _id });
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
        const response = yield call(updateRoleWithPermission, getValues);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addPosition({ payload: { name = '' } }, { call, put }) {
      try {
        const response = yield call(addPosition, { name });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        yield put({ type: 'fetchListTitle' });
      } catch (errors) {
        dialog(errors);
      }
    },
    *addDepartment({ payload: { name = '' } }, { call, put }) {
      try {
        const response = yield call(addDepartment, { name });
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
    *removeDepartment({ payload: { id = '' } }, { call }) {
      try {
        const response = yield call(removeDepartment, { id });
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        return statusCode;
      } catch (errors) {
        dialog(errors);
        return 0;
      }
    },
    *getRolesByCompany({ payload: { company = '' } }, { call, put }) {
      try {
        const response = yield call(getRolesByCompany, { company });
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
