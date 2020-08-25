import router from 'umi/router';
import { fetch, getById } from '@/services/history';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'reportHistory',

  state: {
    list: [],
    activities: [],
    listSearch: [],
  },

  effects: {
    *fetch({ payload }, { put, call, select }) {
      try {
        const { list = [] } = yield select(st => st.reportHistory);
        const response = yield call(fetch, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            list: [...list, ...data],
          },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *fetchItem({ payload: reId }, { call, put, select }) {
      try {
        if (reId) {
          const { activities = [] } = yield select(st => st.reportHistory);
          const response = yield call(getById, { reId });
          const { statusCode, data } = response;
          if (statusCode !== 200) throw response;
          yield put({
            type: 'save',
            payload: {
              activities: [...activities, ...data],
            },
          });
        }
      } catch (errors) {
        dialog(errors);
        yield call(router.push, '/report');
      }
    },
    *search({ payload }, { put, call }) {
      try {
        const response = yield call(fetch, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            listSearch: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *reset({ payload }, { put, call }) {
      try {
        const response = yield call(fetch, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            listSearch: data,
          },
        });
      } catch (error) {
        dialog(error);
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
