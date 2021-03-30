import { dialog } from '@/utils/utils';
import { notification } from 'antd';
import {
  getPermissionList,
  addNewAdmin,
  getListAdmin,
  updateAdminService,
} from '../services/adminApp';

const country = {
  namespace: 'adminApp',
  state: {
    permissionList: [],
    newAdmin: {},
    listAdmin: [],
    updateAdmin: {},
  },
  effects: {
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
    *addNewAdmin({ payload = {} }, { call, put }) {
      try {
        const response = yield call(addNewAdmin, payload);
        const { statusCode, data: newAdmin = {} } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Add new additional administrator successfully',
        });
        yield put({ type: 'save', payload: { newAdmin } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *getListAdmin({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListAdmin, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listAdmin: data?.users || [] } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *updateAdmins({ payload = {} }, { call, put }) {
      try {
        const response = yield call(updateAdminService, payload);
        const { statusCode, data: updateAdmin = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { updateAdmin } });
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
  },
};
export default country;
