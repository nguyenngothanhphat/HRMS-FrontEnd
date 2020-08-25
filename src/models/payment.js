import router from 'umi/router';
import fetchById, { markPaid } from '@/services/payment';
import { notification } from 'antd';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'payment',

  state: {
    item: false,
  },

  effects: {
    *fetchById({ payload }, { put, call }) {
      try {
        const response = yield call(fetchById, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            item: data,
          },
        });
      } catch (error) {
        dialog(error);
      }
    },
    *markPaid({ payload }, { call }) {
      try {
        const response = yield call(markPaid, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({ message });
        yield call(router.push, '/payment');
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
