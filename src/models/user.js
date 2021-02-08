import { queryCurrent, query as queryUsers } from '@/services/user';
import { checkPermissions } from '@/utils/permissions';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    permissions: {},
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
        yield put({
          type: 'saveCurrentUser',
          payload: {
            ...response.data,
            name: [response.data?.generalInfo?.firstName, response.data?.generalInfo?.lastName]
              .filter(Boolean)
              .join(' '),
          },
        });

        let currentLocation = localStorage.getItem('currentLocation');
        if (!currentLocation) {
          currentLocation = localStorage.setItem('currentLocation', response?.data?.location?._id);
        }

        yield put({
          type: 'save',
          payload: {
            permissions: checkPermissions(response.data.roles),
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
