import { forgotPasswordAPI, resetPasswordAPI } from '@/services/changePassword';
import { dialog } from '@/utils/utils';
import { history } from 'umi';
import { notification } from 'antd';

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
    *resetPassword({ payload }, { call }) {
      try {
        const response = yield call(resetPasswordAPI, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message,
        });
        history.replace('/login');
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
