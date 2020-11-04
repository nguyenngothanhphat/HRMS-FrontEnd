import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getListRoles,
  getListTitle,
  getListPermissionOfRole,
  updateRoleWithPermission,
  getPermissionByIdRole,
} from '../services/adminSetting';

const adminSetting = {
  namespace: 'adminSetting',
  state: {
    idRoles: '',
    originData: {
      listTitle: [],
      listRoles: [],
      listPermission: [],
    },
    tempData: {
      listTitle: [],
      formatData: [],
      listPermission: [],
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
      try {
        const response = yield call(getListTitle);
        const { statusCode, data: listTitle = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'saveOrigin', payload: { listTitle } });
        yield put({ type: 'saveTemp', payload: { listTitle } });
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
