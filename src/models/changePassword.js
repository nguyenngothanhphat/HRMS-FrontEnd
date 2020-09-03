import { forgotPasswordAPI } from '@/services/changePassword';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'changePassword',

  state: {
    statusSendEmail: false,
  },

  effects: {
    *forgotPassword({ payload }, { call, put }) {
      try {
        const response = yield call(forgotPasswordAPI, payload);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { statusSendEmail: true } });
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
