import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  queryCurrent,
  queryUpdateMileageRate,
  findUsers,
  getUserList,
  getEmployeeList,
} from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: false,
    user: {},
    showSuccess: true,
    userList: [],
  },

  effects: {
    *fetchCurrent(_, { call, put, select }) {
      const state = yield select(st => st);
      try {
        if (!state.currentUser) {
          const response = yield call(queryCurrent);
          if (response.statusCode !== 200) throw response;
          const { data: currentUser = {} } = response;
          let { roles = ['guest'] } = currentUser;
          roles = roles.map(role => {
            if (typeof role === 'string') return role.toLowerCase();
            return role._id.toLowerCase();
          });
          setAuthority(roles);
          reloadAuthorized();
          yield put({
            type: 'save',
            payload: { currentUser },
          });
        }
        return true;
      } catch (errors) {
        return false;
      }
    },
    *updateRate({ payload }, { put, call }) {
      try {
        const response = yield call(queryUpdateMileageRate, payload);
        const { data = {}, statusCode = 400 } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'user.mileage.rate.update.success' }),
        });
        yield put({
          type: 'save',
          payload: {
            currentUser: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateNotification({ payload }, { put, call }) {
      try {
        const response = yield call(queryUpdateMileageRate, payload);
        const { data = {}, statusCode = 400 } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'user.notification.success' }),
        });
        yield put({
          type: 'save',
          payload: {
            currentUser: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateUserProfile({ payload }, { put, call }) {
      try {
        const response = yield call(queryUpdateMileageRate, payload);
        const { data = {}, statusCode = 400 } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'user.profile.update.success' }),
        });
        yield put({
          type: 'save',
          payload: {
            currentUser: data,
          },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *find(
      {
        payload: { q },
      },
      { call, put }
    ) {
      try {
        let list = [];
        if (typeof q === 'string' && q.length > 0) {
          const response = yield call(findUsers, { q });
          const { data, statusCode = 400 } = response;
          if (statusCode !== 200) throw response;
          list = data;

          if (
            q.match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
          ) {
            list = [...list, { email: q }];
          }
        }
        yield put({
          type: 'save',
          payload: { list },
        });
        return list;
      } catch (errors) {
        dialog(errors);
        return false;
      }
    },
    *getUserList({ payload }, { put, call }) {
      try {
        const response = yield call(getUserList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { userList: data } });
      } catch (err) {
        dialog(err);
      }
    },
    *getEmployeeList({ payload }, { put, call }) {
      try {
        const response = yield call(getEmployeeList, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { employeeList: data } });
      } catch (err) {
        dialog(err);
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
