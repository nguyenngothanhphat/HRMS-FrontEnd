import { dialog } from '@/utils/utils';
import feedbackSubmit from '../services/feedback';

const country = {
  namespace: 'feedback',
  state: {
    feedback: {},
  },
  effects: {
    *submitFeedback({ payload = {} }, { call, put }) {
      try {
        const response = yield call(feedbackSubmit, payload);
        const { statusCode, data: feedback = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { feedback } });
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
export default country;
