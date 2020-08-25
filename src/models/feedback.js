import { notification } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { addFeedback, findFeedback, updateFeedback } from '@/services/feedback';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'feedback',

  state: {
    feedbackItem: {},
    listFeedback: [],
    total: 0,
    filter: {},
  },

  effects: {
    *createFeedback({ payload }, { put, call }) {
      try {
        const response = yield call(addFeedback, payload);
        yield put({
          type: 'save',
          payload: { feedbackItem: response },
        });
      } catch (errors) {
        dialog(errors);
      }
    },
    *fetch({ payload }, { put, call }) {
      try {
        const response = yield call(findFeedback, payload);
        const { statusCode, data: listFeedback, total, more } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { listFeedback, total, more } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *updateFeedback({ payload }, { put, call }) {
      try {
        const response = yield call(updateFeedback, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: formatMessage({ id: 'feedback.remove.success' }),
        });
        yield put({ type: 'fetch' });
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
  },
};
