import { queryCurrent, query as queryUsers } from '@/services/user';
import { dialog } from '@/utils/utils';
import { setToken } from '@/utils/token';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
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
      } catch (errors) {
        setToken('');
        yield put({
          type: 'saveCurrentUser',
          payload: {
            currentUser: {},
          },
        });
        dialog(errors);
      }
    },
  },
  reducers: {
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
