import { notification } from 'antd';
import { dialog } from '@/utils/utils';
// import { getCurrentTenant, getCurrentCompany } from '@/utils/authority';
import {
  getPermissionList,
  addNewAdmin,
  getListAdmin,
  updateAdminService,
  getLocationList,
  removeLocation,
  updateLocation,
  getListUsersOfOwner,
  removeAdmin,
} from '../services/adminApp';

const country = {
  namespace: 'adminApp',
  state: {
    permissionList: [],
    newAdmin: {},
    listAdmin: [],
    updateAdmin: {},
    locationsList: [],
    userListOfOwner: [],
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
    *updateAdmins({ payload = {}, isUpdateAvatar = false }, { call, put }) {
      try {
        const response = yield call(updateAdminService, payload);
        const { statusCode, data: updateAdmin = {} } = response;
        if (statusCode !== 200) throw response;
        if (!isUpdateAvatar) {
          notification.success({
            message: 'Update additional administrator successfully',
            // description: 'Update additional administrator successfully',
          });
          yield put({ type: 'save', payload: { updateAdmin } });
        } else {
          notification.success({
            message: 'Update your avatar successfully',
          });
        }
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchLocationList({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getLocationList, payload);
        const { statusCode, data: locationsList = [] } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { locationsList } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *removeLocation({ payload = {} }, { call }) {
      try {
        const response = yield call(removeLocation, payload);
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *updateLocation({ payload = {} }, { call }) {
      try {
        const response = yield call(updateLocation, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *fetchUsersListOfOwner({ payload = {} }, { call, put }) {
      try {
        const response = yield call(getListUsersOfOwner, payload);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { userListOfOwner: data?.listUser || [] } });
        return response;
      } catch (errors) {
        dialog(errors);
        return {};
      }
    },
    *removeAdmin({ payload = {} }, { call }) {
      try {
        const response = yield call(removeAdmin, payload);
        const { statusCode, message = '' } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        // yield put({ type: 'save', payload: { listAdmin: data?.users || [] } });
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
