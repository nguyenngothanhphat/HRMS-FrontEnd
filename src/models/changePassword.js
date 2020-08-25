import { notification } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi-plugin-react/locale';
import { resetPW, send, sendCompanycode, getbycode } from '@/services/changePassword';

import { dialog } from '@/utils/utils';

export default {
  namespace: 'sendemail',

  state: {
    listcode: [],
    email: {},
    companyinfo: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        const response = yield call(send, payload);
        const email = payload;
        const { statusCode, data } = response;
        if (statusCode === 200) {
          // notification.success({
          //   message: formatMessage({ id: 'forgot-password.change-password' }),
          // });
          yield call(router.push, '/sub-forgot-password');
        } else {
          throw response;
        }
        yield put({ type: 'save', payload: { listcode: data, email } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *changePW({ payload }, { call, put }) {
      try {
        const response = yield call(sendCompanycode, payload);
        const { statusCode, data } = response;
        if (statusCode === 200) {
          notification.success({
            message: formatMessage({ id: 'forgot-password.send-email' }),
          });
        } else {
          throw response;
        }
        yield put({ type: 'save', payload: { data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *newPW({ payload }, { call, put }) {
      try {
        const response = yield call(resetPW, payload);
        const { statusCode, data } = response;
        if (statusCode === 200) {
          notification.success({
            message: formatMessage({ id: 'forgot-password.change-password' }),
          });
          yield call(router.push, '/login');
        } else {
          throw response;
        }
        yield put({ type: 'save', payload: { data } });
      } catch (errors) {
        dialog(errors);
      }
    },
    *getcompanyInfo({ payload }, { call, put }) {
      try {
        const response = yield call(getbycode, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({ type: 'save', payload: { companyinfo: data } });
      } catch (errors) {
        dialog(errors);
      }
    },
  },
  *resetPW({ payload }, { call, put }) {
    try {
      const response = yield call(resetPW, payload);
      const { statusCode, data } = response;
      if (statusCode === 200) {
        notification.success({
          message: formatMessage({ id: 'forgot-password.change-password' }),
        });
      } else {
        throw response;
      }
      yield put({ type: 'save', payload: { data } });
    } catch (errors) {
      dialog(errors);
    }
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
