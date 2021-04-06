import { queryCurrent, query as queryUsers, fetchCompanyOfUser } from '@/services/user';
import { getCurrentCompany, setCurrentLocation, getCurrentLocation } from '@/utils/authority';

import { history } from 'umi';
import { checkPermissions } from '@/utils/permissions';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    permissions: {},
    companiesOfUser: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      try {
        const response = yield call(queryCurrent);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;

        // if there's no tenantId and companyId, return to dashboard
        const tenantId = localStorage.getItem('tenantId');
        const currentCompanyId = getCurrentCompany();
        if (!tenantId || !currentCompanyId) {
          history.replace('/control-panel');
        }

        yield put({
          type: 'saveCurrentUser',
          payload: {
            ...response.data,
            name: response.data?.firstName,
            // name: [response.data?.generalInfo?.firstName, response.data?.generalInfo?.lastName]
            //   .filter(Boolean)
            //   .join(' '),
          },
        });

        const currentLocation = getCurrentLocation();
        if (!currentLocation) {
          setCurrentLocation(response?.data?.location?._id);
        }

        yield put({
          type: 'save',
          payload: {
            permissions: checkPermissions(response.data.roles),
          },
        });
      } catch (errors) {
        // error
      } finally {
        yield put({
          type: 'fetchCompanyOfUser',
        });
      }
    },

    *fetchCompanyOfUser(_, { call, put }) {
      try {
        const response = yield call(fetchCompanyOfUser);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            companiesOfUser: data?.listCompany,
          },
        });
      } catch (errors) {
        // error
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

    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
