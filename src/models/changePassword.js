import { history } from 'umi';
import { notification } from 'antd';
import { forgotPasswordAPI, resetPasswordAPI, updatePasswordAPI } from '@/services/changePassword';
import { dialog } from '@/utils/utils';

export default {
  namespace: 'changePassword',

  state: {
    statusSendEmail: false,
    statusChangePassword: false,
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
    *updatePassword({ payload, isFirstLogin = false }, { call, put }) {
      let statusChangePassword = false;
      let response = '';
      try {
        response = yield call(updatePasswordAPI, payload);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        if (!isFirstLogin) {
          notification.success({
            message,
          });
        } else {
          notification.success({
            message: 'Updated password successfully. Please login again!',
          });
        }

        statusChangePassword = true;
      } catch (errors) {
        statusChangePassword = false;
        dialog(errors);
      }
      yield put({
        type: 'save',
        payload: { statusChangePassword },
      });
      return response;
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
